import http from 'node:http';
import { CONFIG } from './config.js';
import { generateSymptomDiagnosis, getAIHealthStatus } from './services/aiProvider.js';
import {
  createReport,
  deleteReport,
  getReportById,
  listReports,
  updateReport,
} from './services/reportStore.js';
import { validateSymptomRequest } from './validation/reportSchema.js';

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': CONFIG.corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error('Request payload too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON payload.'));
      }
    });
    req.on('error', reject);
  });
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    const method = req.method || 'GET';

    if (method === 'OPTIONS') {
      sendJson(res, 204, {});
      return;
    }

    try {
      // Health check endpoint
      if (pathname === '/api/health' && method === 'GET') {
        sendJson(res, 200, {
          status: 'ok',
          service: 'carhealth-api',
          ai: getAIHealthStatus(),
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // AI Symptom Analysis endpoint
      if (pathname === '/api/symptoms/analyze' && method === 'POST') {
        const body = await readJsonBody(req);
        const validation = validateSymptomRequest(body);

        if (!validation.valid) {
          sendJson(res, 400, {
            error: validation.errors[0],
            errors: validation.errors,
            code: 'VALIDATION_ERROR',
          });
          return;
        }

        const result = await generateSymptomDiagnosis(validation.sanitized);
        sendJson(res, 200, result);
        return;
      }

      // Saved Symptom Reports CRUD
      if (pathname === '/api/reports' && method === 'GET') {
        const userId = url.searchParams.get('userId') || undefined;
        const reports = await listReports(userId);
        sendJson(res, 200, { reports });
        return;
      }

      if (pathname === '/api/reports' && method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.aiReport || !body.symptomDescription) {
          sendJson(res, 400, {
            error: 'Both symptomDescription and aiReport are required to save a diagnostic report.',
            code: 'VALIDATION_ERROR',
          });
          return;
        }
        const saved = await createReport(body);
        sendJson(res, 201, { report: saved });
        return;
      }

      const reportMatch = pathname.match(/^\/api\/reports\/([^/]+)$/);
      if (reportMatch) {
        const reportId = decodeURIComponent(reportMatch[1]);

        if (method === 'GET') {
          const found = await getReportById(reportId);
          if (!found) {
            sendJson(res, 404, { error: 'Diagnostic report not found.' });
            return;
          }
          sendJson(res, 200, { report: found });
          return;
        }

        if (method === 'PATCH') {
          const body = await readJsonBody(req);
          const updated = await updateReport(reportId, body);
          if (!updated) {
            sendJson(res, 404, { error: 'Diagnostic report not found.' });
            return;
          }
          sendJson(res, 200, { report: updated });
          return;
        }

        if (method === 'DELETE') {
          const removed = await deleteReport(reportId);
          if (!removed) {
            sendJson(res, 404, { error: 'Diagnostic report not found.' });
            return;
          }
          sendJson(res, 200, { deleted: true, id: reportId });
          return;
        }
      }

      sendJson(res, 404, { error: `Route ${method} ${pathname} not found.` });
    } catch (err) {
      const status = err.statusCode || 500;
      sendJson(res, status, {
        error: err.message || 'An unexpected backend error occurred.',
        code: err.code || 'INTERNAL_SERVER_ERROR',
      });
    }
  });
}

if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  const server = createServer();
  server.listen(CONFIG.port, () => {
    const ai = getAIHealthStatus();
    console.log(
      `[CarHealth API] Listening on http://localhost:${CONFIG.port} | AI Provider: ${ai.provider} (${ai.model}) | API Key: ${
        ai.configured ? 'Configured' : 'NOT SET'
      }`
    );
  });
}
