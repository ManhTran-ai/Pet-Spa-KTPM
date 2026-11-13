import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import SwaggerParser from '@apidevtools/swagger-parser';
import { DOCS_DIR, log, readText } from './lib/common.mjs';

const openapiPath = path.join(DOCS_DIR, 'design', 'openapi.yaml');

async function main() {
  let content;
  try {
    content = await readText(openapiPath);
  } catch {
    log(`Chưa có ${path.relative(process.cwd(), openapiPath)} (tạo ở Ngày 4).`);
    process.exitCode = 1;
    return;
  }

  let document;
  try {
    document = parseYaml(content);
  } catch (error) {
    console.error(`VI PHẠM: YAML không hợp lệ: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  try {
    await SwaggerParser.validate(openapiPath);
  } catch (error) {
    console.error(`VI PHẠM: OpenAPI không hợp lệ: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const pathKeys = Object.keys(document.paths ?? {});
  if (pathKeys.length === 0) {
    console.error('VI PHẠM: `paths` không có endpoint nào.');
    process.exitCode = 1;
    return;
  }

  log(`OpenAPI hợp lệ. Số endpoint: ${pathKeys.length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
