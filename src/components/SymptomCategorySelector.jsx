import { Clock, MapPin, AudioWaveform, Repeat } from 'lucide-react';
import {
  WHEN_OCCURS_OPTIONS,
  WHERE_OCCURS_OPTIONS,
  SYMPTOM_TYPE_OPTIONS,
  FREQUENCY_OPTIONS,
} from '../data/symptomData';

function ChipGroup({ title, icon: Icon, options, selected, onToggle, multi = true }) {
  return (
    <div className="rounded-xl border border-[#263449]/80 bg-[#111C2E]/75 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs font-semibold text-white">
          <Icon className="h-4 w-4 text-[#22D3EE]" />
          {title}
        </p>
        <span className="text-[11px] text-[#94A3B8]">
          {multi ? 'Optional · Select all that apply' : 'Optional · Select one'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = multi ? selected.includes(option) : selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={active}
              className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                active
                  ? 'border-[#3B82F6] bg-[#3B82F6] text-white shadow-[0_0_14px_rgba(59,130,246,0.35)]'
                  : 'border-[#263449] bg-[#0B1220]/75 text-[#94A3B8] hover:border-[#3B82F6]/45 hover:text-white'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SymptomCategorySelector({
  whenOccurs,
  onToggleWhen,
  whereOccurs,
  onToggleWhere,
  symptomTypes,
  onToggleSymptomType,
  frequency,
  onSelectFrequency,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChipGroup
        title="When does the problem occur?"
        icon={Clock}
        options={WHEN_OCCURS_OPTIONS}
        selected={whenOccurs}
        onToggle={onToggleWhen}
        multi
      />

      <ChipGroup
        title="Where does the problem occur?"
        icon={MapPin}
        options={WHERE_OCCURS_OPTIONS}
        selected={whereOccurs}
        onToggle={onToggleWhere}
        multi
      />

      <ChipGroup
        title="What type of symptom?"
        icon={AudioWaveform}
        options={SYMPTOM_TYPE_OPTIONS}
        selected={symptomTypes}
        onToggle={onToggleSymptomType}
        multi
      />

      <ChipGroup
        title="Frequency"
        icon={Repeat}
        options={FREQUENCY_OPTIONS}
        selected={frequency}
        onToggle={onSelectFrequency}
        multi={false}
      />
    </div>
  );
}
