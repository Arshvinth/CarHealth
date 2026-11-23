import { CONFIG } from '../config.js';
import { analyzeWithGemini } from './geminiProvider.js';

/**
 * Provider abstraction layer so the underlying LLM (Gemini, Vertex AI, etc.)
 * can be swapped via configuration without modifying routes or frontend code.
 */
export async function generateSymptomDiagnosis(sanitizedInput) {
  switch (CONFIG.aiProvider) {
    case 'gemini':
    default:
      return analyzeWithGemini(sanitizedInput);
  }
}

export function getAIHealthStatus() {
  return {
    provider: CONFIG.aiProvider,
    model: CONFIG.geminiModel,
    configured: Boolean(CONFIG.geminiApiKey),
  };
}
