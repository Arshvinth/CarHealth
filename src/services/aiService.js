const API_BASE = '/api';

const ALLOWED_SEVERITIES = new Set(['Critical', 'High', 'Moderate', 'Low']);

/**
 * Validates the AI report structure returned by the backend before rendering
 * to guarantee safe UI rendering and reject malformed responses.
 */
function assertValidAIReport(report) {
  if (!report || typeof report !== 'object') {
    throw new Error('Received an invalid diagnostic report payload from the server.');
  }
  if (!report.problemSummary?.summary || !report.problemSummary?.affectedSystem) {
    throw new Error('Diagnostic report is missing problem summary details.');
  }
  if (!Array.isArray(report.possibleCauses) || report.possibleCauses.length === 0) {
    throw new Error('Diagnostic report did not include ranked possible causes.');
  }
  if (!ALLOWED_SEVERITIES.has(report.severityAssessment?.level)) {
    throw new Error('Diagnostic report returned an unrecognized severity level.');
  }
  if (!report.drivingRecommendation?.recommendation) {
    throw new Error('Diagnostic report is missing a driving safety recommendation.');
  }
  return report;
}

export class AIServiceError extends Error {
  constructor(message, { code = 'AI_UNAVAILABLE', status = 503, details = null } = {}) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Checks whether the backend API server and configured AI provider are available.
 */
export async function checkAIHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return { reachable: false, configured: false };
    }
    const data = await res.json();
    return {
      reachable: true,
      configured: Boolean(data?.ai?.configured),
      provider: data?.ai?.provider || 'gemini',
      model: data?.ai?.model || '',
    };
  } catch {
    return { reachable: false, configured: false };
  }
}

/**
 * Sends structured vehicle & symptom context to the CarHealth backend AI service.
 * Never fabricates diagnostic results if the backend or AI provider is unavailable.
 */
export async function analyzeVehicleSymptoms(payload) {
  let response;
  try {
    response = await fetch(`${API_BASE}/symptoms/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new AIServiceError(
      'Unable to connect to the CarHealth diagnostic backend server. Make sure the backend service is running (npm run server) and try again.',
      { code: 'BACKEND_UNREACHABLE', status: 503 }
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error ||
      (response.status === 503
        ? 'AI symptom diagnosis is temporarily unavailable.'
        : 'The diagnostic service encountered an error while analyzing your vehicle.');

    throw new AIServiceError(message, {
      code: data?.code || (response.status === 400 ? 'VALIDATION_ERROR' : 'AI_UNAVAILABLE'),
      status: response.status,
      details: data?.errors || null,
    });
  }

  const validated = assertValidAIReport(data?.report);

  return {
    provider: data.provider || 'gemini',
    model: data.model || '',
    generatedAt: data.generatedAt || new Date().toISOString(),
    report: validated,
  };
}
