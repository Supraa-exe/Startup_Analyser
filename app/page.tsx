'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ScenarioInput,
  StakeholderPreset,
  RunStateRecord,
  Verdict,
  StrategyBattle,
  Finding
} from '@/lib/domain/types';
import {
  Rocket, Users, Activity, Scale, Swords,
  AlertTriangle, CheckCircle2, HelpCircle, Flame,
  ShieldCheck, Play, ArrowRight, RotateCcw, Sparkles,
  Info, Globe, Loader2, Link2, Zap, CheckCheck, Brain,
  TrendingUp, Target, Lightbulb, ChevronRight, X
} from 'lucide-react';

/* ─── Constants ─────────────────────────────────────── */
const EMPTY_SCENARIO: ScenarioInput = {
  name: '', description: '', targetAudience: '',
  businessModel: '', valueProposition: '', keyAssumption: ''
};

const DEFAULT_STAKEHOLDERS: StakeholderPreset[] = [
  {
    id: 'stk_1', role: 'Target Customer / End User',
    goal: 'Quickly solve acute workflow bottlenecks and eliminate repetitive manual tasks with minimal onboarding.',
    incentive: 'Immediate productivity gains, time saved, and seamless integration with existing tools.',
    constraint: 'Low willingness to adopt complex new software; will churn if setup takes longer than 15 minutes.',
    enabled: true
  },
  {
    id: 'stk_2', role: 'Economic Buyer / Decision Maker',
    goal: 'Demonstrate measurable ROI and cost savings to company leadership while keeping risks low.',
    incentive: 'Cost reduction, team efficiency, and clear analytics dashboards showing value delivered.',
    constraint: 'Budget-conscious; requires proof of value within a 14-day trial before approving spend.',
    enabled: true
  },
  {
    id: 'stk_3', role: 'Operational Partner / Team Lead',
    goal: 'Ensure team consistency, prevent operational errors, and maintain high standards of execution.',
    incentive: 'Reduced escalations, dependable reliability, and clear audit logs.',
    constraint: 'Refuses to rely on unverified automated processes without fail-safes and roll-back controls.',
    enabled: true
  },
  {
    id: 'stk_4', role: 'Incumbent Market Competitor',
    goal: 'Defend market share, retain existing accounts, and protect established vendor margins.',
    incentive: 'Account retention and cross-selling existing platform features.',
    constraint: 'Can bundle basic competitive features for free into existing enterprise contracts.',
    enabled: true
  },
  {
    id: 'stk_5', role: 'Venture Capitalist / Seed Investor',
    goal: 'Identify breakout venture-scale upside, strong net revenue retention, and defensible technology moats.',
    incentive: 'Rapid organic expansion, high gross margins (≥80%), and strong LTV:CAC > 3x.',
    constraint: 'Will not invest if unit economics rely on heavy manual onboarding or churn exceeds 2% monthly.',
    enabled: true
  }
];

const STEPS = [
  { num: 1, label: 'Launchpad',      icon: Rocket },
  { num: 2, label: 'Stakeholders',   icon: Users },
  { num: 3, label: 'War Room',       icon: Activity },
  { num: 4, label: 'Verdict',        icon: Scale },
  { num: 5, label: 'Battle',         icon: Swords },
];

/* ─── Loading Overlay ────────────────────────────────── */
function LoadingOverlay({ message }: { message: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(8,8,8,0.85)',
      backdropFilter: 'blur(8px)', zIndex: 50,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20
    }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid #f9731630',
          borderTop: '2px solid #f97316',
          animation: 'spinSlow 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: '1px solid #f9731620',
          borderBottom: '1px solid #f97316',
          animation: 'spinSlow 1.5s linear infinite reverse'
        }} />
        <Brain style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', width: 20, height: 20, color: '#f97316'
        }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#f0f0f0', fontWeight: 500 }}>{message}</p>
        <div className="dots" style={{ marginTop: 10, justifyContent: 'center', display: 'flex' }}>
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

/* ─── Finding Card ────────────────────────────────────── */
function FindingCard({ finding, type }: { finding: Finding; type: 'support' | 'objection' | 'conflict' | 'unresolved' }) {
  const colors = {
    support: { border: '#22c55e28', accent: '#22c55e', label: 'Support' },
    objection: { border: '#ef444428', accent: '#ef4444', label: 'Objection' },
    conflict: { border: '#eab30828', accent: '#eab308', label: 'Conflict' },
    unresolved: { border: '#1e1e1e', accent: '#6b6b6b', label: 'Open' },
  }[type];

  return (
    <div className="card feed-card" style={{ borderColor: colors.border, padding: 16, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', flex: 1, marginRight: 10 }}>
          {finding.claim}
        </span>
        <span className={`badge badge-d`} style={{ color: colors.accent, borderColor: colors.border, flexShrink: 0 }}>
          {colors.label}
        </span>
      </div>
      {finding.stakeholderRole && (
        <span className="badge badge-d" style={{ marginBottom: 8, display: 'inline-flex' }}>
          {finding.stakeholderRole}
        </span>
      )}
      <div style={{
        padding: '10px 12px', borderRadius: 6, background: '#080808',
        border: '1px solid #1e1e1e', marginBottom: 10,
        fontSize: 12, color: '#9a9a9a', fontStyle: 'italic', lineHeight: 1.6
      }}>
        <span style={{ display: 'block', fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', marginBottom: 4, fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Log Evidence · Round {finding.roundReference || 1}
        </span>
        {finding.evidence[0]}
      </div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
          Validation Protocol
        </span>
        <p style={{ fontSize: 12, color: '#b0b0b0', lineHeight: 1.6 }}>{finding.validationExperiment}</p>
      </div>
      <div style={{ paddingTop: 10, borderTop: '1px solid #1e1e1e', display: 'grid', gap: 4 }}>
        <div style={{ fontSize: 11, color: '#22c55e' }}><strong>Continue:</strong> {finding.decisionGate.continueSignal}</div>
        <div style={{ fontSize: 11, color: '#eab308' }}><strong>Pivot:</strong> {finding.decisionGate.changeSignal}</div>
        <div style={{ fontSize: 11, color: '#ef4444' }}><strong>Abandon:</strong> {finding.decisionGate.abandonSignal}</div>
      </div>
    </div>
  );
}

/* ─── Chart: Arc Score Gauge ──────────────────────────── */
function ScoreArcGauge({ score, label }: { score: number; label: string }) {
  const R = 54;
  const cx = 70; const cy = 70;
  const circumference = Math.PI * R; // half-circle arc
  const filled = (score / 100) * circumference;
  const color = score >= 65 ? '#22c55e' : score >= 40 ? '#f97316' : '#ef4444';
  const startAngle = Math.PI; // left
  const toXY = (angle: number) => ({
    x: cx + R * Math.cos(angle),
    y: cy + R * Math.sin(angle),
  });
  const start = toXY(startAngle);
  const end = toXY(0);
  const arcPath = `M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={140} height={84} viewBox="0 0 140 84">
        {/* Background track */}
        <path d={arcPath} fill="none" stroke="#1e1e1e" strokeWidth={10} strokeLinecap="round" />
        {/* Filled arc */}
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
        {/* Score text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#f0f0f0" fontSize={22} fontWeight={700} fontFamily="Inter">{score}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#3a3a3a" fontSize={9} fontFamily="JetBrains Mono" letterSpacing={2}>/100</text>
      </svg>
      <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: -4 }}>{label}</span>
    </div>
  );
}

/* ─── Chart: Radar (pentagon) ─────────────────────────── */
function RadarChart({ dimensions }: { dimensions: Array<{ label: string; value: number; color: string }> }) {
  const cx = 90; const cy = 90; const R = 65;
  const n = dimensions.length;
  const pts = dimensions.map((_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const rings = [0.25, 0.5, 0.75, 1].map(r =>
    pts.map(p => `${cx + (p.x - cx) * r},${cy + (p.y - cy) * r}`).join(' ')
  );
  const dataPoints = dimensions.map((d, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const v = Math.max(0.05, d.value / 100);
    return { x: cx + R * v * Math.cos(a), y: cy + R * v * Math.sin(a) };
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      {/* Grid rings */}
      {rings.map((ring, ri) => (
        <polygon key={ri} points={ring} fill="none" stroke="#1e1e1e" strokeWidth={0.8} />
      ))}
      {/* Spokes */}
      {pts.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#1e1e1e" strokeWidth={0.8} />)}
      {/* Data area */}
      <path d={dataPath} fill="#f9731618" stroke="#f97316" strokeWidth={1.5}
        style={{ filter: 'drop-shadow(0 0 6px #f9731640)' }} />
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={dimensions[i].color} stroke="#080808" strokeWidth={1.5} />
      ))}
      {/* Labels */}
      {pts.map((p, i) => {
        const lx = cx + (p.x - cx) * 1.28;
        const ly = cy + (p.y - cy) * 1.28;
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fill="#5a5a5a" fontSize={7.5} fontFamily="JetBrains Mono">
            {dimensions[i].label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Chart: Horizontal Bars ──────────────────────────── */
function HBarChart({ bars }: { bars: Array<{ label: string; value: number; max?: number; color: string }> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {bars.map((b, i) => {
        const pct = Math.round((b.value / (b.max ?? 100)) * 100);
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#9a9a9a' }}>{b.label}</span>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: b.color }}>{b.value}</span>
            </div>
            <div style={{ height: 4, background: '#1e1e1e', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: b.color,
                width: `${pct}%`,
                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: `0 0 8px ${b.color}60`,
                animationDelay: `${i * 0.15}s`
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Chart: Activity Sparkline ───────────────────────── */
function ActivitySparkline({ actions, maxRound }: { actions: Array<{ round_num: number }>; maxRound: number }) {
  const W = 280; const H = 60;
  const rounds = Array.from({ length: maxRound }, (_, i) => i + 1);
  const counts = rounds.map(r => actions.filter(a => a.round_num === r).length);
  const maxCount = Math.max(...counts, 1);
  const pts = counts.map((c, i) => {
    const x = (i / (rounds.length - 1 || 1)) * (W - 20) + 10;
    const y = H - 10 - ((c / maxCount) * (H - 20));
    return `${x},${y}`;
  });
  const area = counts.map((c, i) => {
    const x = (i / (rounds.length - 1 || 1)) * (W - 20) + 10;
    const y = H - 10 - ((c / maxCount) * (H - 20));
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ` L ${(W - 20) + 10} ${H - 10} L 10 ${H - 10} Z`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <polyline points={pts.join(' ')} fill="none" stroke="#f97316" strokeWidth={1.5} strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 4px #f9731660)' }} />
      {counts.map((c, i) => {
        const x = (i / (rounds.length - 1 || 1)) * (W - 20) + 10;
        const y = H - 10 - ((c / maxCount) * (H - 20));
        return c > 0 ? <circle key={i} cx={x} cy={y} r={2.5} fill="#f97316" /> : null;
      })}
    </svg>
  );
}

/* ─── Chart: Donut (support vs objections) ────────────── */
function DonutChart({ slices }: { slices: Array<{ label: string; value: number; color: string }> }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  const R = 38; const cx = 50; const cy = 50;
  let angle = -Math.PI / 2;
  const arcs = slices.map(sl => {
    const sweep = (sl.value / total) * Math.PI * 2;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return { ...sl, d: `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z` };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        {arcs.map((a, i) => (
          <path key={i} d={a.d} fill={a.color} opacity={0.85}
            style={{ filter: `drop-shadow(0 0 4px ${a.color}50)` }} />
        ))}
        <circle cx={cx} cy={cy} r={22} fill="#080808" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#f0f0f0" fontSize={10} fontWeight={700}>{total}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#9a9a9a' }}>{s.label}</span>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: s.color, marginLeft: 'auto' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Chart: Battle Score Comparison ─────────────────── */
function BattleScoreBar({ labelA, scoreA, labelB, scoreB }: { labelA: string; scoreA: number; labelB: string; scoreB: number }) {
  const total = scoreA + scoreB || 1;
  const pctA = Math.round((scoreA / total) * 100);
  return (
    <div style={{ padding: '14px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
        <span style={{ color: '#ef4444', fontWeight: 600 }}>{labelA} <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>({scoreA})</span></span>
        <span style={{ color: '#22c55e', fontWeight: 600 }}>{labelB} <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>({scoreB})</span></span>
      </div>
      <div style={{ height: 8, background: '#1e1e1e', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${pctA}%`, background: '#ef4444', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 0 10px #ef444460' }} />
        <div style={{ flex: 1, background: '#22c55e', boxShadow: '0 0 10px #22c55e60' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a' }}>
        <span>{pctA}%</span>
        <span>{100 - pctA}%</span>
      </div>
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────── */

export default function VenturePulseApp() {
  const [appPhase, setAppPhase] = useState<'landing' | 'app'>('landing');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [scenario, setScenario] = useState<ScenarioInput>(EMPTY_SCENARIO);
  const [stakeholders, setStakeholders] = useState<StakeholderPreset[]>(DEFAULT_STAKEHOLDERS);
  const [strategyA, setStrategyA] = useState<string>('Self-serve automated onboarding with automated free trial');
  const [strategyB, setStrategyB] = useState<string>('High-touch white-glove assisted onboarding with pilot contract');
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunStateRecord | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [battle, setBattle] = useState<StrategyBattle | null>(null);
  const [isBattling, setIsBattling] = useState<boolean>(false);
  const [crawlUrl, setCrawlUrl] = useState<string>('');
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [crawlResult, setCrawlResult] = useState<{ sourceUrl: string; scrapeMethod: string; contentLength: number } | null>(null);
  const [crawlError, setCrawlError] = useState<string | null>(null);
  const crawlInputRef = useRef<HTMLInputElement>(null);

  /* ── Polling ── */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeRunId && isSimulating) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/status?runId=${activeRunId}`);
          const data = await res.json();
          if (data.success) {
            setRunState(data);
            if (data.phase === 'COMPLETED') {
              setIsSimulating(false);
              setCurrentStep(4);
            }
          }
        } catch {}
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [activeRunId, isSimulating]);

  /* ── Handlers ── */
  const handleStartSimulation = async () => {
    setErrorMessage(null);
    setIsSimulating(true);
    setCurrentStep(3);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, stakeholders: stakeholders.filter(s => s.enabled), strategyVariable: strategyA, maxRounds: 10 })
      });
      const data = await res.json();
      if (data.success) {
        setActiveRunId(data.runId);
      } else {
        setErrorMessage(data.error || 'Failed to initialize simulation');
        setIsSimulating(false);
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
      setIsSimulating(false);
    }
  };

  const handleStartBattle = async () => {
    if (!runState?.verdict) return;
    setIsBattling(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runAId: runState.runId, strategyBVariable: strategyB })
      });
      const data = await res.json();
      if (data.success) {
        setBattle(data.battle);
        setCurrentStep(5);
      } else {
        setErrorMessage(data.error || 'Battle execution failed');
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsBattling(false);
    }
  };

  const handleCrawlUrl = async () => {
    if (!crawlUrl.trim()) return;
    setIsCrawling(true);
    setCrawlError(null);
    setCrawlResult(null);
    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: crawlUrl.trim() }),
      });
      const data = await res.json();
      if (data.success && data.startupInfo) {
        setScenario(data.startupInfo);
        setCrawlResult({ sourceUrl: data.sourceUrl, scrapeMethod: data.scrapeMethod, contentLength: data.contentLength });
      } else {
        setCrawlError(data.error || 'Failed to fetch startup data from URL');
      }
    } catch (err) {
      setCrawlError((err as Error).message);
    } finally {
      setIsCrawling(false);
    }
  };

  const toggleStakeholder = (id: string) =>
    setStakeholders(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));

  const canProceedToStep2 = scenario.name.trim() && scenario.description.trim();

  /* ════════════════════════════════════════════════════ */
  /* LANDING PAGE                                          */
  /* ════════════════════════════════════════════════════ */
  if (appPhase === 'landing') {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" />

        {/* Nav */}
        <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e1e1e', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#000' }}>
              VP
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', letterSpacing: '-0.02em' }}>VenturePulse</span>
            <span className="badge badge-o">AI</span>
          </div>
          <button
            onClick={() => setAppPhase('app')}
            className="btn-outline"
            style={{ fontSize: 12 }}
          >
            Launch App <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </nav>

        {/* Hero */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', position: 'relative', zIndex: 10, textAlign: 'center' }}>

          <div className="anim-fade-up" style={{ marginBottom: 20 }}>
            <span className="badge badge-o" style={{ fontSize: 11, padding: '4px 12px' }}>
              <Zap style={{ width: 10, height: 10 }} />
              Powered by Gemma 4 · Multi-Agent AI
            </span>
          </div>

          <h1 className="anim-fade-up d1" style={{
            fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 700,
            color: '#f0f0f0',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            maxWidth: 800,
            marginBottom: 24
          }}>
            Validate your idea.<br />
            <span style={{ color: '#f97316' }}>Before the market does.</span>
          </h1>

          <p className="anim-fade-up d2" style={{
            fontSize: 16,
            color: '#6b6b6b',
            maxWidth: 500,
            lineHeight: 1.7,
            marginBottom: 40
          }}>
            Drop your startup concept. AI agents stress-test it across stakeholders, markets, and strategies — and deliver a plain-English verdict in minutes.
          </p>

          <div className="anim-fade-up d3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn"
              onClick={() => setAppPhase('app')}
              style={{ fontSize: 14, padding: '13px 28px' }}
            >
              Get Started Free
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Feature grid */}
          <div className="anim-fade-up d4" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 1,
            marginTop: 80,
            maxWidth: 700,
            width: '100%',
            border: '1px solid #1e1e1e',
            borderRadius: 12,
            overflow: 'hidden'
          }}>
            {[
              { icon: Brain, title: 'Multi-Agent Simulation', desc: 'Real stakeholder AI personas debate your idea' },
              { icon: Target, title: 'Assumption Testing', desc: 'Find critical weak points before you build' },
              { icon: TrendingUp, title: 'Viability Score', desc: 'Plain-English verdict with an actionable plan' },
              { icon: Lightbulb, title: 'Strategy Battle', desc: 'A/B test two go-to-market approaches head-to-head' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{
                  padding: '24px 20px',
                  background: '#0f0f0f',
                  borderRight: i < 3 ? '1px solid #1e1e1e' : undefined,
                  transition: 'background 0.2s'
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#0f0f0f')}
                >
                  <Icon style={{ width: 18, height: 18, color: '#f97316', marginBottom: 10 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', marginBottom: 5 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: '#5a5a5a', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer style={{ padding: '20px 40px', borderTop: '1px solid #111', display: 'flex', justifyContent: 'center' }}>
          <p style={{ fontSize: 11, color: '#3a3a3a' }}>VenturePulse AI · Validate faster, build smarter</p>
        </footer>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════ */
  /* APP SHELL                                             */
  /* ════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      {/* Loading overlay */}
      {isSimulating && <LoadingOverlay message="AI agents are stress-testing your idea…" />}
      {isBattling && <LoadingOverlay message="Running strategy comparison battle…" />}
      {isCrawling && <LoadingOverlay message="Crawling URL and extracting startup data…" />}

      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 32px', borderBottom: '1px solid #1e1e1e',
        background: '#080808', position: 'sticky', top: 0, zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setAppPhase('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 7, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#000' }}>VP</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', letterSpacing: '-0.02em' }}>VenturePulse</span>
          </button>
          <span className="badge badge-o">AI</span>
        </div>

        {/* Step progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {STEPS.map((step, i) => {
            const isActive = currentStep === step.num;
            const isDone = currentStep > step.num;
            const isClickable = step.num < currentStep ||
              (step.num === 4 && runState?.verdict) ||
              (step.num === 5 && battle);
            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => { if (isClickable) setCurrentStep(step.num); }}
                  disabled={!isClickable && !isActive}
                  title={step.label}
                  style={{
                    background: 'none', border: 'none', cursor: isClickable || isActive ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 6,
                    opacity: !isDone && !isActive && !isClickable ? 0.35 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <div className={`step-dot ${isActive ? 'active' : isDone ? 'done' : ''}`}>
                    {isDone ? '✓' : step.num}
                  </div>
                  <span style={{ fontSize: 12, color: isActive ? '#f0f0f0' : '#6b6b6b', display: window.innerWidth > 768 ? 'block' : 'none' }}>
                    {step.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 20, height: 1, background: isDone ? '#f9731628' : '#1e1e1e', transition: 'background 0.4s' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <button
          onClick={() => { setCurrentStep(1); setScenario(EMPTY_SCENARIO); setRunState(null); setBattle(null); setActiveRunId(null); }}
          className="btn-outline"
          style={{ fontSize: 12, padding: '7px 14px' }}
        >
          <RotateCcw style={{ width: 13, height: 13 }} /> Reset
        </button>
      </header>

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 32px',
          background: '#1a0a0a', borderBottom: '1px solid #ef444428', color: '#ef4444', fontSize: 13
        }}>
          <AlertTriangle style={{ width: 15, height: 15, flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b' }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
      )}

      {/* ── Main Content ── */}
      <main style={{ flex: 1, maxWidth: 960, width: '100%', margin: '0 auto', padding: '36px 24px' }}>

        {/* ══════════════════ STEP 1: LAUNCHPAD ══════════════════ */}
        {currentStep === 1 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step 01</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginTop: 4, letterSpacing: '-0.02em' }}>Define Your Idea</h2>
              <p style={{ fontSize: 13, color: '#6b6b6b', marginTop: 6, lineHeight: 1.6 }}>
                Describe your business. Paste a URL to auto-fill, or fill in the fields below.
              </p>
            </div>

            {/* URL Import */}
            <div className="card-accent" style={{ padding: 20, marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Globe style={{ width: 15, height: 15, color: '#f97316' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>Import from URL</span>
                <span className="badge badge-d">Crawl4AI</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Link2 style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#3a3a3a', pointerEvents: 'none' }} />
                  <input
                    ref={crawlInputRef}
                    type="url"
                    value={crawlUrl}
                    onChange={e => { setCrawlUrl(e.target.value); setCrawlError(null); }}
                    onKeyDown={e => e.key === 'Enter' && handleCrawlUrl()}
                    placeholder="https://yourstartup.com"
                    className="field"
                    style={{ paddingLeft: 36 }}
                  />
                </div>
                <button
                  id="crawl-url-btn"
                  onClick={handleCrawlUrl}
                  disabled={!crawlUrl.trim()}
                  className="btn"
                  style={{ padding: '10px 18px' }}
                >
                  <Zap style={{ width: 14, height: 14 }} />
                  Analyze
                </button>
              </div>
              {crawlResult && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  <CheckCheck style={{ width: 13, height: 13, color: '#22c55e' }} />
                  <span style={{ fontSize: 12, color: '#22c55e' }}>Fields filled from {new URL(crawlResult.sourceUrl).hostname}</span>
                  <span className="badge badge-g">{crawlResult.scrapeMethod}</span>
                </div>
              )}
              {crawlError && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, padding: '8px 12px', background: '#1a0808', border: '1px solid #ef444428', borderRadius: 6 }}>
                  <AlertTriangle style={{ width: 13, height: 13, color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: '#ef4444' }}>{crawlError}</span>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Venture / Idea Name</Label>
                <input type="text" value={scenario.name}
                  placeholder="e.g., CloudMesh, QuickFit, BuildBot..."
                  onChange={e => setScenario({ ...scenario, name: e.target.value })}
                  className="field" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Problem & Concept</Label>
                <textarea rows={3} value={scenario.description}
                  placeholder="What problem do you solve and how?"
                  onChange={e => setScenario({ ...scenario, description: e.target.value })}
                  className="field" />
              </div>
              <div>
                <Label>Target Audience</Label>
                <input type="text" value={scenario.targetAudience}
                  placeholder="e.g., Mid-market HR directors, freelance creators..."
                  onChange={e => setScenario({ ...scenario, targetAudience: e.target.value })}
                  className="field" />
              </div>
              <div>
                <Label>Business & Revenue Model</Label>
                <input type="text" value={scenario.businessModel}
                  placeholder="e.g., $99/mo SaaS, marketplace commission..."
                  onChange={e => setScenario({ ...scenario, businessModel: e.target.value })}
                  className="field" />
              </div>
              <div>
                <Label>Value Proposition</Label>
                <input type="text" value={scenario.valueProposition}
                  placeholder="e.g., Cut turnaround by 60% with automated approvals..."
                  onChange={e => setScenario({ ...scenario, valueProposition: e.target.value })}
                  className="field" />
              </div>
              <div>
                <Label accent>Key Assumption to Stress-Test</Label>
                <textarea rows={3} value={scenario.keyAssumption}
                  placeholder="e.g., Customers will switch from spreadsheets if onboarding is < 15 min..."
                  onChange={e => setScenario({ ...scenario, keyAssumption: e.target.value })}
                  className="field"
                  style={{ borderColor: scenario.keyAssumption ? '#f9731640' : undefined }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToStep2}
                className="btn"
              >
                Continue to Stakeholders
                <ArrowRight style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════ STEP 2: STAKEHOLDERS ══════════════════ */}
        {currentStep === 2 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step 02</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginTop: 4, letterSpacing: '-0.02em' }}>Configure Market Agents</h2>
              <p style={{ fontSize: 13, color: '#6b6b6b', marginTop: 6, lineHeight: 1.6 }}>
                Choose which AI stakeholders will challenge your idea. {stakeholders.filter(s => s.enabled).length} of 5 active.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
              {stakeholders.map(s => (
                <div
                  key={s.id}
                  onClick={() => toggleStakeholder(s.id)}
                  style={{
                    padding: 16, borderRadius: 10, cursor: 'pointer',
                    border: `1px solid ${s.enabled ? '#f9731640' : '#1e1e1e'}`,
                    background: s.enabled ? '#111' : '#0d0d0d',
                    opacity: s.enabled ? 1 : 0.5,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.enabled ? '#f9731660' : '#2a2a2a'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = s.enabled ? '#f9731640' : '#1e1e1e'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{s.role}</span>
                    <div style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: `2px solid ${s.enabled ? '#f97316' : '#3a3a3a'}`,
                      background: s.enabled ? '#f97316' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s'
                    }}>
                      {s.enabled && <span style={{ color: '#000', fontSize: 10, fontWeight: 700 }}>✓</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: '#6b6b6b', marginBottom: 6, lineHeight: 1.5 }}>
                    <strong style={{ color: '#9a9a9a' }}>Goal: </strong>{s.goal}
                  </p>
                  <p style={{ fontSize: 11, color: '#22c55e80', lineHeight: 1.5 }}>
                    <strong style={{ color: '#22c55e60' }}>Incentive: </strong>{s.incentive}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ padding: 16, borderRadius: 8, background: '#0f0f0f', border: '1px solid #1e1e1e', marginBottom: 24 }}>
              <Label>Strategy A Variable (Simulation Hypothesis)</Label>
              <input type="text" value={strategyA}
                onChange={e => setStrategyA(e.target.value)}
                className="field" style={{ marginTop: 6 }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setCurrentStep(1)} className="btn-outline">
                ← Back
              </button>
              <button onClick={handleStartSimulation} className="btn" style={{ fontSize: 14, padding: '12px 24px' }}>
                <Play style={{ width: 15, height: 15 }} />
                Launch AI War Room
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════ STEP 3: WAR ROOM ══════════════════ */}
        {currentStep === 3 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step 03</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginTop: 4, letterSpacing: '-0.02em' }}>War Room</h2>
              <p style={{ fontSize: 13, color: '#6b6b6b', marginTop: 6 }}>Live multi-agent simulation — AI stakeholders debating your idea in real-time.</p>
            </div>

            {/* AI Brain card */}
            <div className="card-accent" style={{ padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '2px solid #f9731630',
                    borderTop: '2px solid #f97316',
                    animation: isSimulating ? 'spinSlow 1.5s linear infinite' : 'none'
                  }} />
                  <div style={{
                    position: 'absolute', inset: 6, borderRadius: '50%',
                    border: '1px solid #f9731618',
                    borderBottom: '1px solid #f97316',
                    animation: isSimulating ? 'spinSlow 2.5s linear infinite reverse' : 'none'
                  }} />
                  <Brain style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 20, height: 20, color: '#f97316'
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gemma 4 Neural Core</span>
                    <span className={`badge ${isSimulating ? 'badge-y' : 'badge-g'}`}>
                      {isSimulating ? 'ACTIVE' : 'COMPLETE'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0f0f0' }}>
                    Stress-Testing: {scenario.name || 'Your Idea'}
                  </h3>
                  <p style={{ fontSize: 12, color: '#6b6b6b', marginTop: 4 }}>
                    {isSimulating
                      ? 'Running multi-stakeholder analysis, surfacing critical risks and market assumptions…'
                      : 'Simulation complete. View your verdict below.'}
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flexShrink: 0 }}>
                  {[
                    { label: 'Round', value: `${runState?.currentRound || 1}/${runState?.maxRounds || 10}`, color: '#f0f0f0' },
                    { label: 'Agents', value: `${stakeholders.filter(s => s.enabled).length}`, color: '#f97316' },
                    { label: 'Elapsed', value: `${runState?.elapsedSeconds || 0}s`, color: '#22c55e' },
                  ].map(g => (
                    <div key={g.label} style={{ padding: '8px 12px', background: '#080808', border: '1px solid #1e1e1e', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', marginBottom: 4 }}>{g.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: g.color }}>{g.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${Math.round(((runState?.currentRound || 1) / (runState?.maxRounds || 10)) * 100)}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, fontFamily: 'JetBrains Mono' }}>
                <span style={{ color: '#6b6b6b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSimulating ? '#eab308' : '#22c55e', display: 'inline-block', animation: isSimulating ? 'pulseOrange 1.5s ease-in-out infinite' : 'none' }} />
                  {runState?.phase || 'INITIALIZING'}
                </span>
                <span style={{ color: '#f97316' }}>
                  {Math.round(((runState?.currentRound || 1) / (runState?.maxRounds || 10)) * 100)}%
                </span>
              </div>
            </div>

            {/* ── War Room Analytics ── */}
            {runState?.recentActions && runState.recentActions.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {/* Sparkline */}
                <div className="card" style={{ padding: 16 }}>
                  <h4 style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Agent Activity per Round</h4>
                  <ActivitySparkline actions={runState.recentActions} maxRound={runState?.maxRounds || 10} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a' }}>
                    <span>Round 1</span>
                    <span>Round {runState?.maxRounds || 10}</span>
                  </div>
                </div>
                {/* Platform & sentiment bars */}
                <div className="card" style={{ padding: 16 }}>
                  <h4 style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Platform Distribution</h4>
                  <HBarChart bars={[
                    { label: 'Twitter / X posts', value: runState.recentActions.filter(a => a.platform === 'twitter').length, max: runState.recentActions.length, color: '#f97316' },
                    { label: 'Reddit comments', value: runState.recentActions.filter(a => a.platform === 'reddit').length, max: runState.recentActions.length, color: '#22c55e' },
                    { label: 'Total interactions', value: runState.recentActions.length, max: runState.recentActions.length, color: '#6b6b6b' },
                  ]} />
                </div>
              </div>
            )}

            {/* Agent feed */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                Live Agent Feed
              </h3>
              <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {runState?.recentActions && runState.recentActions.length > 0 ? (
                  runState.recentActions.map((act, i) => (
                    <div key={i} className="feed-card" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#f97316' }}>
                          @{act.agent_name}
                          <span style={{ color: '#3a3a3a', fontWeight: 400 }}> · {act.platform}</span>
                        </span>
                        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a' }}>Round {act.round_num}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#b0b0b0', lineHeight: 1.6 }}>
                        "{act.action_args?.content as string}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    {isSimulating ? (
                      <>
                        <div className="dots" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                          <span /><span /><span />
                        </div>
                        <p style={{ fontSize: 13, color: '#3a3a3a' }}>Agents are warming up…</p>
                      </>
                    ) : (
                      <p style={{ fontSize: 13, color: '#3a3a3a' }}>No agent activity yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(2)} className="btn-outline">← Back</button>
              {runState?.phase === 'COMPLETED' && (
                <button onClick={() => setCurrentStep(4)} className="btn">
                  View Verdict <ArrowRight style={{ width: 15, height: 15 }} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════ STEP 4: VERDICT ══════════════════ */}
        {currentStep === 4 && runState?.verdict && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step 04</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginTop: 4, letterSpacing: '-0.02em' }}>AI Verdict</h2>
              <p style={{ fontSize: 13, color: '#6b6b6b', marginTop: 6 }}>Gemma 4 evidence-backed assessment of your business idea.</p>
            </div>

            {runState.verdict.easyVerdict && (() => {
              const ev = runState.verdict.easyVerdict!;
              const scoreColor = ev.overallScore >= 65 ? '#22c55e' : ev.overallScore >= 40 ? '#eab308' : '#ef4444';
              const labelStyle = ev.verdictLabel === 'STRONG GO' ? 'badge-g' : ev.verdictLabel === 'CAUTIOUS PIVOT' ? 'badge-y' : 'badge-r';
              return (
                <>
                  {/* ── Analytics Hero Row ── */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
                    {/* Arc gauge */}
                    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Viability Score</span>
                      <ScoreArcGauge score={ev.overallScore} label={ev.verdictLabel} />
                    </div>

                    {/* Radar chart */}
                    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Stakeholder Sentiment</span>
                      <RadarChart dimensions={[
                        { label: 'Market Fit', value: Math.min(100, ev.overallScore + 10), color: '#f97316' },
                        { label: 'Revenue', value: Math.max(10, ev.overallScore - 5), color: '#22c55e' },
                        { label: 'Risk Mgmt', value: Math.max(10, 100 - (ev.criticalRisks.filter(r => r.severity === 'HIGH').length * 25)), color: '#ef4444' },
                        { label: 'Traction', value: Math.min(100, ev.strengths.length * 25), color: '#eab308' },
                        { label: 'Execution', value: Math.min(100, ev.actionableNextSteps.length * 20 + 20), color: '#a78bfa' },
                      ]} />
                    </div>

                    {/* Findings donut */}
                    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Evidence Breakdown</span>
                      <DonutChart slices={[
                        { label: 'Supporting', value: runState.verdict.supportingArguments.length, color: '#22c55e' },
                        { label: 'Objections', value: runState.verdict.majorObjections.length, color: '#ef4444' },
                        { label: 'Conflicts', value: runState.verdict.stakeholderConflicts.length, color: '#eab308' },
                        { label: 'Unresolved', value: runState.verdict.unresolvedAssumptions.length, color: '#3a3a3a' },
                      ]} />
                    </div>

                    {/* Risk severity bars */}
                    <div className="card" style={{ padding: 20 }}>
                      <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 14 }}>Risk Severity</span>
                      <HBarChart bars={[
                        { label: 'HIGH severity', value: ev.criticalRisks.filter(r => r.severity === 'HIGH').length, max: ev.criticalRisks.length || 1, color: '#ef4444' },
                        { label: 'MEDIUM severity', value: ev.criticalRisks.filter(r => r.severity === 'MEDIUM').length, max: ev.criticalRisks.length || 1, color: '#eab308' },
                        { label: 'Strengths', value: ev.strengths.length, max: Math.max(ev.criticalRisks.length, ev.strengths.length) || 1, color: '#22c55e' },
                      ]} />
                    </div>
                  </div>

                  {/* Top score card */}
                  <div className="card-accent" style={{ padding: 28, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.02em' }}>{scenario.name || 'Your Startup'}</h3>
                          <span className={`badge ${labelStyle}`} style={{ fontSize: 11 }}>{ev.verdictLabel}</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#9a9a9a', lineHeight: 1.7, maxWidth: 560 }}>{ev.executiveSummary}</p>
                      </div>
                    </div>

                    {/* Key recommendation */}
                    <div style={{ padding: '12px 16px', background: '#0f0f0f', border: '1px solid #f9731628', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <Sparkles style={{ width: 15, height: 15, color: '#f97316', flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 3 }}>Top Action</span>
                        <p style={{ fontSize: 13, color: '#b0b0b0', lineHeight: 1.6 }}>{ev.keyRecommendation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Strengths / Risks / Steps grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 24 }}>
                    {/* Strengths */}
                    <div className="card" style={{ padding: 20 }}>
                      <h4 style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 style={{ width: 13, height: 13 }} /> Core Advantages
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {ev.strengths.map((s, i) => (
                          <div key={i}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', marginBottom: 3 }}>{s.title}</div>
                            <div style={{ fontSize: 12, color: '#6b6b6b', lineHeight: 1.6 }}>{s.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risks */}
                    <div className="card" style={{ padding: 20 }}>
                      <h4 style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle style={{ width: 13, height: 13 }} /> Critical Risks
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {ev.criticalRisks.map((r, i) => (
                          <div key={i}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>{r.title}</span>
                              <span className={`badge ${r.severity === 'HIGH' ? 'badge-r' : 'badge-y'}`}>{r.severity}</span>
                            </div>
                            <div style={{ fontSize: 12, color: '#6b6b6b', lineHeight: 1.6 }}>{r.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next steps */}
                    <div className="card" style={{ padding: 20 }}>
                      <h4 style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap style={{ width: 13, height: 13 }} /> Next 48 Hours
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {ev.actionableNextSteps.map((step, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316', flexShrink: 0, width: 18, height: 18, borderRadius: '50%', border: '1px solid #f9731630', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{i + 1}</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', marginBottom: 2 }}>{step.step}</div>
                              <div style={{ fontSize: 12, color: '#6b6b6b', lineHeight: 1.6 }}>{step.why}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Disclaimer */}
            <div style={{ padding: '12px 16px', background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 8, display: 'flex', gap: 10, marginBottom: 24 }}>
              <Info style={{ width: 14, height: 14, color: '#3a3a3a', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, color: '#3a3a3a', lineHeight: 1.6 }}>
                AI-simulated stakeholder perspectives. Not real market research or investment advice. Validate with real customers.
              </span>
            </div>

            {/* Detailed logs */}
            <details style={{ marginBottom: 24 }}>
              <summary style={{ fontSize: 12, color: '#6b6b6b', cursor: 'pointer', padding: '8px 0', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChevronRight style={{ width: 13, height: 13 }} />
                Detailed Simulation Logs & Decision Gates
              </summary>
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <h3 style={{ fontSize: 11, color: '#22c55e', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 style={{ width: 12, height: 12 }} /> Strongest Arguments
                  </h3>
                  {runState.verdict.supportingArguments.map(f => <FindingCard key={f.id} finding={f} type="support" />)}
                  <h3 style={{ fontSize: 11, color: '#eab308', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Flame style={{ width: 12, height: 12 }} /> Stakeholder Conflicts
                  </h3>
                  {runState.verdict.stakeholderConflicts.map(f => <FindingCard key={f.id} finding={f} type="conflict" />)}
                </div>
                <div>
                  <h3 style={{ fontSize: 11, color: '#ef4444', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle style={{ width: 12, height: 12 }} /> Major Objections
                  </h3>
                  {runState.verdict.majorObjections.map(f => <FindingCard key={f.id} finding={f} type="objection" />)}
                  <h3 style={{ fontSize: 11, color: '#3a3a3a', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <HelpCircle style={{ width: 12, height: 12 }} /> Unresolved
                  </h3>
                  {runState.verdict.unresolvedAssumptions.map(f => <FindingCard key={f.id} finding={f} type="unresolved" />)}
                </div>
              </div>
            </details>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              <button onClick={() => setCurrentStep(3)} className="btn-outline">← War Room</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <div>
                  <Label style={{ marginBottom: 4 }}>Strategy B (for battle)</Label>
                  <input type="text" value={strategyB}
                    onChange={e => setStrategyB(e.target.value)}
                    className="field" style={{ width: 280, display: 'inline-block' }} />
                </div>
                <button onClick={handleStartBattle} className="btn" style={{ alignSelf: 'flex-end' }}>
                  <Swords style={{ width: 14, height: 14 }} />
                  {isBattling ? 'Battling…' : 'Strategy Battle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ STEP 5: BATTLE ══════════════════ */}
        {currentStep === 5 && battle && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step 05</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginTop: 4, letterSpacing: '-0.02em' }}>Strategy Battle</h2>
              <p style={{ fontSize: 13, color: '#6b6b6b', marginTop: 6 }}>Head-to-head comparison of two go-to-market strategies.</p>
            </div>

            <div style={{ padding: '10px 14px', background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 8, display: 'flex', gap: 8, marginBottom: 24 }}>
              <Info style={{ width: 13, height: 13, color: '#3a3a3a', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, color: '#3a3a3a', lineHeight: 1.6 }}>Two independent simulations. Differences may reflect run variation as well as the strategy change.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {/* Strategy A */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className="badge badge-r">Strategy A</span>
                  <span style={{ fontSize: 11, color: '#3a3a3a' }}>{battle.runAId}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', marginBottom: 8 }}>{battle.strategyA.variableValue}</h3>
                <p style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 14, lineHeight: 1.6 }}>{battle.strategyA.verdict.summary}</p>
                <h4 style={{ fontSize: 11, color: '#ef4444', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Unique to A</h4>
                <ul style={{ paddingLeft: 16 }}>
                  {battle.comparison.onlyInA.map((item, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#9a9a9a', marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Strategy B */}
              <div className="card-accent" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className="badge badge-g">Strategy B</span>
                  <span style={{ fontSize: 11, color: '#3a3a3a' }}>{battle.runBId}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', marginBottom: 8 }}>{battle.strategyB.variableValue}</h3>
                <p style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 14, lineHeight: 1.6 }}>{battle.strategyB.verdict.summary}</p>
                <h4 style={{ fontSize: 11, color: '#22c55e', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Unique to B</h4>
                <ul style={{ paddingLeft: 16 }}>
                  {battle.comparison.onlyInB.map((item, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#9a9a9a', marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Battle Analytics ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div className="card" style={{ padding: 20 }}>
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>Score Comparison</span>
                <BattleScoreBar
                  labelA="Strategy A"
                  scoreA={battle.strategyA.verdict.easyVerdict?.overallScore ?? 40}
                  labelB="Strategy B"
                  scoreB={battle.strategyB.verdict.easyVerdict?.overallScore ?? 60}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                  <div style={{ textAlign: 'center', padding: '10px 0', borderRadius: 8, background: '#ef444410', border: '1px solid #ef444420' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>{battle.strategyA.verdict.easyVerdict?.overallScore ?? '–'}</div>
                    <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', marginTop: 2 }}>Strategy A</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px 0', borderRadius: 8, background: '#22c55e10', border: '1px solid #22c55e20' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#22c55e' }}>{battle.strategyB.verdict.easyVerdict?.overallScore ?? '–'}</div>
                    <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', marginTop: 2 }}>Strategy B</div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 14 }}>Evidence Delta</span>
                <HBarChart bars={[
                  { label: 'Shared themes', value: battle.comparison.sharedThemes.length, max: Math.max(battle.comparison.sharedThemes.length, battle.comparison.onlyInA.length, battle.comparison.onlyInB.length) || 1, color: '#f97316' },
                  { label: 'Unique to A', value: battle.comparison.onlyInA.length, max: Math.max(battle.comparison.sharedThemes.length, battle.comparison.onlyInA.length, battle.comparison.onlyInB.length) || 1, color: '#ef4444' },
                  { label: 'Unique to B', value: battle.comparison.onlyInB.length, max: Math.max(battle.comparison.sharedThemes.length, battle.comparison.onlyInA.length, battle.comparison.onlyInB.length) || 1, color: '#22c55e' },
                ]} />
              </div>
            </div>

            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: 11, color: '#f97316', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck style={{ width: 13, height: 13 }} /> Shared Robust Themes
              </h3>
              <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {battle.comparison.sharedThemes.map((t, i) => <li key={i} style={{ fontSize: 13, color: '#9a9a9a' }}>{t}</li>)}

              </ul>
            </div>

            <div style={{ padding: 20, background: '#0f0f0f', border: '1px solid #22c55e28', borderRadius: 10, marginBottom: 24 }}>
              <span style={{ fontSize: 11, color: '#22c55e', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Recommended Validation Gate</span>
              <p style={{ fontSize: 14, color: '#f0f0f0', lineHeight: 1.7 }}>{battle.comparison.recommendedNextStep}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(4)} className="btn-outline">← Verdict</button>
              <button onClick={() => { setCurrentStep(1); setScenario(EMPTY_SCENARIO); setRunState(null); setBattle(null); setActiveRunId(null); }} className="btn">
                <RotateCcw style={{ width: 14, height: 14 }} /> New Analysis
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Label helper ── */
function Label({ children, accent, style }: { children: React.ReactNode; accent?: boolean; style?: React.CSSProperties }) {
  return (
    <label style={{
      display: 'block',
      fontSize: 11,
      fontWeight: 600,
      color: accent ? '#f97316' : '#6b6b6b',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: 6,
      ...style
    }}>
      {children}
    </label>
  );
}
