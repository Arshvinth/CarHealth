import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BatteryCharging, Gauge, ArrowUpRight, ScanLine } from 'lucide-react';
import CarShowcase from '../automotive/CarShowcase';
import SeverityBadge from './SeverityBadge';
import { SEVERITY_STYLES } from '../../theme/tokens';

export default function VehicleCard({
  vehicle,
  onScan,
  onSelect,
  compact = false,
  className = '',
}) {
  const [hovered, setHovered] = useState(false);
  const sevStyle = SEVERITY_STYLES[vehicle.status] || SEVERITY_STYLES.healthy;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[#263449] bg-[#172338] shadow-[0_14px_34px_rgba(0,0,0,0.32)] transition-colors duration-250 hover:border-[#3B82F6]/50 ${className}`}
    >
      {/* Visual header with precision car silhouette */}
      <div className="relative border-b border-[#263449]/80 bg-gradient-to-b from-[#111C2E] via-[#0F192B] to-[#0B1220] px-4 pt-4 pb-2">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8]">
            {vehicle.plate} · {vehicle.year}
          </span>
          <SeverityBadge
            severity={vehicle.status}
            pulse={vehicle.status === 'critical'}
          />
        </div>

        <CarShowcase
          variant={vehicle.bodyType}
          finish={vehicle.finish}
          spinning={hovered}
          wheelSpeed="1.45s"
          showScan={hovered || vehicle.status === 'critical'}
          showLightTrails={false}
          className={compact ? 'max-h-36' : 'max-h-44'}
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white group-hover:text-[#22D3EE] transition-colors">
              {vehicle.name}
            </h3>
            <p className="mt-0.5 text-xs text-[#94A3B8]">{vehicle.powertrain}</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-white">{vehicle.healthScore}%</span>
            <p className="text-[11px] text-[#94A3B8]">Health</p>
          </div>
        </div>

        {/* Health Progress Bar */}
        <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-[#0B1220]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${sevStyle.bar}`}
            style={{ width: `${vehicle.healthScore}%` }}
          />
        </div>

        {/* Telemetry Row */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center gap-2 rounded-xl border border-[#263449]/70 bg-[#111C2E]/80 px-3 py-2">
            <Gauge className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
            <span className="truncate text-[#94A3B8]">{vehicle.mileage}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#263449]/70 bg-[#111C2E]/80 px-3 py-2">
            <BatteryCharging className="h-3.5 w-3.5 shrink-0 text-[#22D3EE]" />
            <span className="truncate text-[#94A3B8]">{vehicle.batteryVoltage.split('·')[0]}</span>
          </div>
        </div>

        {!compact && (
          <div className="mt-3 flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="inline-flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#3B82F6]" />
              Last scan: {vehicle.lastScan}
            </span>
            <span className="font-mono text-[11px] text-[#94A3B8]/80">
              {vehicle.ecuModules} ECUs
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-[#263449]/70 pt-3.5">
          {onScan && (
            <button
              type="button"
              onClick={() => onScan(vehicle)}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#3B82F6]/15 px-3 py-2 text-xs font-medium text-[#60A5FA] border border-[#3B82F6]/30 transition-colors hover:bg-[#3B82F6] hover:text-white"
            >
              <ScanLine className="h-3.5 w-3.5" />
              Run Scan
            </button>
          )}
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(vehicle)}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border border-[#263449] bg-[#111C2E] px-3 py-2 text-xs font-medium text-white transition-colors hover:border-[#3B82F6]/50 hover:bg-[#1C2B45]"
            >
              Details
              <ArrowUpRight className="h-3.5 w-3.5 text-[#22D3EE]" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
