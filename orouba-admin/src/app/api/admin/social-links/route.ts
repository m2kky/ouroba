import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SocialInput = {
  id?: string | null;
  image?: string | null;
  link?: string | null;
  isHidden?: boolean;
};

type ParentInput = {
  id?: string | null;
  image?: string | null;
  socials?: SocialInput[];
};

const isPersistedId = (id?: string | null) => Boolean(id && !id.startsWith("new-"));

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parents = await prisma.socialParent.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        socials: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(parents);
  } catch (error) {
    console.error("Failed to fetch social links:", error);
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parents = body.parents as ParentInput[];

    if (!Array.isArray(parents)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    for (const parent of parents) {
      if (!parent.image?.trim()) {
        return NextResponse.json({ error: "Each logo group must have an image" }, { status: 400 });
      }
    }

    const savedParents = await prisma.$transaction(async (tx) => {
      const existingParents = await tx.socialParent.findMany({ select: { id: true } });
      const incomingParentIds = parents
        .map((parent) => parent.id)
        .filter(isPersistedId) as string[];
      const deletedParentIds = existingParents
        .map((parent) => parent.id)
        .filter((id) => !incomingParentIds.includes(id));

      if (deletedParentIds.length) {
        await tx.socialParent.deleteMany({ where: { id: { in: deletedParentIds } } });
      }

      for (const parent of parents) {
        const cleanSocials = (parent.socials || []).filter((social) => social.link?.trim());
        let parentId = parent.id || "";

        if (isPersistedId(parent.id)) {
          await tx.socialParent.update({
            where: { id: parent.id as string },
            data: { image: parent.image!.trim() },
          });
        } else {
          const created = await tx.socialParent.create({
            data: { image: parent.image!.trim() },
          });
          parentId = created.id;
        }

        const incomingSocialIds = cleanSocials
          .map((social) => social.id)
          .filter(isPersistedId) as string[];

        await tx.social.deleteMany({
          where: {
            parentId,
            id: { notIn: incomingSocialIds },
          },
        });

        for (const social of cleanSocials) {
          const data = {
            image: social.image?.trim() || null,
            link: social.link!.trim(),
            isHidden: Boolean(social.isHidden),
            parentId,
          };

          if (isPersistedId(social.id)) {
            await tx.social.update({
              where: { id: social.id as string },
              data,
            });
          } else {
            await tx.social.create({ data });
          }
        }
      }

      return tx.socialParent.findMany({
        orderBy: { createdAt: "asc" },
        include: { socials: { orderBy: { createdAt: "asc" } } },
      });
    });

    return NextResponse.json(savedParents);
  } catch (error) {
    console.error("Failed to save social links:", error);
    return NextResponse.json({ error: "Failed to save social links" }, { status: 500 });
  }
}
