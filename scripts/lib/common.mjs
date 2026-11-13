import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const ROOT = process.cwd();
export const DOCS_DIR = path.join(ROOT, 'docs');
export const REPORTS_DIR = path.join(ROOT, 'reports');
export const RAW_DIR = path.join(REPORTS_DIR, 'raw');

export async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

export async function readText(filePath) {
  return readFile(filePath, 'utf8');
}

export async function writeText(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, content, 'utf8');
}

export function parseCsv(content) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  const text = content.replace(/^\uFEFF/, '');

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length === 0) {
    return { headers: [], records: [] };
  }

  const headers = rows[0].map((h) => h.trim());
  const records = rows
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== ''))
    .map((r) => Object.fromEntries(headers.map((h, index) => [h, (r[index] ?? '').trim()])));

  return { headers, records };
}

export function toCsv(headers, records) {
  const escape = (value) => {
    const text = value === undefined || value === null ? '' : String(value);
    return /[",\n\r]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  };

  const lines = [headers.map(escape).join(',')];
  for (const record of records) {
    lines.push(headers.map((h) => escape(record[h])).join(','));
  }
  return lines.join('\n') + '\n';
}

export async function listFiles(dir, extension) {
  if (!existsSync(dir)) {
    return [];
  }
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

export function log(message) {
  console.log(message);
}

export function fail(message) {
  console.error(message);
  process.exitCode = 1;
}
