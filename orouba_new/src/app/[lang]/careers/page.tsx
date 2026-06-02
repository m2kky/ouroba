import CareersView from "@/views/Careers/Careers";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  return <CareersView />;
}
