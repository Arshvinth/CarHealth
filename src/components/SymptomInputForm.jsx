import { motion } from 'framer-motion';
import { ScanSearch, Sparkles, RotateCcw, ShieldAlert, Loader2 } from 'lucide-react';
import SymptomCategorySelector from './SymptomCategorySelector';
import { PrimaryButton, SecondaryButton } from './ui';
import CarShowcase from './automotive/CarShowcase';

const EXAMPLE_PROMPTS = [
  'I hear a strange grinding or drum-like sound from the rear left wheel when turning sharply to the left at high speed. The sound disappears when driving straight.',
  'My steering wheel vibrates above 60 mph and pulses slightly when I press the brakes.',
  'When turning the key in the morning I only hear rapid clicking and the dashboard flickers.',
];

export default function SymptomInputForm({
  vehicleType,
  description,
  onChangeDescription,
  whenOccurs,
  onToggleWhen,
  whereOccurs,
  onToggleWhere,
  symptomTypes,
  onToggleSymptomType,
  frequency,
  onSelectFrequency,
  onSubmit,
  onReset,
  isLoading,
  validationError,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#263449] bg-[#172338] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.3)] sm:p-6"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#22D3EE]">
            Step 02 · Symptom Description &amp; Context
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            What&apos;s happening with your vehicle?
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-[#94A3B8]">
            Describe the sounds, symptoms or unusual behaviour you&apos;re experiencing. Our AI
            assistant will help you understand the possible causes.
          </p>
        </div>

        <SecondaryButton type="button" size="sm" icon={RotateCcw} onClick={onReset} disabled={isLoading}>
          Clear Form
        </SecondaryButton>
      </div>

      {/* Main Multiline Description Textarea */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="symptom-description"
            className="text-xs font-semibold tracking-wide text-white"
          >
            Describe the problem in your own words <span className="text-[#22D3EE]">*</span>
          </label>
          <span className="font-mono text-[11px] text-[#94A3B8]">
            {description.trim().length} / 3000 chars
          </span>
        </div>

        <textarea
          id="symptom-description"
          rows={5}
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          disabled={isLoading}
          placeholder="Example: I hear a clicking sound from the front left wheel when making sharp turns..."
          className={`w-full resize-y rounded-2xl border bg-[#0B1220] px-4 py-3.5 text-sm leading-relaxed text-white placeholder-[#94A3B8]/65 transition-all focus:outline-none disabled:opacity-60 ${
            validationError
              ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#263449] hover:border-[#3B82F6]/45 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20'
          }`}
        />

        {validationError && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-400">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            {validationError}
          </p>
        )}

        {/* Quick Example Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-[#94A3B8]">Try an example:</span>
          {EXAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => onChangeDescription(sample)}
              className="cursor-pointer rounded-lg border border-[#263449] bg-[#111C2E] px-2.5 py-1 text-[11px] text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-[#22D3EE] disabled:opacity-50"
            >
              {idx === 0
                ? 'Rear wheel grinding on turns'
                : idx === 1
                ? 'Highway vibration + brake pulse'
                : 'Rapid clicking no-start'}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Structured Selectors */}
      <div className="mt-6">
        <SymptomCategorySelector
          whenOccurs={whenOccurs}
          onToggleWhen={onToggleWhen}
          whereOccurs={whereOccurs}
          onToggleWhere={onToggleWhere}
          symptomTypes={symptomTypes}
          onToggleSymptomType={onToggleSymptomType}
          frequency={frequency}
          onSelectFrequency={onSelectFrequency}
        />
      </div>

      {/* Animated Diagnostic Scanning Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-2xl border border-[#3B82F6]/45 bg-gradient-to-b from-[#111C2E] to-[#0B1220] p-5"
        >
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="w-full max-w-xs shrink-0">
              <CarShowcase
                variant={vehicleType === 'ev' ? 'coupe' : vehicleType === 'diesel' ? 'suv' : 'sedan'}
                finish="sapphire"
                spinning
                wheelSpeed="1.25s"
                showScan
                showLightTrails={false}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/35 bg-[#22D3EE]/10 px-3 py-1 font-mono text-[11px] font-medium text-[#22D3EE]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                AI DIAGNOSTIC ENGINE ANALYZING
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">
                Evaluating powertrain systems, symptom patterns &amp; safety risks...
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
                Cross-checking plausible mechanical, braking, suspension, and electrical components
                for your {vehicleType ? vehicleType.toUpperCase() : 'selected'} vehicle without
                jumping to unverified conclusions.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Submit Action Bar */}
      <div className="mt-6 flex flex-col items-stretch justify-between gap-4 border-t border-[#263449]/80 pt-5 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <Sparkles className="h-4 w-4 shrink-0 text-[#22D3EE]" />
          Optional fields can be left blank — AI will ask targeted follow-up questions if needed.
        </p>

        <PrimaryButton
          type="submit"
          size="lg"
          icon={isLoading ? Loader2 : ScanSearch}
          disabled={isLoading}
          className={isLoading ? '[&>svg]:animate-spin' : ''}
        >
          {isLoading ? 'Analyzing Vehicle Problem...' : 'Analyze Vehicle Problem'}
        </PrimaryButton>
      </div>
    </form>
  );
}
