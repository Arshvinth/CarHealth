import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_ROOT = __dirname;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// Load server/.env first, then project root .env if present
loadEnvFile(path.join(SERVER_ROOT, '.env'));
loadEnvFile(path.resolve(SERVER_ROOT, '..', '.env'));

export const CONFIG = {
  port: Number(process.env.PORT || 3001),
  aiProvider: (process.env.AI_PROVIDER || 'gemini').toLowerCase(),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  dataDir: path.join(SERVER_ROOT, 'data'),
  reportsFile: path.join(SERVER_ROOT, 'data', 'reports.json'),
};
