import { motion } from 'framer-motion';
import { Zap, Flame, Fuel, BatteryCharging, Check, CarFront, ShieldCheck } from 'lucide-react';
import { VEHICLE_TYPES } from '../data/symptomData';
import { VEHICLES } from '../data/mockData';

const ICON_MAP = {
  Zap,
  Flame,
  Fuel,
  BatteryCharging,
};

function inferVehicleType(vehicle) {
  const pt = (vehicle.powertrain || '').toLowerCase();
  if (pt.includes('electric') && !pt.includes('hybrid')) return 'ev';
  if (pt.includes('hybrid')) return 'hybrid';
  if (pt.includes('diesel')) return 'diesel';
  return 'petrol';
}

export default function VehicleTypeSelector({
  selectedType,
  onSelectType,
  vehicleDetails,
  onChangeDetails,
  error,
}) {
  const handleSelectGarageVehicle = (vehicleId) => {
    if (!vehicleId) {
      onChangeDetails({ ...vehicleDetails, vehicleId: null });
      return;
    }
    const found = VEHICLES.find((v) => v.id === vehicleId);
    if (!found) return;
    onSelectType(inferVehicleType(found));
    onChangeDetails({
      vehicleId: found.id,
      manufacturer: found.make,
      model: found.model,
      year: String(found.year),
      mileage: found.mileage,
    });
  };

  return (
    <section className="rounded-2xl border border-[#263449] bg-[#172338] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.3)] sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#22D3EE]">
            Step 01 · Vehicle Powertrain Context
          </span>
          <h2 className="mt-1 text-lg font-semibold text-white">Select Your Vehicle Type</h2>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Drivetrain architecture determines which mechanical, thermal, or high-voltage systems
            are evaluated.
          </p>
        </div>

        {/* Optional quick-fill from My Garage */}
        <div className="w-full sm:w-64">
          <label className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-[#94A3B8]">
            <CarFront className="h-3.5 w-3.5 text-[#3B82F6]" />
            Quick-fill from My Garage (optional)
          </label>
          <select
            value={vehicleDetails.vehicleId || ''}
            onChange={(e) => handleSelectGarageVehicle(e.target.value)}
            className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
          >
            <option value="">Enter manually / custom vehicle</option>
            {VEHICLES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.mileage})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Interactive Powertrain Cards */}
      <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {VEHICLE_TYPES.map((type) => {
          const Icon = ICON_MAP[type.icon] || Zap;
          const isSelected = selectedType === type.id;

          return (
            <motion.button
              key={type.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectType(type.id)}
              aria-pressed={isSelected}
              className={`group relative flex cursor-pointer flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] ${
                isSelected
                  ? 'border-[#3B82F6] bg-[#3B82F6]/14 shadow-[0_0_26px_rgba(59,130,246,0.22)]'
                  : 'border-[#263449] bg-[#111C2E]/85 hover:border-[#3B82F6]/50 hover:bg-[#1C2B45]/75'
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                    isSelected
                      ? 'border-[#22D3EE]/50 bg-[#3B82F6] text-white shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                      : 'border-[#263449] bg-[#172338] text-[#22D3EE] group-hover:border-[#3B82F6]/40'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? 'border-[#22D3EE] bg-[#22D3EE] text-[#0B1220]'
                      : 'border-[#263449] bg-[#0B1220]/70 text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </span>
              </div>

              <h3 className="mt-3.5 text-sm font-semibold text-white">{type.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">{type.description}</p>

              <span
                className={`mt-3 inline-flex items-center gap-1 text-[11px] font-medium ${
                  isSelected ? 'text-[#22D3EE]' : 'text-[#94A3B8]/80'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                {type.safetyNote}
              </span>
            </motion.button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-xs font-medium text-red-400">{error}</p>}

      {/* Optional Vehicle Specification Fields */}
      <div className="mt-5 border-t border-[#263449]/80 pt-5">
        <p className="mb-3 text-xs font-medium text-[#94A3B8]">
          Optional Vehicle Details{' '}
          <span className="text-[#94A3B8]/70">
            (Improves drivetrain accuracy — not required for diagnosis)
          </span>
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#94A3B8]">
              Manufacturer
            </label>
            <input
              type="text"
              value={vehicleDetails.manufacturer}
              onChange={(e) =>
                onChangeDetails({ ...vehicleDetails, manufacturer: e.target.value })
              }
              placeholder="e.g. Porsche, BMW, Toyota"
              className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#94A3B8]">Model</label>
            <input
              type="text"
              value={vehicleDetails.model}
              onChange={(e) => onChangeDetails({ ...vehicleDetails, model: e.target.value })}
              placeholder="e.g. Taycan 4S, Corolla, Q8"
              className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#94A3B8]">
              Manufacturing Year
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={vehicleDetails.year}
              onChange={(e) => onChangeDetails({ ...vehicleDetails, year: e.target.value })}
              placeholder="e.g. 2023"
              className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#94A3B8]">
              Current Mileage
            </label>
            <input
              type="text"
              value={vehicleDetails.mileage}
              onChange={(e) => onChangeDetails({ ...vehicleDetails, mileage: e.target.value })}
              placeholder="e.g. 34,500 mi or 55,000 km"
              className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
