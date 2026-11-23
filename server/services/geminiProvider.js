import { CONFIG } from '../config.js';
import {
  ALLOWED_DRIVING_RECOMMENDATIONS,
  ALLOWED_LIKELIHOODS,
  ALLOWED_SEVERITIES,
  validateAIReport,
} from '../validation/reportSchema.js';

const VEHICLE_TYPE_LABELS = {
  ev: 'Electric Vehicle (BEV / Full Electric — NO internal combustion engine, NO engine oil/spark plugs/exhaust/catalytic converter, high-voltage battery & inverter drivetrain)',
  petrol: 'Petrol / Gasoline Internal Combustion Vehicle',
  diesel: 'Diesel Internal Combustion Vehicle (compression ignition, glow plugs, DPF/EGR, high-pressure common rail)',
  hybrid: 'Hybrid Electric Vehicle (combined internal combustion engine + high-voltage traction battery/electric motor drivetrain)',
};

const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  required: [
    'problemSummary',
    'possibleCauses',
    'recommendedActions',
    'severityAssessment',
    'drivingRecommendation',
    'relatedComponents',
    'followUpQuestions',
    'safetyNotes',
  ],
  properties: {
    problemSummary: {
      type: 'OBJECT',
      required: ['summary', 'affectedSystem', 'vehicleContextNote'],
      properties: {
        summary: { type: 'STRING' },
        affectedSystem: { type: 'STRING' },
        vehicleContextNote: { type: 'STRING' },
      },
    },
    possibleCauses: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        required: [
          'rank',
          'componentName',
          'explanation',
          'whyItMatches',
          'supportingSymptoms',
          'recommendedInspection',
          'likelihood',
        ],
        properties: {
          rank: { type: 'INTEGER' },
          componentName: { type: 'STRING' },
          explanation: { type: 'STRING' },
          whyItMatches: { type: 'STRING' },
          supportingSymptoms: { type: 'ARRAY', items: { type: 'STRING' } },
          recommendedInspection: { type: 'STRING' },
          likelihood: { type: 'STRING', enum: ALLOWED_LIKELIHOODS },
        },
      },
    },
    recommendedActions: {
      type: 'OBJECT',
      required: ['basicVisualChecks', 'mechanicChecks', 'professionalRepairs'],
      properties: {
        basicVisualChecks: { type: 'ARRAY', items: { type: 'STRING' } },
        mechanicChecks: { type: 'ARRAY', items: { type: 'STRING' } },
        professionalRepairs: { type: 'ARRAY', items: { type: 'STRING' } },
      },
    },
    severityAssessment: {
      type: 'OBJECT',
      required: ['level', 'reasoning'],
      properties: {
        level: { type: 'STRING', enum: ALLOWED_SEVERITIES },
        reasoning: { type: 'STRING' },
      },
    },
    drivingRecommendation: {
      type: 'OBJECT',
      required: ['recommendation', 'details'],
      properties: {
        recommendation: { type: 'STRING', enum: ALLOWED_DRIVING_RECOMMENDATIONS },
        details: { type: 'STRING' },
      },
    },
    relatedComponents: { type: 'ARRAY', items: { type: 'STRING' } },
    followUpQuestions: { type: 'ARRAY', items: { type: 'STRING' } },
    safetyNotes: {
      type: 'OBJECT',
      required: ['immediateHazards', 'highVoltagePrecautions', 'disclaimer'],
      properties: {
        immediateHazards: { type: 'ARRAY', items: { type: 'STRING' } },
        highVoltagePrecautions: { type: 'ARRAY', items: { type: 'STRING' } },
        disclaimer: { type: 'STRING' },
      },
    },
  },
};

function buildSystemInstruction() {
  return `You are a Master Certified Automotive Diagnostic Engineer providing a cautious, structured initial symptom assessment for CarHealth.

STRICT DIAGNOSTIC ACCURACY & SAFETY RULES:
1. NEVER claim a confirmed diagnosis from symptoms alone. Always treat your output as an initial assessment requiring physical verification.
2. NEVER fabricate percentages or statistical probabilities. Only use the qualitative likelihood categories: "Most Likely", "Likely", "Possible", "Less Likely".
3. Consider ALL mechanically plausible causes for the reported location, driving condition, and vehicle architecture. For example, a grinding or rumbling noise from a rear wheel while cornering does NOT automatically mean a CV joint — consider wheel hub bearings, brake discs/drums, pads/shoes/backing plates, suspension bushings/links, tyre rubbing/damage, and CV joints ONLY where applicable to the vehicle's rear drivetrain.
4. NEVER recommend replacing parts without inspection first.
5. Respect the vehicle powertrain strictly:
   - For Electric Vehicles (EV): Do NOT assume petrol/diesel engine components (no spark plugs, oil pressure, exhaust, catalytic converter, transmission clutch, fuel injectors). Consider electric drive units, reduction gearboxes, regenerative braking blending, thermal cooling loops, 12V auxiliary battery, and high-voltage isolation systems.
   - For EV and Hybrid vehicles: Always populate highVoltagePrecautions and NEVER instruct an owner to open battery packs, probe orange high-voltage wiring, or service high-voltage components.
   - For Diesel vehicles: Account for diesel-specific systems where relevant (glow plugs, DPF, EGR, high-pressure injection, turbocharging).
6. Immediate Safety Escalation: If symptoms suggest brake failure, severe overheating, oil pressure loss, steering failure, fire/smoke/burning smell, or HV thermal risk, assign "Critical" severity and recommend "Stop driving immediately and arrange recovery."
7. Be conservative with drivingRecommendation. Choose strictly from the enum values.
8. Provide 3 to 5 ranked possibleCauses, clear distinction between safe owner visual checks vs. mechanic diagnostics vs. professional repairs, and 3 to 5 targeted followUpQuestions that genuinely narrow down ambiguity.`;
}

function buildUserPrompt(input) {
  const { vehicleType, vehicleDetails, description, whenOccurs, whereOccurs, symptomTypes, frequency, followUpAnswers } = input;

  const detailsLines = [
    `Vehicle Powertrain Type: ${VEHICLE_TYPE_LABELS[vehicleType] || vehicleType}`,
    vehicleDetails.manufacturer ? `Manufacturer: ${vehicleDetails.manufacturer}` : null,
    vehicleDetails.model ? `Model: ${vehicleDetails.model}` : null,
    vehicleDetails.year ? `Year: ${vehicleDetails.year}` : null,
    vehicleDetails.mileage ? `Current Mileage: ${vehicleDetails.mileage}` : null,
  ].filter(Boolean);

  const contextLines = [
    whenOccurs.length ? `When it occurs: ${whenOccurs.join(', ')}` : null,
    whereOccurs.length ? `Where it occurs: ${whereOccurs.join(', ')}` : null,
    symptomTypes.length ? `Symptom categories: ${symptomTypes.join(', ')}` : null,
    frequency ? `Frequency: ${frequency}` : null,
  ].filter(Boolean);

  const followUpSection = followUpAnswers.length
    ? `\n\nADDITIONAL FOLLOW-UP ANSWERS PROVIDED BY OWNER:\n${followUpAnswers
        .map((qa, i) => `${i + 1}. Q: ${qa.question}\n   A: ${qa.answer}`)
        .join('\n')}`
    : '';

  return `VEHICLE CONTEXT:
${detailsLines.join('\n')}

STRUCTURED SYMPTOM CONTEXT:
${contextLines.length ? contextLines.join('\n') : 'None specified (rely carefully on narrative description and ask targeted follow-up questions).'}

OWNER SYMPTOM DESCRIPTION:
"""
${description}
"""${followUpSection}

Produce a structured, accurate, conservative automotive diagnostic assessment in valid JSON matching the required schema.`;
}

export async function analyzeWithGemini(sanitizedInput) {
  if (!CONFIG.geminiApiKey) {
    const err = new Error(
      'AI diagnosis is temporarily unavailable because the Gemini API key is not configured on the backend server.'
    );
    err.statusCode = 503;
    err.code = 'AI_NOT_CONFIGURED';
    throw err;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    CONFIG.geminiModel
  )}:generateContent?key=${encodeURIComponent(CONFIG.geminiApiKey)}`;

  const requestBody = {
    systemInstruction: {
      parts: [{ text: buildSystemInstruction() }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: buildUserPrompt(sanitizedInput) }],
      },
    ],
    generationConfig: {
      temperature: 0.25,
      topP: 0.85,
      responseMimeType: 'application/json',
      responseSchema: GEMINI_RESPONSE_SCHEMA,
    },
  };

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(45000),
    });
  } catch (networkErr) {
    const err = new Error(
      `Unable to reach the AI diagnostic provider: ${networkErr.message || 'Network timeout'}`
    );
    err.statusCode = 503;
    err.code = 'AI_PROVIDER_UNREACHABLE';
    throw err;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage = payload?.error?.message || `Gemini API returned HTTP ${response.status}`;
    const err = new Error(apiMessage);
    err.statusCode = response.status === 429 ? 429 : 502;
    err.code = response.status === 429 ? 'AI_RATE_LIMITED' : 'AI_PROVIDER_ERROR';
    throw err;
  }

  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const err = new Error('AI provider returned an empty diagnostic response.');
    err.statusCode = 502;
    err.code = 'AI_EMPTY_RESPONSE';
    throw err;
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const err = new Error('AI provider returned malformed JSON that could not be parsed.');
    err.statusCode = 502;
    err.code = 'AI_INVALID_JSON';
    throw err;
  }

  const validatedReport = validateAIReport(parsed);

  return {
    provider: 'gemini',
    model: CONFIG.geminiModel,
    generatedAt: new Date().toISOString(),
    report: validatedReport,
  };
}
