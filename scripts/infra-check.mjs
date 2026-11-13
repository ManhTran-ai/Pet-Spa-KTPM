import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ROOT, log, readText } from './lib/common.mjs';

const ciPath = path.join(ROOT, '.github', 'workflows', 'ci.yml');
const composePath = path.join(ROOT, 'docker-compose.yml');

const REQUIRED_JOBS = ['lint', 'typecheck', 'test'];

async function main() {
  const problems = [];

  let ci;
  try {
    ci = parseYaml(await readText(ciPath));
  } catch (error) {
    problems.push(`CI: YAML không hợp lệ: ${error.message}`);
  }

  if (ci) {
    const steps = ci.jobs?.quality?.steps ?? [];
    const commands = steps.map((step) => step.run ?? '');
    for (const job of REQUIRED_JOBS) {
      if (!commands.some((command) => command.includes(job))) {
        problems.push(`CI: thiếu bước chạy "${job}".`);
      }
    }
    if (!ci.jobs?.quality?.steps?.some((step) => step.uses?.startsWith('actions/checkout'))) {
      problems.push('CI: thiếu bước actions/checkout.');
    }
    if (!ci.jobs?.quality?.steps?.some((step) => step.uses?.startsWith('actions/setup-node'))) {
      problems.push('CI: thiếu bước actions/setup-node.');
    }
  }

  let compose;
  try {
    compose = parseYaml(await readText(composePath));
  } catch (error) {
    problems.push(`docker-compose.yml: YAML không hợp lệ: ${error.message}`);
  }

  if (compose && !compose.services?.postgres) {
    problems.push('docker-compose.yml: thiếu dịch vụ postgres.');
  }

  for (const problem of problems) {
    console.error(`VI PHẠM: ${problem}`);
  }

  if (problems.length === 0) {
    log('Cấu hình CI và docker-compose hợp lệ.');
  } else {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
