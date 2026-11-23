import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ScanLine, Cpu, Gauge, BatteryCharging, CalendarClock } from 'lucide-react';
import CarShowcase from '../components/automotive/CarShowcase';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  VehicleCard,
  SeverityBadge,
  Modal,
  PageTransition,
} from '../components/ui';
import { VEHICLES } from '../data/mockData';

export default function MyGarage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [detailVehicle, setDetailVehicle] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    year: '2025',
    make: 'Lucid',
    model: 'Air Touring',
    vin: '50EA1GAA9SA014922',
    bodyType: 'coupe',
    finish: 'sapphire',
  });

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const created = {
      id: `veh-${Date.now()}`,
      name: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model}`,
      make: newVehicle.make,
      model: newVehicle.model,
      year: Number(newVehicle.year) || 2025,
      trim: 'Connected Telemetry',
      vin: newVehicle.vin.toUpperCase(),
      plate: 'CH-NEW-01',
      mileage: '1,240 mi',
      powertrain: 'Connected OBD-II Powertrain',
      healthScore: 99,
      status: 'healthy',
      bodyType: newVehicle.bodyType,
      finish: newVehicle.finish,
      lastScan: 'Just paired',
      activeAlerts: 0,
      batteryVoltage: '12.8V · Nominal',
      tirePressure: '38 / 38 / 38 / 38 PSI',
      nextService: 'In 8,760 mi',
      ecuModules: 40,
    };
    setVehicles((prev) => [created, ...prev]);
    setAddOpen(false);
  };

  return (
    <PageTransition>
      <PageHeader
        title="My Garage"
        description="Manage connected vehicles, monitor ECU health indices, and launch targeted OBD-II diagnostic sweeps."
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'My Garage' },
        ]}
        actions={
          <PrimaryButton icon={Plus} onClick={() => setAddOpen(true)}>
            Add Vehicle
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onScan={() => navigate('/diagnostics')}
            onSelect={(v) => setDetailVehicle(v)}
          />
        ))}
      </div>

      {/* Vehicle Telemetry Specification Modal */}
      <Modal
        open={Boolean(detailVehicle)}
        onClose={() => setDetailVehicle(null)}
        title={detailVehicle?.name || ''}
        subtitle={detailVehicle ? `VIN: ${detailVehicle.vin} · ${detailVehicle.trim}` : ''}
        maxWidth="max-w-2xl"
        footer={
          detailVehicle && (
            <>
              <SecondaryButton onClick={() => setDetailVehicle(null)}>Close</SecondaryButton>
              <PrimaryButton
                icon={ScanLine}
                onClick={() => {
                  setDetailVehicle(null);
                  navigate('/diagnostics');
                }}
              >
                Inspect OBD-II Codes
              </PrimaryButton>
            </>
          )
        }
      >
        {detailVehicle && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#263449] bg-[#0B1220] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs text-[#22D3EE]">
                  LIVE VEHICLE PROFILE · {detailVehicle.plate}
                </span>
                <SeverityBadge severity={detailVehicle.status} />
              </div>
              <CarShowcase
                variant={detailVehicle.bodyType}
                finish={detailVehicle.finish}
                spinning
                wheelSpeed="1.6s"
                showScan
                showLightTrails={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[#263449] bg-[#172338] p-3.5">
                <Gauge className="h-4 w-4 text-[#3B82F6]" />
                <p className="mt-2 text-[11px] text-[#94A3B8]">Odometer</p>
                <p className="font-mono text-sm font-semibold text-white">{detailVehicle.mileage}</p>
              </div>
              <div className="rounded-xl border border-[#263449] bg-[#172338] p-3.5">
                <BatteryCharging className="h-4 w-4 text-[#22D3EE]" />
                <p className="mt-2 text-[11px] text-[#94A3B8]">Electrical</p>
                <p className="font-mono text-xs font-semibold text-white">
                  {detailVehicle.batteryVoltage}
                </p>
              </div>
              <div className="rounded-xl border border-[#263449] bg-[#172338] p-3.5">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <p className="mt-2 text-[11px] text-[#94A3B8]">ECU Modules</p>
                <p className="font-mono text-sm font-semibold text-white">
                  {detailVehicle.ecuModules} Online
                </p>
              </div>
              <div className="rounded-xl border border-[#263449] bg-[#172338] p-3.5">
                <CalendarClock className="h-4 w-4 text-amber-400" />
                <p className="mt-2 text-[11px] text-[#94A3B8]">Next Service</p>
                <p className="font-mono text-xs font-semibold text-white">
                  {detailVehicle.nextService}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Pair New Vehicle"
        subtitle="Add a vehicle to your CarHealth garage for OBD-II telemetry."
      >
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94A3B8]">Year</label>
              <input
                type="text"
                required
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                className="w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3 py-2 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94A3B8]">Make</label>
              <input
                type="text"
                required
                value={newVehicle.make}
                onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                className="w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3 py-2 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94A3B8]">Model</label>
              <input
                type="text"
                required
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3 py-2 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#94A3B8]">
              17-Character VIN
            </label>
            <input
              type="text"
              required
              value={newVehicle.vin}
              onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
              className="w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3.5 py-2 font-mono text-sm uppercase text-white focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94A3B8]">Body Style</label>
              <select
                value={newVehicle.bodyType}
                onChange={(e) => setNewVehicle({ ...newVehicle, bodyType: e.target.value })}
                className="w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3 py-2 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              >
                <option value="coupe">Sports Coupe / EV</option>
                <option value="sedan">Performance Sedan</option>
                <option value="suv">Luxury SUV</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94A3B8]">Studio Finish</label>
              <select
                value={newVehicle.finish}
                onChange={(e) => setNewVehicle({ ...newVehicle, finish: e.target.value })}
                className="w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3 py-2 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              >
                <option value="sapphire">Midnight Sapphire</option>
                <option value="titanium">Titanium Slate</option>
                <option value="obsidian">Obsidian Graphite</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <SecondaryButton onClick={() => setAddOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" icon={Plus}>
              Add to Garage
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
