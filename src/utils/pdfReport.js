function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatList(items = []) {
  if (!Array.isArray(items) || items.length === 0) return '<p class="muted">None listed.</p>';
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

/**
 * Opens a clean, print-ready CarHealth technical PDF report sheet and invokes
 * the browser Print / Save as PDF dialog.
 */
export function downloadDiagnosticPdf({
  reportId = 'UNSAVED-PREVIEW',
  diagnosisDate = new Date().toISOString(),
  vehicleType = '',
  vehicleDetails = {},
  symptomDescription = '',
  additionalSelections = {},
  aiReport,
  notes = '',
  status = 'Open',
}) {
  if (!aiReport) return false;

  const formattedDate = new Date(diagnosisDate).toLocaleString();
  const vehicleTitle =
    [vehicleDetails.year, vehicleDetails.manufacturer, vehicleDetails.model]
      .filter(Boolean)
      .join(' ') || `${String(vehicleType).toUpperCase()} Vehicle`;

  const causesHtml = (aiReport.possibleCauses || [])
    .map(
      (cause, idx) => `
      <div class="cause-card">
        <div class="cause-head">
          <strong>#${cause.rank || idx + 1} ${escapeHtml(cause.componentName)}</strong>
          <span class="pill">${escapeHtml(cause.likelihood)}</span>
        </div>
        <p>${escapeHtml(cause.explanation)}</p>
        <p><strong>Why it matches your symptoms:</strong> ${escapeHtml(cause.whyItMatches)}</p>
        <p><strong>Recommended inspection:</strong> ${escapeHtml(cause.recommendedInspection)}</p>
      </div>
    `
    )
    .join('');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>CarHealth Diagnostic Report - ${escapeHtml(reportId)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 32px;
      line-height: 1.5;
      font-size: 13px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0b1220;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand { font-size: 22px; font-weight: 800; color: #0b1220; }
    .brand span { color: #2563eb; }
    .tagline { font-size: 11px; color: #475569; margin-top: 2px; }
    .meta { text-align: right; font-size: 11px; color: #475569; }
    .meta strong { color: #0f172a; }
    .banner {
      border: 1px solid #cbd5e1;
      border-left: 5px solid #2563eb;
      background: #f8fafc;
      padding: 14px 16px;
      border-radius: 8px;
      margin-bottom: 18px;
    }
    .banner.critical { border-left-color: #dc2626; background: #fef2f2; }
    .banner.high { border-left-color: #ea580c; background: #fff7ed; }
    .banner.moderate { border-left-color: #d97706; background: #fffbeb; }
    .banner.low { border-left-color: #059669; background: #ecfdf5; }
    h2 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0b1220;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin: 22px 0 10px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .box {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #f8fafc;
    }
    .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .val { font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px; }
    .cause-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .cause-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
    }
    ul { margin: 6px 0 0 18px; padding: 0; }
    li { margin-bottom: 4px; }
    .muted { color: #64748b; }
    .disclaimer {
      margin-top: 24px;
      padding: 12px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 11px;
      color: #334155;
      background: #f8fafc;
    }
    @media print {
      body { padding: 14px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Car<span>Health</span></div>
      <div class="tagline">AI Symptom-Based Vehicle Diagnostic Assessment</div>
    </div>
    <div class="meta">
      <div>Report ID: <strong>${escapeHtml(reportId)}</strong></div>
      <div>Generated: <strong>${escapeHtml(formattedDate)}</strong></div>
      <div>Status: <strong>${escapeHtml(status)}</strong></div>
    </div>
  </div>

  <div class="banner ${escapeHtml((aiReport.severityAssessment?.level || 'moderate').toLowerCase())}">
    <div class="label">Severity &amp; Driving Guidance</div>
    <div class="val">${escapeHtml(aiReport.severityAssessment?.level)} Severity — ${escapeHtml(aiReport.drivingRecommendation?.recommendation)}</div>
    <p style="margin:6px 0 0;">${escapeHtml(aiReport.severityAssessment?.reasoning)}</p>
    <p style="margin:4px 0 0;">${escapeHtml(aiReport.drivingRecommendation?.details)}</p>
  </div>

  <div class="grid">
    <div class="box">
      <div class="label">Vehicle Context</div>
      <div class="val">${escapeHtml(vehicleTitle)}</div>
      <div class="muted">Powertrain: ${escapeHtml(String(vehicleType).toUpperCase())}${vehicleDetails.mileage ? ` · Mileage: ${escapeHtml(vehicleDetails.mileage)}` : ''}</div>
    </div>
    <div class="box">
      <div class="label">Affected Vehicle System</div>
      <div class="val">${escapeHtml(aiReport.problemSummary?.affectedSystem)}</div>
      <div class="muted">${escapeHtml(aiReport.problemSummary?.vehicleContextNote || '')}</div>
    </div>
  </div>

  <h2>Problem Summary</h2>
  <p>${escapeHtml(aiReport.problemSummary?.summary)}</p>
  <div class="box" style="margin-top:8px;">
    <div class="label">Reported Symptom Description</div>
    <p style="margin:4px 0 0;">"${escapeHtml(symptomDescription)}"</p>
    ${
      additionalSelections?.whenOccurs?.length || additionalSelections?.whereOccurs?.length
        ? `<p class="muted" style="margin:6px 0 0;font-size:11px;">
            ${additionalSelections.whenOccurs?.length ? `When: ${escapeHtml(additionalSelections.whenOccurs.join(', '))} · ` : ''}
            ${additionalSelections.whereOccurs?.length ? `Where: ${escapeHtml(additionalSelections.whereOccurs.join(', '))} · ` : ''}
            ${additionalSelections.frequency ? `Frequency: ${escapeHtml(additionalSelections.frequency)}` : ''}
          </p>`
        : ''
    }
  </div>

  <h2>Ranked Possible Causes</h2>
  ${causesHtml}

  <h2>Recommended Actions</h2>
  <div class="grid">
    <div class="box">
      <div class="label">Safe Owner Visual Checks</div>
      ${formatList(aiReport.recommendedActions?.basicVisualChecks)}
    </div>
    <div class="box">
      <div class="label">Qualified Mechanic Inspections</div>
      ${formatList(aiReport.recommendedActions?.mechanicChecks)}
    </div>
  </div>
  <div class="box" style="margin-top:10px;">
    <div class="label">Professional Repairs Only</div>
    ${formatList(aiReport.recommendedActions?.professionalRepairs)}
  </div>

  ${
    aiReport.safetyNotes?.highVoltagePrecautions?.length
      ? `<h2>High-Voltage Safety Precautions (EV / Hybrid)</h2>${formatList(aiReport.safetyNotes.highVoltagePrecautions)}`
      : ''
  }

  ${
    aiReport.relatedComponents?.length
      ? `<h2>Related Components</h2><p>${escapeHtml(aiReport.relatedComponents.join(' · '))}</p>`
      : ''
  }

  ${
    notes
      ? `<h2>Owner / Technician Notes</h2><div class="box">${escapeHtml(notes)}</div>`
      : ''
  }

  <div class="disclaimer">
    <strong>Important Diagnostic Disclaimer:</strong> ${escapeHtml(aiReport.safetyNotes?.disclaimer)}
  </div>

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>
</body>
</html>`;

  const printWin = window.open('', '_blank', 'width=940,height=780');
  if (!printWin) return false;
  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();
  return true;
}
