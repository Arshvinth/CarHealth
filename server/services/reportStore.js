import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { CONFIG } from '../config.js';

async function ensureStore() {
  await fs.mkdir(CONFIG.dataDir, { recursive: true });
  try {
    await fs.access(CONFIG.reportsFile);
  } catch {
    await fs.writeFile(CONFIG.reportsFile, '[]', 'utf8');
  }
}

async function readReports() {
  await ensureStore();
  try {
    const raw = await fs.readFile(CONFIG.reportsFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeReports(reports) {
  await ensureStore();
  await fs.writeFile(CONFIG.reportsFile, JSON.stringify(reports, null, 2), 'utf8');
}

export async function listReports(userId) {
  const all = await readReports();
  const filtered = userId ? all.filter((r) => r.userId === userId) : all;
  return filtered.sort((a, b) => new Date(b.diagnosisDate) - new Date(a.diagnosisDate));
}

export async function getReportById(id) {
  const all = await readReports();
  return all.find((r) => r.id === id) || null;
}

export async function createReport(payload) {
  const all = await readReports();
  const now = new Date().toISOString();
  const record = {
    id: `SYM-${new Date().getFullYear()}-${crypto.randomInt(1000, 9999)}`,
    userId: String(payload.userId || 'usr-alex-mercer'),
    vehicleId: payload.vehicleId || null,
    vehicleType: String(payload.vehicleType || 'petrol'),
    vehicleDetails: payload.vehicleDetails || {},
    symptomDescription: String(payload.symptomDescription || ''),
    additionalSelections: payload.additionalSelections || {
      whenOccurs: [],
      whereOccurs: [],
      symptomTypes: [],
      frequency: '',
      followUpAnswers: [],
    },
    aiReport: payload.aiReport,
    severity: payload.severity || payload.aiReport?.severityAssessment?.level || 'Moderate',
    diagnosisDate: payload.diagnosisDate || now,
    status: payload.status === 'Resolved' ? 'Resolved' : 'Open',
    notes: String(payload.notes || ''),
    provider: payload.provider || 'gemini',
    model: payload.model || CONFIG.geminiModel,
    updatedAt: now,
  };

  all.unshift(record);
  await writeReports(all);
  return record;
}

export async function updateReport(id, updates) {
  const all = await readReports();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = all[index];
  const updated = {
    ...current,
    ...(typeof updates.notes === 'string' ? { notes: updates.notes.slice(0, 2000) } : {}),
    ...(updates.status === 'Open' || updates.status === 'Resolved'
      ? { status: updates.status }
      : {}),
    ...(updates.aiReport ? { aiReport: updates.aiReport } : {}),
    ...(updates.severity ? { severity: updates.severity } : {}),
    ...(updates.additionalSelections ? { additionalSelections: updates.additionalSelections } : {}),
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  await writeReports(all);
  return updated;
}

export async function deleteReport(id) {
  const all = await readReports();
  const next = all.filter((r) => r.id !== id);
  if (next.length === all.length) return false;
  await writeReports(next);
  return true;
}
