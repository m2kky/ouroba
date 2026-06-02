import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';

// Read the media map from the frontend project
const mapContent = fs.readFileSync('../orouba_new/src/data/r2MediaMap.js', 'utf8');
// Extract the JSON part of R2_MEDIA_MAP
const jsonStr = mapContent.substring(
  mapContent.indexOf('{'),
  mapContent.lastIndexOf('}') + 1
);
const R2_MEDIA_MAP = eval('(' + jsonStr + ')');

const accountId = 'bbaa9c7731052070a06ea5c14d029691';
const accessKeyId = 'aefdf27bec690e4c91f3c99a56d606ea';
const secretAccessKey = 'ee5fd68a6430224c326bf8ad3e63b7b6875c2b58776e091f5a353d34c43dd59c';
const bucketName = 'orouba-media';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function main() {
  console.log("Fetching all objects from R2...");
  const r2Keys = new Set<string>();
  let continuationToken: string | undefined = undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      ContinuationToken: continuationToken,
    });
    const response = await s3.send(command);
    for (const item of response.Contents || []) {
      if (item.Key) r2Keys.add(item.Key);
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log(`Found ${r2Keys.size} files in R2 bucket.`);

  // All expected files (based on local zip mapping)
  const expectedFiles = new Set(Object.values(R2_MEDIA_MAP));
  console.log(`Expecting ${expectedFiles.size} unique files based on the old site.`);

  const missingFiles = [];
  for (const expected of expectedFiles) {
    if (typeof expected === 'string' && !r2Keys.has(expected)) {
      missingFiles.push(expected);
    }
  }

  console.log(`\nFound ${missingFiles.length} missing files!`);
  
  if (missingFiles.length > 0) {
    fs.writeFileSync('missing_r2_files.txt', missingFiles.join('\n'));
    console.log('Saved missing files list to missing_r2_files.txt');
  }
}

main().catch(console.error);
