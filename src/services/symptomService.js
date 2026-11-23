const API_BASE = '/api';
const LOCAL_STORAGE_KEY = 'carhealth_symptom_reports_v1';
const DEFAULT_USER_ID = 'usr-alex-mercer';

function readLocalReports() {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalReports(reports) {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

function generateLocalId() {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `SYM-${new Date().getFullYear()}-${randomPart}`;
}

export async function listSymptomReports(userId = DEFAULT_USER_ID) {
  try {
    const res = await fetch(`${API_BASE}/reports?userId=${encodeURIComponent(userId)}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      const serverReports = Array.isArray(data?.reports) ? data.reports : [];
      writeLocalReports(serverReports);
      return { reports: serverReports, source: 'server' };
    }
  } catch {
    // Fall back to local persisted cache when backend is offline
  }

  const localReports = readLocalReports();
  return { reports: localReports, source: 'local' };
}

export async function getSymptomReportById(id) {
  try {
    const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.report) return data.report;
    }
  } catch {
    // Fall back to local cache
  }

  const local = readLocalReports();
  return local.find((r) => r.id === id) || null;
}

export async function saveSymptomReport({
  userId = DEFAULT_USER_ID,
  vehicleId = null,
  vehicleType,
  vehicleDetails = {},
  symptomDescription,
  additionalSelections = {},
  aiReport,
  severity,
  provider = 'gemini',
  model = '',
  notes = '',
}) {
  const payload = {
    userId,
    vehicleId,
    vehicleType,
    vehicleDetails,
    symptomDescription,
    additionalSelections,
    aiReport,
    severity: severity || aiReport?.severityAssessment?.level || 'Moderate',
    diagnosisDate: new Date().toISOString(),
    status: 'Open',
    notes,
    provider,
    model,
  };

  try {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const saved = data.report;
      const existing = readLocalReports().filter((r) => r.id !== saved.id);
      writeLocalReports([saved, ...existing]);
      return { report: saved, synced: true };
    }
  } catch {
    // Offline fallback saves locally so user never loses their report
  }

  const localRecord = {
    id: generateLocalId(),
    ...payload,
    updatedAt: payload.diagnosisDate,
  };
  const existing = readLocalReports();
  writeLocalReports([localRecord, ...existing]);
  return { report: localRecord, synced: false };
}

export async function updateSymptomReport(id, updates) {
  try {
    const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      const data = await res.json();
      const updated = data.report;
      const existing = readLocalReports();
      const next = existing.some((r) => r.id === id)
        ? existing.map((r) => (r.id === id ? updated : r))
        : [updated, ...existing];
      writeLocalReports(next);
      return updated;
    }
  } catch {
    // Fall back to local cache update
  }

  const existing = readLocalReports();
  let updatedRecord = null;
  const next = existing.map((r) => {
    if (r.id !== id) return r;
    updatedRecord = { ...r, ...updates, updatedAt: new Date().toISOString() };
    return updatedRecord;
  });
  if (updatedRecord) {
    writeLocalReports(next);
  }
  return updatedRecord;
}

export async function deleteSymptomReport(id) {
  try {
    await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch {
    // Continue removing from local store
  }

  const next = readLocalReports().filter((r) => r.id !== id);
  writeLocalReports(next);
  return true;
}
