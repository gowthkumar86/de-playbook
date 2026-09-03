import React, { useState } from 'react';
import { SECTION_0_DATA } from '../data/section0Data';
import { 
  Award, 
  Brain, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Database, 
  Flame, 
  HelpCircle, 
  Layers, 
  Lightbulb, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  Terminal, 
  XCircle, 
  Zap, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

interface Section0ViewProps {
  onNavigateToSection1?: () => void;
  initialModule?: string;
}

type ModuleFilter = 
  | 'all' 
  | '0.1' 
  | '0.2' 
  | '0.3' 
  | '0.4' 
  | '0.5' 
  | '0.6' 
  | '0.7' 
  | '0.8' 
  | '0.9' 
  | '0.10' 
  | '0.11' 
  | '0.12';

export const Section0View: React.FC<Section0ViewProps> = ({ 
  onNavigateToSection1,
  initialModule 
}) => {
  const [activeModule, setActiveModule] = useState<ModuleFilter>((initialModule as ModuleFilter) || 'all');

  React.useEffect(() => {
    if (initialModule) {
      setActiveModule(initialModule as ModuleFilter);
    }
  }, [initialModule]);
  const [activeScenarioStep, setActiveScenarioStep] = useState<number>(1);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* 0.0 Top Header Banner with Audience & Strategic Goal */}
      <div className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9D1C1]/60 pb-3">
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-sm bg-[#E9E4D9] border border-[#D9D1C1] text-[#8C7B65] text-[10px] font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-[#BF360C] shrink-0" /> Section 00 • Executive Interview Protocol
          </div>
          <span className="text-[11px] font-mono uppercase text-[#8C7B65]">Infosys 5–10 YOE Calibration</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
            {SECTION_0_DATA.title}
          </h1>
          <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#5A5245] mt-2 sm:mt-3 max-w-4xl leading-relaxed">
            Convert existing Snowflake expertise into senior-level interview answers and close strategic gaps across PySpark, Databricks, Delta Lake, ADF, and Lakehouse architectures.
          </p>
        </div>

        {/* Audience, Strength & Goal Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[#D9D1C1]">
          <div className="bg-[#F9F7F2] p-3.5 sm:p-4 rounded-sm border border-[#D9D1C1] border-l-4 border-l-[#1A1A1A] space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#8C7B65] uppercase tracking-widest block">Candidate Profile</span>
            <p className="text-xs sm:text-sm font-serif font-medium text-[#1A1A1A] leading-relaxed">
              {SECTION_0_DATA.meta.audience}
            </p>
          </div>

          <div className="bg-[#F9F7F2] p-3.5 sm:p-4 rounded-sm border border-[#D9D1C1] border-l-4 border-l-[#2E5A36] space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#2E5A36] uppercase tracking-widest block">Anchor Strength</span>
            <p className="text-xs sm:text-sm font-serif font-medium text-[#1A1A1A] leading-relaxed">
              {SECTION_0_DATA.meta.existingStrength}
            </p>
          </div>

          <div className="bg-[#F9F7F2] p-3.5 sm:p-4 rounded-sm border border-[#D9D1C1] border-l-4 border-l-[#BF360C] space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#BF360C] uppercase tracking-widest block">Core Goal</span>
            <p className="text-xs sm:text-sm font-serif font-medium text-[#1A1A1A] leading-relaxed">
              {SECTION_0_DATA.meta.goal}
            </p>
          </div>
        </div>
      </div>

      {/* Internal Sticky Sub-Navigation Bar */}
      <div className="sticky top-16 z-20 bg-[#F9F7F2]/95 backdrop-blur-sm border-y border-[#D9D1C1] py-2 px-1 -mx-2 sm:mx-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono">
          <span className="text-[10px] uppercase tracking-wider text-[#8C7B65] pl-2 pr-1 shrink-0 font-bold">Jump To:</span>
          <button
            onClick={() => setActiveModule('all')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === 'all'
                ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => setActiveModule('0.1')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.1'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.1 Mindset Shift
          </button>
          <button
            onClick={() => setActiveModule('0.2')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.2'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.2 The Study Loop
          </button>
          <button
            onClick={() => setActiveModule('0.3')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.3'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.3 Deeply vs Memorize
          </button>
          <button
            onClick={() => setActiveModule('0.4')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.4'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.4 Practice Non-Negotiables
          </button>
          <button
            onClick={() => setActiveModule('0.5')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.5'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.5 Scenario Framework
          </button>
          <button
            onClick={() => setActiveModule('0.6')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.6'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.6 "I Don't Know"
          </button>
          <button
            onClick={() => setActiveModule('0.7')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.7'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.7 Flagship Snowflake
          </button>
          <button
            onClick={() => setActiveModule('0.8')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.8'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.8 Senior-Level Sound
          </button>
          <button
            onClick={() => setActiveModule('0.9')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.9'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.9 Red Flags
          </button>
          <button
            onClick={() => setActiveModule('0.10')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.10'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.10 7-Day Plan
          </button>
          <button
            onClick={() => setActiveModule('0.11')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.11'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.11 Ground Rules
          </button>
          <button
            onClick={() => setActiveModule('0.12')}
            className={`px-3 py-1.5 rounded-sm shrink-0 uppercase tracking-wider transition-all min-h-[34px] cursor-pointer ${
              activeModule === '0.12'
                ? 'bg-[#BF360C] text-white font-bold shadow-xs'
                : 'bg-white text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
            }`}
          >
            0.12 Quick Revision
          </button>
        </div>
      </div>

      {/* 0.1 The Mindset Shift */}
      {(activeModule === 'all' || activeModule === '0.1') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.mindsetShift.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">Cognitive Shift</span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-[#5A5245] leading-relaxed">
            {SECTION_0_DATA.mindsetShift.description}
          </p>

          {/* 3 Lenses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SECTION_0_DATA.mindsetShift.threeLenses.map((lens) => (
              <div 
                key={lens.number} 
                className="bg-[#F9F7F2] p-4 sm:p-5 rounded-sm border border-[#D9D1C1] border-t-4 border-t-[#BF360C] flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#BF360C] uppercase tracking-widest">
                      Lens 0{lens.number}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#8C7B65]" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#1A1A1A]">{lens.name}</h3>
                  <p className="text-xs sm:text-sm font-sans text-[#3D372F] mt-2 leading-relaxed">
                    {lens.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Internal Test Litmus Callout */}
          <div className="bg-[#1A1A1A] text-white p-4 sm:p-6 rounded-sm border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#BF360C]">
                <Zap className="w-3.5 h-3.5" /> The Internal Litmus Test (Under 2 Minutes)
              </div>
              <button
                onClick={() => copyToClipboard(SECTION_0_DATA.mindsetShift.internalTest)}
                className="text-[10px] font-mono text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer bg-stone-900 px-2 py-1 rounded-sm border border-stone-800"
              >
                {copiedQuote ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedQuote ? 'Copied' : 'Copy Test'}</span>
              </button>
            </div>
            <blockquote className="text-sm sm:text-base md:text-lg font-serif italic text-stone-100 leading-relaxed pl-3 border-l-2 border-[#BF360C]">
              &ldquo;{SECTION_0_DATA.mindsetShift.internalTest}&rdquo;
            </blockquote>
            <p className="text-xs font-mono text-stone-400 pt-1">
              {SECTION_0_DATA.mindsetShift.warning}
            </p>
          </div>
        </section>
      )}

      {/* 0.2 How to Study Each Section (The Loop) */}
      {(activeModule === 'all' || activeModule === '0.2') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.studyLoop.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">Execution Cadence</span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-[#5A5245] leading-relaxed">
            Use this 5-step loop for every <span className="font-bold text-[#BF360C]">🔴 MUST MASTER</span> topic:
          </p>

          {/* 5-Step Loop Table */}
          <div className="border border-[#D9D1C1] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-[#E9E4D9] text-[#1A1A1A] uppercase tracking-wider font-mono text-[11px] border-b border-[#D9D1C1]">
                    <th className="p-3 w-1/5 font-bold">Step</th>
                    <th className="p-3 w-3/5 font-bold">What to do</th>
                    <th className="p-3 w-1/5 font-bold text-right font-mono">Time budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D1C1] bg-white">
                  {SECTION_0_DATA.studyLoop.steps.map((s, idx) => (
                    <tr key={idx} className="hover:bg-[#F9F7F2] transition-colors">
                      <td className="p-3 font-serif font-bold text-sm text-[#1A1A1A] align-middle bg-[#F9F7F2]/40">
                        {s.step}
                      </td>
                      <td className="p-3 text-[#3D372F] align-middle leading-relaxed font-sans text-xs sm:text-sm">
                        {s.whatToDo}
                      </td>
                      <td className="p-3 text-[#8C7B65] font-mono font-bold align-middle text-right text-xs">
                        {s.timeBudget}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Speaking Warning Alert */}
          <div className="bg-[#FAECE8] border border-[#E8B4A6] p-4 rounded-sm text-xs text-[#7A2110] space-y-1">
            <div className="flex items-center gap-2 font-bold font-mono uppercase tracking-wider text-[#BF360C]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Critical Warning on Spoken Practice</span>
            </div>
            <p className="font-serif italic leading-relaxed text-sm">
              {SECTION_0_DATA.studyLoop.speakingWarning}
            </p>
          </div>

          {/* Tier Guidance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {SECTION_0_DATA.studyLoop.tierUsage.map((t, idx) => (
              <div key={idx} className="bg-[#F9F7F2] p-4 rounded-sm border border-[#D9D1C1] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
                      {t.tierBadge}
                    </span>
                    <span className="text-[9px] font-mono text-[#8C7B65] uppercase">{t.tierName}</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-[#BF360C]">{t.stepsUsed}</p>
                </div>
                <p className="text-xs text-[#5A5245] font-serif italic pt-1 border-t border-[#D9D1C1]/60">
                  {t.note}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 0.3 Deeply vs Memorize vs Recognize */}
      {(activeModule === 'all' || activeModule === '0.3') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.deepVsMemorizeVsRecognize.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">Cognitive Allocation</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Learn Deeply */}
            <div className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-5 shadow-xs border-t-4 border-t-[#2E5A36] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#2E5A36] uppercase tracking-wider bg-[#EFF5EE] px-2 py-0.5 rounded-sm">
                    First-Principles
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#2E5A36]" />
                </div>
                <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">
                  Learn Deeply (Derive on the spot)
                </h3>
                <p className="text-[11px] text-[#5A5245] font-serif italic mt-0.5 mb-3">
                  Must be able to explain internal mechanics and failure modes under pressure:
                </p>

                <ul className="space-y-2 text-xs text-[#3D372F] font-sans">
                  {SECTION_0_DATA.deepVsMemorizeVsRecognize.learnDeeply.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#F9F7F2] p-2 rounded-sm border border-[#D9D1C1]/60">
                      <span className="text-[#2E5A36] font-bold shrink-0 mt-0.5">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Memorize */}
            <div className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-5 shadow-xs border-t-4 border-t-[#8C7B65] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#8C7B65] uppercase tracking-wider bg-[#E9E4D9] px-2 py-0.5 rounded-sm">
                    Instant Recall
                  </span>
                  <Clock className="w-4 h-4 text-[#8C7B65]" />
                </div>
                <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">
                  Memorize (Instant Recall)
                </h3>
                <p className="text-[11px] text-[#5A5245] font-serif italic mt-0.5 mb-3">
                  Interviewers expect zero hesitation on these exact signatures and definitions:
                </p>

                <ul className="space-y-2 text-xs text-[#3D372F] font-sans">
                  {SECTION_0_DATA.deepVsMemorizeVsRecognize.memorize.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#F9F7F2] p-2 rounded-sm border border-[#D9D1C1]/60">
                      <span className="text-[#8C7B65] font-bold shrink-0 mt-0.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Just Recognize */}
            <div className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-5 shadow-xs border-t-4 border-t-[#1A1A1A] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider bg-[#E9E4D9] px-2 py-0.5 rounded-sm">
                    Surface Awareness
                  </span>
                  <Terminal className="w-4 h-4 text-[#1A1A1A]" />
                </div>
                <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">
                  Just Recognize (Don&rsquo;t sink time)
                </h3>
                <p className="text-[11px] text-[#5A5245] font-serif italic mt-0.5 mb-3">
                  Know the &ldquo;what and why&rdquo; but avoid memorizing endless syntax:
                </p>

                <ul className="space-y-2 text-xs text-[#3D372F] font-sans">
                  {SECTION_0_DATA.deepVsMemorizeVsRecognize.justRecognize.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#F9F7F2] p-2 rounded-sm border border-[#D9D1C1]/60">
                      <span className="text-[#1A1A1A] font-bold shrink-0 mt-0.5">○</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F9F7F2] p-3 rounded-sm border border-[#D9D1C1] text-[11px] text-[#5A5245] font-serif italic mt-3">
                Focus 80% of your cognitive energy on Column 1 to dominate senior rounds.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 0.4 How to Practice — The Non-Negotiables */}
      {(activeModule === 'all' || activeModule === '0.4') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.practiceNonNegotiables.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">Hands-On Drills</span>
          </div>

          <div className="bg-[#F9F7F2] p-3.5 sm:p-4 rounded-sm border border-[#D9D1C1] text-xs sm:text-sm font-serif italic text-[#1A1A1A]">
            &ldquo;{SECTION_0_DATA.practiceNonNegotiables.callout}&rdquo;
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {SECTION_0_DATA.practiceNonNegotiables.categories.map((cat, cIdx) => (
              <div key={cIdx} className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-serif font-bold text-[#1A1A1A]">{cat.category}</span>
                    <span className="text-[10px] font-mono font-bold text-[#BF360C] uppercase tracking-wider bg-[#FAECE8] px-2 py-0.5 rounded-sm">
                      Real Engine
                    </span>
                  </div>
                  <p className="text-xs text-[#8C7B65] font-mono mb-3">
                    {cat.environment}
                  </p>

                  <ul className="space-y-2 text-xs text-[#3D372F] font-sans">
                    {cat.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2 bg-[#F9F7F2] p-2.5 rounded-sm border border-[#D9D1C1]/60">
                        <span className="w-4 h-4 rounded-full bg-[#E9E4D9] text-[#1A1A1A] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {tIdx + 1}
                        </span>
                        <span className="leading-relaxed font-medium">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FAECE8] border border-[#E8B4A6] p-3.5 sm:p-4 rounded-sm text-xs text-[#7A2110] flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#BF360C] shrink-0" />
            <span className="leading-relaxed">
              <strong>CRITICAL NOTICE:</strong> {SECTION_0_DATA.practiceNonNegotiables.handsOnWarning}
            </span>
          </div>
        </section>
      )}

      {/* 0.5 How to Answer Scenario Questions */}
      {(activeModule === 'all' || activeModule === '0.5') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.scenarioQuestions.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">6-Step Diagnostic</span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-[#5A5245] leading-relaxed">
            {SECTION_0_DATA.scenarioQuestions.description}
          </p>

          {/* Archetypal Question Prompt */}
          <div className="bg-[#1A1A1A] text-white p-4 sm:p-5 rounded-sm space-y-2 border border-stone-800 shadow-sm">
            <span className="text-[10px] font-mono text-[#BF360C] uppercase tracking-widest block font-bold">
              Archetypal Senior Scenario Prompt
            </span>
            <p className="text-sm sm:text-base md:text-lg font-serif italic text-white/95">
              &ldquo;{SECTION_0_DATA.scenarioQuestions.exampleQuestion}&rdquo;
            </p>
          </div>

          {/* 6-Step Structure Grid */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9D1C1] pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                The 6-Step Fixed Diagnostic Sequence:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {SECTION_0_DATA.scenarioQuestions.steps.map((s) => (
                  <button
                    key={s.stepNumber}
                    onClick={() => setActiveScenarioStep(s.stepNumber)}
                    className={`px-2.5 py-1 rounded-sm text-xs font-mono transition-all min-h-[32px] cursor-pointer ${
                      activeScenarioStep === s.stepNumber
                        ? 'bg-[#BF360C] text-white font-bold'
                        : 'bg-[#F9F7F2] text-[#5A5245] hover:text-[#1A1A1A] border border-[#D9D1C1]'
                    }`}
                  >
                    {s.stepNumber}. {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {SECTION_0_DATA.scenarioQuestions.steps.map((step) => {
                const isSelected = activeScenarioStep === step.stepNumber;
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => setActiveScenarioStep(step.stepNumber)}
                    className={`p-4 rounded-sm border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-[#F9F7F2] border-[#BF360C] border-l-4 border-l-[#BF360C] shadow-xs'
                        : 'bg-white border-[#D9D1C1] hover:bg-[#F9F7F2]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#8C7B65] uppercase tracking-widest">
                          Step {step.stepNumber}
                        </span>
                        <span className="text-xs font-serif font-bold text-[#1A1A1A]">{step.name}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-sans text-[#1A1A1A] leading-relaxed pt-1">
                        {step.action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Micro-Answer Skeleton */}
          <div className="bg-[#F9F7F2] p-4 sm:p-6 rounded-sm border border-[#D9D1C1] border-l-4 border-l-[#2E5A36] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#2E5A36] uppercase tracking-widest">
                Example Micro-Answer Skeleton (~45 Seconds)
              </span>
              <button
                onClick={() => copyToClipboard(SECTION_0_DATA.scenarioQuestions.microAnswerSkeleton)}
                className="text-[10px] font-mono text-[#5A5245] hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-sm border border-[#D9D1C1]"
              >
                {copiedQuote ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedQuote ? 'Copied' : 'Copy Skeleton'}</span>
              </button>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-[#1A1A1A] leading-relaxed bg-white p-4 rounded-sm border border-[#D9D1C1]">
              &ldquo;{SECTION_0_DATA.scenarioQuestions.microAnswerSkeleton}&rdquo;
            </p>
            <p className="text-xs font-mono text-[#2E5A36] font-medium">
              ★ {SECTION_0_DATA.scenarioQuestions.timingNotice}
            </p>
          </div>
        </section>
      )}

      {/* 0.6 How to Handle "I Don't Know" Questions */}
      {(activeModule === 'all' || activeModule === '0.6') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#8C7B65] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.unknownQuestions.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#8C7B65] uppercase tracking-widest">Senior Integrity</span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-[#5A5245] leading-relaxed">
            {SECTION_0_DATA.unknownQuestions.principle}
          </p>

          {/* 4-Step Template */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SECTION_0_DATA.unknownQuestions.template.map((t) => (
              <div key={t.stepNumber} className="bg-[#F9F7F2] p-3.5 sm:p-4 rounded-sm border border-[#D9D1C1] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#BF360C] uppercase tracking-widest block">
                  Step {t.stepNumber}. {t.name}
                </span>
                <p className="text-xs text-[#3D372F] font-sans leading-relaxed">
                  {t.guidance}
                </p>
              </div>
            ))}
          </div>

          {/* Model Response Script */}
          <div className="bg-[#F9F7F2] p-4 sm:p-6 rounded-sm border border-[#D9D1C1] border-l-4 border-l-[#2E5A36] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#2E5A36] uppercase tracking-widest">
                Example Response (e.g., Adeptia vs SnapLogic vs ADF)
              </span>
              <span className="text-[10px] font-mono text-[#2E5A36] font-bold uppercase bg-[#EFF5EE] px-2 py-0.5 rounded-sm">
                {SECTION_0_DATA.unknownQuestions.verdict}
              </span>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-[#1A1A1A] leading-relaxed bg-white p-4 rounded-sm border border-[#D9D1C1]">
              &ldquo;{SECTION_0_DATA.unknownQuestions.exampleQuote}&rdquo;
            </p>
          </div>
        </section>
      )}

      {/* 0.7 How to Explain Your Existing Snowflake Experience */}
      {(activeModule === 'all' || activeModule === '0.7') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.flagshipSnowflakeExperience.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">Flagship Storytelling</span>
          </div>

          <div className="bg-[#F9F7F2] p-3.5 sm:p-4 rounded-sm border border-[#D9D1C1] text-xs sm:text-sm font-serif italic text-[#1A1A1A]">
            Interviewers will ask: &ldquo;<strong className="text-[#BF360C]">{SECTION_0_DATA.flagshipSnowflakeExperience.interviewPrompt}</strong>&rdquo; Prepare one flagship story structured like this:
          </div>

          {/* 8-Slot Table */}
          <div className="border border-[#D9D1C1] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#E9E4D9] text-[#1A1A1A] uppercase tracking-wider font-mono text-[11px] border-b border-[#D9D1C1]">
                    <th className="p-3 w-1/4 font-bold">Slot</th>
                    <th className="p-3 w-1/3 font-bold">Fill with</th>
                    <th className="p-3 w-5/12 font-bold text-[#BF360C]">Exemplary Talking Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D1C1] bg-white">
                  {SECTION_0_DATA.flagshipSnowflakeExperience.storyStructure.map((slot, idx) => (
                    <tr key={idx} className="hover:bg-[#F9F7F2] transition-colors">
                      <td className="p-3 font-serif font-bold text-sm text-[#1A1A1A] align-top bg-[#F9F7F2]/40">
                        {slot.slot}
                      </td>
                      <td className="p-3 text-[#3D372F] align-top leading-relaxed font-sans text-xs">
                        {slot.fillWith}
                      </td>
                      <td className="p-3 text-[#1A1A1A] align-top leading-relaxed font-serif italic text-xs bg-[#F9F7F2]/20">
                        {slot.promptExample}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rules & Versions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
            {SECTION_0_DATA.flagshipSnowflakeExperience.rules.map((r, idx) => (
              <div key={idx} className="bg-[#F9F7F2] p-4 rounded-sm border border-[#D9D1C1] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#BF360C] uppercase tracking-widest block">
                  Rule 0{idx + 1}
                </span>
                <h4 className="text-xs font-serif font-bold text-[#1A1A1A]">{r.rule}</h4>
                <p className="text-xs text-[#5A5245] font-serif italic leading-relaxed pt-1">
                  {r.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#E9E4D9] p-3 rounded-sm border border-[#D9D1C1] text-xs font-mono text-[#1A1A1A] flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#BF360C] shrink-0" />
            <span>{SECTION_0_DATA.flagshipSnowflakeExperience.versions}</span>
          </div>
        </section>
      )}

      {/* 0.8 What "Senior-Level" Actually Sounds Like */}
      {(activeModule === 'all' || activeModule === '0.8') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.seniorLevelDistinction.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">3-Tier Calibration</span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-[#5A5245] leading-relaxed">
            {SECTION_0_DATA.seniorLevelDistinction.description}
          </p>

          {/* 3 Tiers Table */}
          <div className="border border-[#D9D1C1] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-[#E9E4D9] text-[#1A1A1A] uppercase tracking-wider font-mono text-[11px] border-b border-[#D9D1C1]">
                    <th className="p-3 w-1/6 font-bold">Tier</th>
                    <th className="p-3 w-4/6 font-bold">Sounds like</th>
                    <th className="p-3 w-1/6 font-bold text-right font-mono">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D1C1] bg-white">
                  {SECTION_0_DATA.seniorLevelDistinction.tiers.map((t, idx) => (
                    <tr 
                      key={idx} 
                      className={`transition-colors ${
                        t.isTarget ? 'bg-[#EFF5EE]/40 hover:bg-[#EFF5EE]/70' : 'hover:bg-[#F9F7F2]'
                      }`}
                    >
                      <td className="p-3 font-serif font-bold text-sm text-[#1A1A1A] align-top">
                        <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-mono font-bold ${
                          t.tier === 'Senior' ? 'bg-[#2E5A36] text-white' : t.tier === 'Strong' ? 'bg-[#E9E4D9] text-[#1A1A1A]' : 'bg-[#F9F7F2] text-[#8C7B65] border border-[#D9D1C1]'
                        }`}>
                          {t.tier}
                        </span>
                      </td>
                      <td className="p-3 text-[#1A1A1A] align-top leading-relaxed font-serif text-xs sm:text-sm">
                        {t.soundsLike}
                      </td>
                      <td className="p-3 font-mono font-bold align-top text-right text-xs">
                        <span className={`px-2 py-1 rounded-sm ${
                          t.tier === 'Senior' ? 'bg-[#2E5A36] text-white' : t.tier === 'Strong' ? 'bg-[#E9E4D9] text-[#5A5245]' : 'bg-[#FAECE8] text-[#BF360C]'
                        }`}>
                          {t.verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#1A1A1A] text-white p-3.5 rounded-sm border border-stone-800 text-xs font-mono font-bold flex items-center justify-between">
            <span className="text-stone-300">★ CORE CURRICULUM MANDATE:</span>
            <span className="text-[#BF360C] uppercase tracking-wider">{SECTION_0_DATA.seniorLevelDistinction.rule}</span>
          </div>
        </section>
      )}

      {/* 0.9 Red Flags to Eliminate From Your Answers */}
      {(activeModule === 'all' || activeModule === '0.9') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.redFlags.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BF360C] font-bold">Unforced Errors</span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-[#5A5245] leading-relaxed">
            {SECTION_0_DATA.redFlags.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {SECTION_0_DATA.redFlags.flags.map((flag, idx) => (
              <div 
                key={idx} 
                className="bg-[#FAECE8] border border-[#E8B4A6] p-4 rounded-sm space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[#BF360C] font-mono font-bold text-xs">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{flag.phrase}</span>
                  </div>
                  <p className="text-xs font-serif text-[#7A2110] leading-relaxed pt-2">
                    {flag.signal}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F9F7F2] p-3.5 rounded-sm border border-[#D9D1C1] text-xs font-mono font-bold text-[#1A1A1A] text-center">
            {SECTION_0_DATA.redFlags.remedy}
          </div>
        </section>
      )}

      {/* 0.10 How to Use This Guide Over the Next 7 Days */}
      {(activeModule === 'all' || activeModule === '0.10') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.sevenDayPlan.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">7-Day Sprint</span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-[#5A5245] leading-relaxed">
            {SECTION_0_DATA.sevenDayPlan.intro}
          </p>

          <div className="space-y-2.5">
            {SECTION_0_DATA.sevenDayPlan.days.map((d, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-sm border transition-all gap-2 ${
                  d.isHighLeverage 
                    ? 'bg-[#F9F7F2] border-[#BF360C] border-l-4 border-l-[#BF360C]' 
                    : 'bg-white border-[#D9D1C1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-16 sm:w-20 shrink-0 font-mono text-xs font-bold text-[#1A1A1A] bg-[#E9E4D9] px-2 py-1 rounded-sm text-center">
                    {d.day}
                  </span>
                  <span className="text-xs sm:text-sm font-serif font-bold text-[#1A1A1A]">
                    {d.focus}
                  </span>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-[#5A5245] font-serif italic">
                    {d.note}
                  </span>
                  {d.isHighLeverage && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#BF360C] bg-[#FAECE8] px-2 py-0.5 rounded-sm border border-[#E8B4A6]">
                      High ROI
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1A1A1A] text-white p-4 sm:p-5 rounded-sm space-y-2 border border-stone-800">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#BF360C]">
              <Flame className="w-4 h-4" /> Highest-ROI Focus Areas
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-stone-200 leading-relaxed">
              {SECTION_0_DATA.sevenDayPlan.highestRoiNote}
            </p>
          </div>
        </section>
      )}

      {/* 0.11 Ground Rules for the Rest of This Guide */}
      {(activeModule === 'all' || activeModule === '0.11') && (
        <section className="bg-white border border-[#D9D1C1] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.groundRules.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7B65]">Editorial Standards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SECTION_0_DATA.groundRules.rules.map((rule, idx) => (
              <div key={idx} className="bg-[#F9F7F2] p-3.5 sm:p-4 rounded-sm border border-[#D9D1C1] flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-sm bg-[#1A1A1A] text-white font-mono text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-serif font-medium text-[#1A1A1A] leading-relaxed">
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 0.12 Quick Revision — Section 0 */}
      {(activeModule === 'all' || activeModule === '0.12') && (
        <section className="bg-white border-2 border-[#1A1A1A] rounded-sm p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D9D1C1] pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {SECTION_0_DATA.quickRevision.title}
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BF360C] font-bold">Pocket Review</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SECTION_0_DATA.quickRevision.points.map((pt, idx) => (
              <div key={idx} className="bg-[#F9F7F2] p-3.5 rounded-sm border border-[#D9D1C1] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#BF360C] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-serif text-[#1A1A1A] leading-relaxed">
                  {pt}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inter-Section Navigation Transition Bridge */}
      {onNavigateToSection1 && (
        <div className="bg-white border border-[#D9D1C1] p-4 sm:p-6 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#BF360C] mb-1">
              <span>Section 00 Complete</span>
              <span>•</span>
              <span>Next Curriculum Section</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1A1A1A]">
              Section 01: Snowflake Architecture &amp; Performance Engineering
            </h3>
            <p className="text-xs text-[#5A5245] font-serif italic mt-1 max-w-2xl">
              Anchor your 4+ years of Snowflake experience: 3 Decoupled Layers, Micro-Partitions, Query Profile Spilling Lab, and Senior Q&amp;As.
            </p>
          </div>

          <button
            onClick={onNavigateToSection1}
            className="w-full sm:w-auto px-6 py-3 rounded-sm bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm min-h-[44px]"
          >
            <span>Enter Section 01: Snowflake</span>
            <ArrowRight className="w-4 h-4 text-[#BF360C]" />
          </button>
        </div>
      )}
    </div>
  );
};
