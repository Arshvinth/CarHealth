import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, User, CarFront, Cpu, RotateCcw } from 'lucide-react';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  SeverityBadge,
  PageTransition,
} from '../components/ui';
import { AI_SUGGESTIONS, INITIAL_AI_MESSAGES, VEHICLES } from '../data/mockData';

function generateAutomotiveReply(prompt, activeVehicle) {
  const lower = prompt.toLowerCase();

  if (lower.includes('p0300') || lower.includes('misfire')) {
    return {
      content:
        'P0300 indicates a random/multiple cylinder misfire on your 2022 Audi Q8 55 TFSI. Your freeze-frame telemetry shows Short-Term Fuel Trim at +14.8% under moderate load (2,140 RPM), which strongly points to either an unmetered intake vacuum leak or aging ignition coils. Avoid heavy throttle until inspected to protect the catalytic converter.',
      highlights: [
        { label: 'Priority Action', value: 'Check Coil Packs & Smoke-Test Intake' },
        { label: 'Est. Repair Range', value: '$180 – $650' },
      ],
    };
  }

  if (lower.includes('p0420') || lower.includes('catalyst') || lower.includes('bmw')) {
    return {
      content:
        'On your 2023 BMW M340i xDrive, P0420 (Catalyst Efficiency Below Threshold — Bank 1) is a moderate emissions alert. The vehicle remains safe for short daily trips, though highway fuel economy may dip slightly. Before replacing the catalyst, verify downstream O2 sensor waveform switching and check the exhaust flex flange for minor leaks.',
      highlights: [
        { label: 'Drivability', value: 'Safe for short trips' },
        { label: 'Next Check', value: 'Compare B1S1 vs B1S2 O2 Waveforms' },
      ],
    };
  }

  if (lower.includes('taycan') || lower.includes('battery') || lower.includes('800v')) {
    return {
      content:
        'Your 2024 Porsche Taycan 4S high-voltage pack is in excellent condition: 98% State of Health (SoH) across all 800V cell groups, balanced cell delta (< 9 mV), and zero thermal management faults. Recommended routine: keep daily AC charging capped at 80% unless preparing for long-distance travel.',
      highlights: [
        { label: 'HV Pack SoH', value: '98% · Balanced' },
        { label: 'Active Alerts', value: '0 Faults' },
      ],
    };
  }

  if (lower.includes('abs') || lower.includes('traction') || lower.includes('c0035')) {
    return {
      content:
        'When both ABS and Traction Control (ESC) illuminate together, both systems share the same wheel speed sensor inputs. Your recent scan logged C0035 — Left Front Wheel Speed Sensor reporting 0.0 mph while the other three wheels read ~31.4 mph. Standard hydraulic braking still works, but anti-lock assistance is paused until the FL sensor or harness is serviced.',
      highlights: [
        { label: 'Faulted Node', value: 'Front-Left Hub Sensor (C0035)' },
        { label: 'Safety Status', value: 'Caution on wet surfaces' },
      ],
    };
  }

  return {
    content: `Based on live telemetry for your ${activeVehicle.name} (Health Index ${activeVehicle.healthScore}%, ${activeVehicle.ecuModules} ECU modules), I recommend starting with a targeted live-data check around your symptom. You can also run a Full ECU Deep Scan from the Dashboard or paste any OBD-II code like P0300, P0420, or C0035 for a step-by-step diagnostic checklist.`,
    highlights: [
      { label: 'Active Context', value: activeVehicle.name },
      { label: 'Last Scan', value: activeVehicle.lastScan },
    ],
  };
}

export default function AIAssistant() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[2]);
  const [messages, setMessages] = useState(INITIAL_AI_MESSAGES);
  const [input, setInput] = useState(() => searchParams.get('prompt') || '');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);
  const msgCounterRef = useRef(2);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    msgCounterRef.current += 1;
    const userMsg = {
      id: `user-${msgCounterRef.current}`,
      role: 'user',
      timestamp: 'Just now',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const reply = generateAutomotiveReply(trimmed, selectedVehicle);
      msgCounterRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${msgCounterRef.current}`,
          role: 'assistant',
          timestamp: 'Just now',
          ...reply,
        },
      ]);
      setThinking(false);
    }, 650);
  };

  useEffect(() => {
    if (searchParams.has('prompt')) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  return (
    <PageTransition>
      <PageHeader
        title="CarHealth AI Assistant"
        description="Conversational automotive diagnostic copilot trained on OBD-II fault trees, live ECU telemetry, and OEM service procedures."
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'AI Assistant' },
        ]}
        actions={
          <SecondaryButton
            icon={RotateCcw}
            size="sm"
            onClick={() => setMessages(INITIAL_AI_MESSAGES)}
          >
            New Session
          </SecondaryButton>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Vehicle Context Sidebar */}
        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-[#263449] bg-[#172338] p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <CarFront className="h-4 w-4 text-[#22D3EE]" />
              Active Vehicle Context
            </h2>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Select which vehicle telemetry stream the AI should reference.
            </p>

            <div className="mt-4 space-y-2.5">
              {VEHICLES.map((v) => {
                const active = selectedVehicle.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVehicle(v)}
                    className={`w-full cursor-pointer rounded-xl border p-3.5 text-left transition-all ${
                      active
                        ? 'border-[#3B82F6]/60 bg-[#3B82F6]/12 shadow-[0_0_20px_rgba(59,130,246,0.16)]'
                        : 'border-[#263449] bg-[#111C2E] hover:border-[#3B82F6]/35'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">{v.name}</span>
                      <SeverityBadge severity={v.status} />
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-[#94A3B8]">
                      Health {v.healthScore}% · {v.activeAlerts} active alert
                      {v.activeAlerts === 1 ? '' : 's'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#263449] bg-[#172338] p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4 text-[#3B82F6]" />
              Quick Diagnostic Prompts
            </h2>
            <div className="mt-3 space-y-2">
              {AI_SUGGESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="w-full cursor-pointer rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 text-left text-xs text-[#E2E8F0] transition-colors hover:border-[#3B82F6]/50 hover:bg-[#1C2B45]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chat Interface */}
        <section className="flex h-[640px] flex-col overflow-hidden rounded-2xl border border-[#263449] bg-[#111C2E] shadow-[0_16px_42px_rgba(0,0,0,0.35)] lg:col-span-8">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-[#263449] bg-[#172338]/80 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3B82F6]/40 bg-[#3B82F6]/15 text-[#22D3EE]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">CarHealth Diagnostic AI</h2>
                <p className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Synced with {selectedVehicle.name}
                </p>
              </div>
            </div>
            <span className="hidden items-center gap-1.5 rounded-lg border border-[#263449] bg-[#0B1220] px-2.5 py-1 font-mono text-[11px] text-[#22D3EE] sm:inline-flex">
              <Cpu className="h-3.5 w-3.5" />
              OBD-II Context Active
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                      isUser
                        ? 'border-[#60A5FA]/40 bg-[#3B82F6] text-white'
                        : 'border-[#263449] bg-[#172338] text-[#22D3EE]'
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#3B82F6] text-white shadow-[0_6px_22px_rgba(59,130,246,0.28)]'
                        : 'border border-[#263449] bg-[#172338] text-[#E2E8F0]'
                    }`}
                  >
                    <p>{msg.content}</p>

                    {msg.highlights && (
                      <div className="mt-3 grid grid-cols-1 gap-2 border-t border-[#263449]/80 pt-3 sm:grid-cols-2">
                        {msg.highlights.map((h) => (
                          <div
                            key={h.label}
                            className="rounded-lg border border-[#263449] bg-[#0B1220]/70 px-3 py-2"
                          >
                            <p className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
                              {h.label}
                            </p>
                            <p className="mt-0.5 font-mono text-xs font-semibold text-[#22D3EE]">
                              {h.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <p
                      className={`mt-2 text-[10px] ${
                        isUser ? 'text-blue-100/80' : 'text-[#94A3B8]'
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {thinking && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#263449] bg-[#172338] text-[#22D3EE]">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-[#263449] bg-[#172338] px-4 py-3 text-xs text-[#94A3B8]">
                  Analyzing ECU freeze-frame &amp; fault trees...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-3 border-t border-[#263449] bg-[#172338]/70 p-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${selectedVehicle.name}, warning lights, or OBD-II codes...`}
              className="flex-1 rounded-xl border border-[#263449] bg-[#0B1220] px-4 py-2.5 text-sm text-white placeholder-[#94A3B8]/70 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
            <PrimaryButton type="submit" icon={Send} disabled={!input.trim() || thinking}>
              Send
            </PrimaryButton>
          </form>
        </section>
      </div>
    </PageTransition>
  );
}
