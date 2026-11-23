import { useNavigate } from 'react-router-dom';
import ProblemCard from './ProblemCard';
import { COMMON_VEHICLE_PROBLEMS } from '../data/symptomData';

export default function PopularProblems() {
  const navigate = useNavigate();

  return (
    <section className="mt-12">
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#22D3EE]">
            Automotive Knowledge Reference
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Common Vehicle Problems
          </h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Explore common automotive problems and understand what could be causing them.
          </p>
        </div>
        <span className="font-mono text-xs text-[#94A3B8]">
          {COMMON_VEHICLE_PROBLEMS.length} Guided Diagnostic Profiles
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMMON_VEHICLE_PROBLEMS.map((problem) => (
          <ProblemCard
            key={problem.slug}
            problem={problem}
            onSelect={(item) => navigate(`/symptom-checker/problems/${item.slug}`)}
          />
        ))}
      </div>
    </section>
  );
}
