export const ALLOWED_SEVERITIES = ['Critical', 'High', 'Moderate', 'Low'];

export const ALLOWED_LIKELIHOODS = [
  'Most Likely',
  'Likely',
  'Possible',
  'Less Likely',
];

export const ALLOWED_DRIVING_RECOMMENDATIONS = [
  'Stop driving immediately and arrange recovery.',
  'Avoid driving until inspected.',
  'Drive cautiously and arrange inspection soon.',
  'Monitor the issue and schedule maintenance.',
];

export const ALLOWED_VEHICLE_TYPES = ['ev', 'petrol', 'diesel', 'hybrid'];

export function validateSymptomRequest(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Request payload must be a JSON object.'] };
  }

  const vehicleType = String(payload.vehicleType || '').toLowerCase().trim();
  if (!ALLOWED_VEHICLE_TYPES.includes(vehicleType)) {
    errors.push('Please select a valid vehicle type (EV, Petrol, Diesel, or Hybrid).');
  }

  const description = String(payload.description || '').trim();
  if (description.length < 10) {
    errors.push('Please describe the vehicle symptom in at least 10 characters.');
  }
  if (description.length > 3000) {
    errors.push('Symptom description must be 3,000 characters or fewer.');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      vehicleType,
      vehicleDetails: {
        vehicleId: payload.vehicleDetails?.vehicleId ? String(payload.vehicleDetails.vehicleId).trim() : null,
        manufacturer: String(payload.vehicleDetails?.manufacturer || '').trim().slice(0, 80),
        model: String(payload.vehicleDetails?.model || '').trim().slice(0, 80),
        year: String(payload.vehicleDetails?.year || '').trim().slice(0, 10),
        mileage: String(payload.vehicleDetails?.mileage || '').trim().slice(0, 40),
      },
      description,
      whenOccurs: Array.isArray(payload.whenOccurs)
        ? payload.whenOccurs.map((v) => String(v).trim()).filter(Boolean).slice(0, 12)
        : [],
      whereOccurs: Array.isArray(payload.whereOccurs)
        ? payload.whereOccurs.map((v) => String(v).trim()).filter(Boolean).slice(0, 10)
        : [],
      symptomTypes: Array.isArray(payload.symptomTypes)
        ? payload.symptomTypes.map((v) => String(v).trim()).filter(Boolean).slice(0, 14)
        : [],
      frequency: String(payload.frequency || '').trim().slice(0, 60),
      followUpAnswers: Array.isArray(payload.followUpAnswers)
        ? payload.followUpAnswers
            .filter((item) => item && item.question && item.answer)
            .map((item) => ({
              question: String(item.question).trim().slice(0, 300),
              answer: String(item.answer).trim().slice(0, 500),
            }))
            .slice(0, 10)
        : [],
    },
  };
}

function asCleanString(val, fallback = '') {
  return typeof val === 'string' && val.trim() ? val.trim() : fallback;
}

function asStringArray(val, max = 12) {
  if (!Array.isArray(val)) return [];
  return val
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, max);
}

export function validateAIReport(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI response was not a valid JSON object.');
  }

  const summaryText = asCleanString(raw.problemSummary?.summary);
  const affectedSystem = asCleanString(raw.problemSummary?.affectedSystem);
  if (!summaryText || !affectedSystem) {
    throw new Error('AI response is missing problem summary or affected system.');
  }

  const rawCauses = Array.isArray(raw.possibleCauses) ? raw.possibleCauses : [];
  const possibleCauses = rawCauses
    .map((cause, index) => {
      if (!cause || typeof cause !== 'object') return null;
      const componentName = asCleanString(cause.componentName);
      const explanation = asCleanString(cause.explanation);
      if (!componentName || !explanation) return null;

      const rawLikelihood = asCleanString(cause.likelihood, 'Possible');
      const likelihood = ALLOWED_LIKELIHOODS.includes(rawLikelihood) ? rawLikelihood : 'Possible';

      return {
        rank: Number(cause.rank) || index + 1,
        componentName,
        explanation,
        whyItMatches: asCleanString(cause.whyItMatches, explanation),
        supportingSymptoms: asStringArray(cause.supportingSymptoms, 6),
        recommendedInspection: asCleanString(
          cause.recommendedInspection,
          'Have a qualified technician perform a physical inspection before replacing parts.'
        ),
        likelihood,
      };
    })
    .filter(Boolean);

  if (possibleCauses.length === 0) {
    throw new Error('AI response did not contain any valid possible causes.');
  }

  const rawSeverity = asCleanString(raw.severityAssessment?.level, 'Moderate');
  const severityLevel = ALLOWED_SEVERITIES.includes(rawSeverity) ? rawSeverity : 'Moderate';
  const severityReason = asCleanString(raw.severityAssessment?.reasoning);
  if (!severityReason) {
    throw new Error('AI response is missing severity reasoning.');
  }

  const rawDriving = asCleanString(raw.drivingRecommendation?.recommendation);
  const drivingRecommendation = ALLOWED_DRIVING_RECOMMENDATIONS.includes(rawDriving)
    ? rawDriving
    : 'Drive cautiously and arrange inspection soon.';

  const drivingDetails = asCleanString(
    raw.drivingRecommendation?.details,
    'Have a qualified technician inspect the vehicle to confirm the underlying mechanical or electrical cause.'
  );

  const basicVisualChecks = asStringArray(raw.recommendedActions?.basicVisualChecks, 8);
  const mechanicChecks = asStringArray(raw.recommendedActions?.mechanicChecks, 8);
  const professionalRepairs = asStringArray(raw.recommendedActions?.professionalRepairs, 8);

  const highVoltagePrecautions = asStringArray(raw.safetyNotes?.highVoltagePrecautions, 6);
  const immediateHazards = asStringArray(raw.safetyNotes?.immediateHazards, 6);

  return {
    problemSummary: {
      summary: summaryText,
      affectedSystem,
      vehicleContextNote: asCleanString(raw.problemSummary?.vehicleContextNote),
    },
    possibleCauses,
    recommendedActions: {
      basicVisualChecks,
      mechanicChecks,
      professionalRepairs,
    },
    severityAssessment: {
      level: severityLevel,
      reasoning: severityReason,
    },
    drivingRecommendation: {
      recommendation: drivingRecommendation,
      details: drivingDetails,
    },
    relatedComponents: asStringArray(raw.relatedComponents, 12),
    followUpQuestions: asStringArray(raw.followUpQuestions, 6),
    safetyNotes: {
      immediateHazards,
      highVoltagePrecautions,
      disclaimer: asCleanString(
        raw.safetyNotes?.disclaimer,
        'This AI assessment is an initial diagnostic guide based on reported symptoms and is not a confirmed mechanical diagnosis. Always confirm with a qualified automotive technician before performing repairs.'
      ),
    },
  };
}
