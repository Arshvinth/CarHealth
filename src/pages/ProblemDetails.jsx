import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ScanSearch,
  AlertOctagon,
  Eye,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  ListChecks,
  Cpu,
} from 'lucide-react';
import SeverityIndicator from '../components/SeverityIndicator';
import ProblemCard from '../components/ProblemCard';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
  PageTransition,
} from '../components/ui';
import { COMMON_VEHICLE_PROBLEMS } from '../data/symptomData';

export default function ProblemDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const problem = COMMON_VEHICLE_PROBLEMS.find((item) => item.slug === slug);

  if (!problem) {
    return (
      <PageTransition>
        <PageHeader
          title="Vehicle Problem Not Found"
          breadcrumbs={[
            { label: 'CarHealth', to: '/' },
            { label: 'Symptom Checker', to: '/symptom-checker' },
            { label: 'Problem Guide' },
          ]}
        />
        <EmptyState
          title="We couldn't find that problem guide"
          description="Return to the Symptom Checker to browse all 12 common vehicle problem profiles."
          action={
            <PrimaryButton onClick={() => navigate('/symptom-checker')}>
              Back to Symptom Checker
            </PrimaryButton>
          }
        />
      </PageTransition>
    );
  }

  const relatedProblems = COMMON_VEHICLE_PROBLEMS.filter((item) =>
    problem.relatedSlugs.includes(item.slug)
  );

  const handleAnalyzeMyVehicle = () => {
    navigate('/symptom-checker', {
      state: {
        prefill: {
          vehicleType: problem.recommendedVehicleType || 'petrol',
          description: problem.prefillSymptom,
          whenOccurs: problem.prefillWhen || [],
          whereOccurs: problem.prefillWhere || [],
          symptomTypes: problem.prefillTypes || [],
          sourceProblemTitle: problem.title,
        },
      },
    });
  };

  return (
    <PageTransition>
      <PageHeader
        title={problem.title}
        description={problem.overview}
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Symptom Checker', to: '/symptom-checker' },
          { label: problem.title },
        ]}
        badge={<SeverityIndicator level={problem.severity} compact />}
        actions={
          <>
            <SecondaryButton icon={ArrowLeft} onClick={() => navigate('/symptom-checker')}>
              All Problems
            </SecondaryButton>
            <PrimaryButton icon={ScanSearch} onClick={handleAnalyzeMyVehicle}>
              Analyze My Vehicle
            </PrimaryButton>
          </>
        }
      />

      {/* Safety Precautions Highlight */}
      <section className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-300">
          <ShieldAlert className="h-4.5 w-4.5" />
          Safety Precautions
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-50/95">
          {problem.safetyPrecautions.map((note) => (
            <li key={note} className="flex items-start gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {/* Common Symptoms */}
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <ListChecks className="h-4.5 w-4.5 text-[#22D3EE]" />
              Common Symptoms
            </h2>
            <ul className="mt-4 space-y-2.5">
              {problem.commonSymptoms.map((symptom) => (
                <li
                  key={symptom}
                  className="flex items-start gap-2.5 rounded-xl border border-[#263449]/75 bg-[#111C2E] p-3.5 text-sm text-[#E2E8F0]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22D3EE]" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Possible Causes */}
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <AlertOctagon className="h-4.5 w-4.5 text-[#3B82F6]" />
              Possible Causes
            </h2>
            <ul className="mt-4 space-y-2.5">
              {problem.possibleCauses.map((cause, idx) => (
                <li
                  key={cause}
                  className="flex items-start gap-3 rounded-xl border border-[#263449]/75 bg-[#111C2E] p-3.5 text-sm text-[#E2E8F0]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#3B82F6]/20 font-mono text-xs font-semibold text-[#22D3EE]">
                    {idx + 1}
                  </span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Possible Repair Approaches */}
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Wrench className="h-4.5 w-4.5 text-emerald-400" />
              Possible Repair Approaches
            </h2>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Actual repairs depend on verified physical and diagnostic inspection findings.
            </p>
            <ul className="mt-4 space-y-2.5">
              {problem.possibleRepairApproaches.map((approach) => (
                <li
                  key={approach}
                  className="flex items-start gap-2.5 rounded-xl border border-[#263449]/75 bg-[#111C2E] p-3.5 text-sm text-[#E2E8F0]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{approach}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: How to Identify + Recommended Inspections + CTA */}
        <div className="space-y-6 lg:col-span-5">
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Eye className="h-4.5 w-4.5 text-[#22D3EE]" />
              How to Identify the Problem
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#94A3B8]">
              {problem.howToIdentify.map((step) => (
                <li
                  key={step}
                  className="flex items-start gap-2.5 rounded-xl border border-[#263449]/75 bg-[#111C2E] p-3.5 text-[#E2E8F0]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B82F6]" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Cpu className="h-4.5 w-4.5 text-[#3B82F6]" />
              Recommended Inspections
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#E2E8F0]">
              {problem.recommendedInspections.map((insp) => (
                <li
                  key={insp}
                  className="flex items-start gap-2.5 rounded-xl border border-[#263449]/75 bg-[#111C2E] p-3.5"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                  <span>{insp}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Direct CTA Card */}
          <section className="rounded-2xl border border-[#3B82F6]/40 bg-gradient-to-b from-[#172338] to-[#111C2E] p-6 shadow-[0_14px_34px_rgba(59,130,246,0.14)]">
            <h3 className="text-base font-semibold text-white">
              Experiencing {problem.title.toLowerCase()}?
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
              Launch the CarHealth AI Symptom Checker prefilled with this problem so you can add
              your specific vehicle type, location, and observations.
            </p>
            <div className="mt-4">
              <PrimaryButton
                icon={ScanSearch}
                onClick={handleAnalyzeMyVehicle}
                className="w-full"
              >
                Analyze My Vehicle
              </PrimaryButton>
            </div>
          </section>
        </div>
      </div>

      {/* Related Problems */}
      {relatedProblems.length > 0 && (
        <section className="mt-10 border-t border-[#263449]/80 pt-8">
          <h2 className="mb-4 text-lg font-semibold text-white">Related Vehicle Problems</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProblems.map((rel) => (
              <ProblemCard
                key={rel.slug}
                problem={rel}
                onSelect={(item) => navigate(`/symptom-checker/problems/${item.slug}`)}
              />
            ))}
          </div>
        </section>
      )}
    </PageTransition>
  );
}
