import { useState } from 'react';
import {
  Cpu,
  Eye,
  Wrench,
  ShieldCheck,
  Zap,
  AlertOctagon,
  HelpCircle,
  RefreshCw,
  BookmarkPlus,
  BookmarkCheck,
  Download,
  CheckCircle2,
  Trash2,
  StickyNote,
  Layers,
} from 'lucide-react';
import SeverityIndicator from './SeverityIndicator';
import PossibleCauseCard from './PossibleCauseCard';
import { PrimaryButton, SecondaryButton } from './ui';

export default function DiagnosticReport({
  report,
  vehicleType,
  vehicleDetails = {},
  symptomDescription,
  additionalSelections = {},
  reportId = null,
  status = 'Open',
  notes = '',
  isSaved = false,
  isSaving = false,
  isRegenerating = false,
  onSave,
  onDownloadPdf,
  onRegenerateWithAnswers,
  onUpdateNotes,
  onToggleResolved,
  onDelete,
}) {
  const [answers, setAnswers] = useState({});
  const [localNotes, setLocalNotes] = useState(notes);
  const [notesSavedToast, setNotesSavedToast] = useState(false);

  if (!report) return null;

  const isElectrified = vehicleType === 'ev' || vehicleType === 'hybrid';
  const hvPrecautions = report.safetyNotes?.highVoltagePrecautions || [];
  const immediateHazards = report.safetyNotes?.immediateHazards || [];

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    const collected = (report.followUpQuestions || [])
      .map((question, idx) => ({
        question,
        answer: (answers[idx] || '').trim(),
      }))
      .filter((item) => item.answer.length > 0);

    if (collected.length === 0) return;
    onRegenerateWithAnswers?.(collected);
  };

  const handleSaveNotes = () => {
    onUpdateNotes?.(localNotes);
    setNotesSavedToast(true);
    setTimeout(() => setNotesSavedToast(false), 2200);
  };

  const vehicleHeading =
    [vehicleDetails.year, vehicleDetails.manufacturer, vehicleDetails.model]
      .filter(Boolean)
      .join(' ') || `${String(vehicleType || 'Vehicle').toUpperCase()} Assessment`;

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#263449] bg-[#111C2E] px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="rounded-lg border border-[#3B82F6]/35 bg-[#3B82F6]/15 px-2.5 py-1 font-mono font-semibold text-[#22D3EE]">
            {reportId || 'LIVE AI ASSESSMENT'}
          </span>
          <span className="font-medium text-white">{vehicleHeading}</span>
          <span className="rounded-md border border-[#263449] bg-[#0B1220] px-2 py-0.5 font-mono text-[11px] uppercase text-[#94A3B8]">
            {vehicleType}
          </span>
          {isSaved && (
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                status === 'Resolved'
                  ? 'border-emerald-500/35 bg-emerald-500/15 text-emerald-300'
                  : 'border-[#3B82F6]/35 bg-[#3B82F6]/15 text-[#60A5FA]'
              }`}
            >
              {status}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isSaved && onSave && (
            <PrimaryButton
              size="sm"
              icon={BookmarkPlus}
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save to History'}
            </PrimaryButton>
          )}
          {isSaved && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <BookmarkCheck className="h-3.5 w-3.5" />
              Saved in History
            </span>
          )}
          {isSaved && onToggleResolved && (
            <SecondaryButton size="sm" icon={CheckCircle2} onClick={onToggleResolved}>
              {status === 'Resolved' ? 'Reopen Report' : 'Mark Resolved'}
            </SecondaryButton>
          )}
          {onDownloadPdf && (
            <SecondaryButton size="sm" icon={Download} onClick={onDownloadPdf}>
              Download PDF
            </SecondaryButton>
          )}
          {isSaved && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* D & E. Severity Assessment & Driving Recommendation */}
      <SeverityIndicator
        level={report.severityAssessment?.level}
        reasoning={report.severityAssessment?.reasoning}
        drivingRecommendation={report.drivingRecommendation?.recommendation}
        drivingDetails={report.drivingRecommendation?.details}
      />

      {/* Immediate Hazards Warning (if any) */}
      {immediateHazards.length > 0 && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/12 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-red-300">
            <AlertOctagon className="h-4.5 w-4.5" />
            Immediate Safety Hazards Identified
          </h3>
          <ul className="mt-2.5 space-y-1.5 text-sm text-red-100">
            {immediateHazards.map((hazard) => (
              <li key={hazard} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                <span>{hazard}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* High-Voltage Safety Precautions for EV / Hybrid */}
      {(isElectrified || hvPrecautions.length > 0) && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-300">
            <Zap className="h-4.5 w-4.5" />
            High-Voltage Safety Precautions ({vehicleType?.toUpperCase()})
          </h3>
          <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-amber-100/90 sm:text-sm">
            {(hvPrecautions.length > 0
              ? hvPrecautions
              : [
                  'Never open high-voltage battery enclosures, touch orange high-voltage cabling, or attempt DIY servicing on electric drive or inverter components.',
                  'High-voltage diagnostics and repairs must only be performed by EV/Hybrid-certified technicians using insulated PPE.',
                ]
            ).map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* A. Problem Summary */}
      <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white">
            <Cpu className="h-4.5 w-4.5 text-[#3B82F6]" />
            Problem Summary
          </h2>
          <span className="rounded-lg border border-[#22D3EE]/35 bg-[#22D3EE]/10 px-3 py-1 font-mono text-xs font-medium text-[#22D3EE]">
            Affected System: {report.problemSummary?.affectedSystem}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#E2E8F0]">
          {report.problemSummary?.summary}
        </p>

        {report.problemSummary?.vehicleContextNote && (
          <p className="mt-2.5 text-xs text-[#94A3B8]">
            {report.problemSummary.vehicleContextNote}
          </p>
        )}

        {/* Reported Input Recap */}
        <div className="mt-4 rounded-xl border border-[#263449]/80 bg-[#0B1220]/75 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Your Reported Description
          </p>
          <p className="mt-1 text-xs italic leading-relaxed text-white/90">
            &ldquo;{symptomDescription}&rdquo;
          </p>
          {(additionalSelections?.whenOccurs?.length > 0 ||
            additionalSelections?.whereOccurs?.length > 0 ||
            additionalSelections?.symptomTypes?.length > 0 ||
            additionalSelections?.frequency) && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {[
                ...(additionalSelections.whenOccurs || []),
                ...(additionalSelections.whereOccurs || []),
                ...(additionalSelections.symptomTypes || []),
                ...(additionalSelections.frequency ? [additionalSelections.frequency] : []),
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-[#263449] bg-[#111C2E] px-2 py-0.5 text-[11px] text-[#94A3B8]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* B. Ranked Possible Causes */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">Ranked Possible Causes</h2>
            <p className="text-xs text-[#94A3B8]">
              Ordered by mechanical plausibility — physical verification is required before
              replacing any component.
            </p>
          </div>
          <span className="font-mono text-xs text-[#22D3EE]">
            {report.possibleCauses?.length || 0} Plausible Causes Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {(report.possibleCauses || []).map((cause, idx) => (
            <PossibleCauseCard key={`${cause.componentName}-${idx}`} cause={cause} index={idx} />
          ))}
        </div>
      </section>

      {/* C. Recommended Actions */}
      <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
        <h2 className="text-lg font-semibold text-white">Recommended Next Actions</h2>
        <p className="mt-1 text-xs text-[#94A3B8]">
          Clear separation between safe owner checks, qualified mechanic inspections, and
          professional-only repairs.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Basic Visual Checks */}
          <div className="rounded-xl border border-emerald-500/30 bg-[#111C2E] p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Eye className="h-4 w-4" />
              Safe Basic Visual Checks
            </h3>
            <p className="mt-1 text-[11px] text-[#94A3B8]">Safe for vehicle owners to observe</p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#E2E8F0]">
              {(report.recommendedActions?.basicVisualChecks || []).length > 0 ? (
                report.recommendedActions.basicVisualChecks.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#94A3B8]">
                  No DIY visual checks advised — proceed directly to qualified inspection.
                </li>
              )}
            </ul>
          </div>

          {/* Qualified Mechanic Checks */}
          <div className="rounded-xl border border-[#3B82F6]/35 bg-[#111C2E] p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#60A5FA]">
              <Wrench className="h-4 w-4" />
              Qualified Mechanic Checks
            </h3>
            <p className="mt-1 text-[11px] text-[#94A3B8]">
              Requires lift, diagnostic tools, or testing gauges
            </p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#E2E8F0]">
              {(report.recommendedActions?.mechanicChecks || []).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B82F6]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Repairs */}
          <div className="rounded-xl border border-amber-500/30 bg-[#111C2E] p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <ShieldCheck className="h-4 w-4" />
              Professional Repairs Only
            </h3>
            <p className="mt-1 text-[11px] text-[#94A3B8]">
              Safety-critical or specialized repairs
            </p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#E2E8F0]">
              {(report.recommendedActions?.professionalRepairs || []).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* F. Related Components */}
      {report.relatedComponents?.length > 0 && (
        <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white">
            <Layers className="h-4.5 w-4.5 text-[#22D3EE]" />
            Related Components to Consider
          </h2>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {report.relatedComponents.map((comp) => (
              <span
                key={comp}
                className="rounded-xl border border-[#263449] bg-[#111C2E] px-3 py-1.5 text-xs font-medium text-[#E2E8F0]"
              >
                {comp}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* G. Interactive Follow-up Questions */}
      {report.followUpQuestions?.length > 0 && onRegenerateWithAnswers && (
        <section className="rounded-2xl border border-[#3B82F6]/35 bg-[#172338] p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <HelpCircle className="h-4.5 w-4.5 text-[#22D3EE]" />
                Refine Diagnosis With Follow-Up Questions
              </h2>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Answering any of these targeted questions helps narrow down ambiguous symptoms and
                regenerate a sharper assessment.
              </p>
            </div>
          </div>

          <form onSubmit={handleFollowUpSubmit} className="mt-4 space-y-3.5">
            {report.followUpQuestions.map((question, idx) => (
              <div
                key={question}
                className="rounded-xl border border-[#263449] bg-[#111C2E] p-3.5"
              >
                <label className="block text-xs font-medium text-white">
                  {idx + 1}. {question}
                </label>
                <input
                  type="text"
                  value={answers[idx] || ''}
                  onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                  disabled={isRegenerating}
                  placeholder="Type your observation (optional)..."
                  className="mt-2 w-full rounded-lg border border-[#263449] bg-[#0B1220] px-3 py-2 text-xs text-white placeholder-[#94A3B8]/60 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                />
              </div>
            ))}

            <div className="flex justify-end pt-1">
              <PrimaryButton
                type="submit"
                icon={RefreshCw}
                disabled={
                  isRegenerating ||
                  Object.values(answers).every((val) => !String(val || '').trim())
                }
                className={isRegenerating ? '[&>svg]:animate-spin' : ''}
              >
                {isRegenerating
                  ? 'Regenerating Assessment...'
                  : 'Regenerate Assessment With Answers'}
              </PrimaryButton>
            </div>
          </form>
        </section>
      )}

      {/* Owner / Mechanic Notes (when saved) */}
      {isSaved && onUpdateNotes && (
        <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <StickyNote className="h-4.5 w-4.5 text-[#3B82F6]" />
              Owner &amp; Inspection Notes
            </h2>
            {notesSavedToast && (
              <span className="text-xs font-medium text-emerald-400">Notes saved</span>
            )}
          </div>
          <textarea
            rows={3}
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Record mechanic findings, service dates, or parts inspected..."
            className="mt-3 w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
          />
          <div className="mt-3 flex justify-end">
            <SecondaryButton size="sm" onClick={handleSaveNotes}>
              Save Notes
            </SecondaryButton>
          </div>
        </section>
      )}

      {/* Mandatory Diagnostic Disclaimer */}
      <div className="rounded-2xl border border-[#263449] bg-[#0B1220]/90 p-4 text-xs leading-relaxed text-[#94A3B8]">
        <strong className="text-white">Initial Diagnostic Assessment Notice: </strong>
        {report.safetyNotes?.disclaimer ||
          'This AI output is an initial symptom assessment and does not replace a hands-on physical inspection by a qualified automotive technician.'}
      </div>
    </div>
  );
}
