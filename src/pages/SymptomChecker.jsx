import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, RefreshCw, History, ServerOff, ShieldCheck } from 'lucide-react';
import VehicleTypeSelector from '../components/VehicleTypeSelector';
import SymptomInputForm from '../components/SymptomInputForm';
import PopularProblems from '../components/PopularProblems';
import { PageHeader, PrimaryButton, SecondaryButton, PageTransition } from '../components/ui';
import { COMMON_VEHICLE_PROBLEMS } from '../data/symptomData';
import { analyzeVehicleSymptoms, checkAIHealth } from '../services/aiService';

function getInitialPrefill(locationState, searchParams) {
  if (locationState?.prefill) {
    return locationState.prefill;
  }
  const slug = searchParams.get('problem');
  if (slug) {
    const match = COMMON_VEHICLE_PROBLEMS.find((p) => p.slug === slug);
    if (match) {
      return {
        vehicleType: match.recommendedVehicleType || 'petrol',
        description: match.prefillSymptom || '',
        whenOccurs: match.prefillWhen || [],
        whereOccurs: match.prefillWhere || [],
        symptomTypes: match.prefillTypes || [],
        sourceProblemTitle: match.title,
      };
    }
  }
  return null;
}

export default function SymptomChecker() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialPrefill = getInitialPrefill(location.state, searchParams);

  const [vehicleType, setVehicleType] = useState(initialPrefill?.vehicleType || 'petrol');
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleId: null,
    manufacturer: '',
    model: '',
    year: '',
    mileage: '',
  });
  const [description, setDescription] = useState(initialPrefill?.description || '');
  const [whenOccurs, setWhenOccurs] = useState(initialPrefill?.whenOccurs || []);
  const [whereOccurs, setWhereOccurs] = useState(initialPrefill?.whereOccurs || []);
  const [symptomTypes, setSymptomTypes] = useState(initialPrefill?.symptomTypes || []);
  const [frequency, setFrequency] = useState('');

  const [vehicleTypeError, setVehicleTypeError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    let active = true;
    checkAIHealth().then((status) => {
      if (active) setAiStatus(status);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleMulti = (setter) => (value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleReset = () => {
    setDescription('');
    setWhenOccurs([]);
    setWhereOccurs([]);
    setSymptomTypes([]);
    setFrequency('');
    setValidationError('');
    setVehicleTypeError('');
    setAiError(null);
  };

  const runAnalysis = async () => {
    setVehicleTypeError('');
    setValidationError('');
    setAiError(null);

    if (!vehicleType) {
      setVehicleTypeError('Please choose your vehicle powertrain type before analyzing.');
      return;
    }

    if (description.trim().length < 10) {
      setValidationError(
        'Please describe what you hear, feel, or see in at least 10 characters so the AI can assess plausible causes safely.'
      );
      return;
    }

    const payload = {
      vehicleType,
      vehicleDetails,
      description: description.trim(),
      whenOccurs,
      whereOccurs,
      symptomTypes,
      frequency,
      followUpAnswers: [],
    };

    setIsLoading(true);
    try {
      const response = await analyzeVehicleSymptoms(payload);
      navigate('/symptom-checker/result', {
        state: {
          liveResult: {
            vehicleType,
            vehicleId: vehicleDetails.vehicleId || null,
            vehicleDetails,
            symptomDescription: description.trim(),
            additionalSelections: {
              whenOccurs,
              whereOccurs,
              symptomTypes,
              frequency,
              followUpAnswers: [],
            },
            aiReport: response.report,
            provider: response.provider,
            model: response.model,
            diagnosisDate: response.generatedAt,
          },
        },
      });
    } catch (err) {
      setAiError({
        message:
          err?.message ||
          'AI symptom diagnosis is temporarily unavailable. Please retry in a moment.',
        code: err?.code || 'AI_UNAVAILABLE',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runAnalysis();
  };

  return (
    <PageTransition>
      <PageHeader
        title="AI Symptom Checker"
        description="Describe unusual noises, vibrations, smells, or warning behaviour in plain language for a structured, safety-first automotive assessment."
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Symptom Checker' },
        ]}
        badge={
          aiStatus && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                aiStatus.reachable && aiStatus.configured
                  ? 'border-emerald-500/35 bg-emerald-500/12 text-emerald-300'
                  : 'border-amber-500/35 bg-amber-500/12 text-amber-300'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  aiStatus.reachable && aiStatus.configured ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              {aiStatus.reachable && aiStatus.configured
                ? `AI Engine Ready (${aiStatus.model || 'Gemini'})`
                : !aiStatus.reachable
                ? 'Backend Offline'
                : 'Gemini Key Needed'}
            </span>
          )
        }
        actions={
          <SecondaryButton icon={History} onClick={() => navigate('/history')}>
            Saved Reports
          </SecondaryButton>
        }
      />

      {initialPrefill?.sourceProblemTitle && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#3B82F6]/35 bg-[#3B82F6]/10 px-4 py-3 text-xs text-[#E2E8F0]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#22D3EE]" />
            Prefilled from <strong className="text-white">{initialPrefill.sourceProblemTitle}</strong>
            — customize the description to match your exact vehicle symptoms before analyzing.
          </span>
        </div>
      )}

      <div className="space-y-6">
        <VehicleTypeSelector
          selectedType={vehicleType}
          onSelectType={(type) => {
            setVehicleType(type);
            setVehicleTypeError('');
          }}
          vehicleDetails={vehicleDetails}
          onChangeDetails={setVehicleDetails}
          error={vehicleTypeError}
        />

        <SymptomInputForm
          vehicleType={vehicleType}
          description={description}
          onChangeDescription={(val) => {
            setDescription(val);
            if (validationError) setValidationError('');
          }}
          whenOccurs={whenOccurs}
          onToggleWhen={toggleMulti(setWhenOccurs)}
          whereOccurs={whereOccurs}
          onToggleWhere={toggleMulti(setWhereOccurs)}
          symptomTypes={symptomTypes}
          onToggleSymptomType={toggleMulti(setSymptomTypes)}
          frequency={frequency}
          onSelectFrequency={(val) => setFrequency((prev) => (prev === val ? '' : val))}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isLoading={isLoading}
          validationError={validationError}
        />

        {/* Graceful, Honest AI Error / Unavailable Fallback */}
        {aiError && (
          <div
            role="alert"
            className="rounded-2xl border border-amber-500/40 bg-[#172338] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.32)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/35 bg-amber-500/12 text-amber-400">
                  {aiError.code === 'BACKEND_UNREACHABLE' ? (
                    <ServerOff className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    AI Diagnosis Temporarily Unavailable
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#E2E8F0]">{aiError.message}</p>

                  {(aiError.code === 'AI_NOT_CONFIGURED' ||
                    aiError.code === 'BACKEND_UNREACHABLE') && (
                    <div className="mt-3 rounded-xl border border-[#263449] bg-[#0B1220] p-3.5 font-mono text-xs text-[#94A3B8]">
                      <p className="text-[#22D3EE]">Backend setup checklist:</p>
                      <p className="mt-1">
                        1. Copy <span className="text-white">CarHealth/server/.env.example</span> to{' '}
                        <span className="text-white">CarHealth/server/.env</span> and set{' '}
                        <span className="text-white">GEMINI_API_KEY</span>.
                      </p>
                      <p className="mt-0.5">
                        2. Start the backend API: <span className="text-white">npm run server</span>{' '}
                        inside <span className="text-white">CarHealth/</span>.
                      </p>
                    </div>
                  )}

                  <p className="mt-2.5 text-xs text-[#94A3B8]">
                    CarHealth will never fabricate or simulate an AI diagnosis when the AI engine is
                    offline. You can still browse the verified Common Vehicle Problems guides below
                    or retry once the backend service is active.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <PrimaryButton size="sm" icon={RefreshCw} onClick={runAnalysis}>
                  Retry Analysis
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Common Vehicle Problems Reference Section */}
      <PopularProblems />
    </PageTransition>
  );
}
