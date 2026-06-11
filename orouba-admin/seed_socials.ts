import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const sql = fs.readFileSync('../campcod3_eloroba.sql', 'utf8');

    const parentsMap = new Map<string, string>(); // legacy id -> new id

    // Parse social_parents
    const rxP = /INSERT INTO `social_parents` \(`id`, `image`, `created_at`, `updated_at`\) VALUES\s*([\s\S]*?);/g;
    const matchP = rxP.exec(sql);
    if (matchP) {
        const rows = matchP[1].split(/\),\s*\(/g).map(r => r.replace(/^\(|\)$/g, ''));
        for (const row of rows) {
            // (1, 'https://...', '2024...', '2024...')
            const parts = row.split(',').map(s => s.trim().replace(/^'|'$/g, ''));
            const legacyId = parts[0];
            const image = parts[1];

            const created = await prisma.socialParent.create({
                data: { image }
            });
            parentsMap.set(legacyId, created.id);
            console.log(`Created parent ${created.id} for legacy ${legacyId}`);
        }
    }

    // Parse socials
    // (`id`, `link`, `image`, `hidden`, `created_at`, `updated_at`, `social_parent_id`)
    const rxS = /INSERT INTO `socials` \(`id`, `link`, `image`, `hidden`, `created_at`, `updated_at`, `social_parent_id`\) VALUES\s*([\s\S]*?);/g;
    const matchS = rxS.exec(sql);
    if (matchS) {
        const rows = matchS[1].split(/\),\s*\(/g).map(r => r.replace(/^\(|\)$/g, ''));
        for (const row of rows) {
            const parts = row.split(',').map(s => s.trim().replace(/^'|'$/g, ''));
            const legacyId = parts[0];
            const link = parts[1];
            const image = parts[2];
            const hidden = parts[3] === '1';
            const legacyParentId = parts[6];

            if (legacyParentId && legacyParentId !== 'NULL' && parentsMap.has(legacyParentId)) {
                await prisma.social.create({
                    data: {
                        link,
                        image,
                        isHidden: hidden,
                        parentId: parentsMap.get(legacyParentId)
                    }
                });
                console.log(`Created social link ${link} for parent ${legacyParentId}`);
            }
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
