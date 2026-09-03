import React from 'react';
import { Database, Upload, ArrowLeft, ArrowRight, CheckCircle2, FileText, Sparkles, BookOpen } from 'lucide-react';

export type Section1ModuleId = string;

interface Section1ViewProps {
  activeModule?: Section1ModuleId;
  onModuleChange?: (module: Section1ModuleId) => void;
  onNavigateToSection0?: () => void;
  onNavigateToSection2?: () => void;
}

export const Section1View: React.FC<Section1ViewProps> = ({
  onNavigateToSection0,
  onNavigateToSection2,
}) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Return to Section 0 Navigation */}
      {onNavigateToSection0 && (
        <button
          onClick={onNavigateToSection0}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#5A5245] hover:text-[#1A1A1A] transition-colors border border-[#D9D1C1] bg-white px-3 py-1.5 rounded-sm shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Section 00: Strategy &amp; Mindset</span>
        </button>
      )}

      {/* Main Status Banner */}
      <div className="bg-white border border-[#D9D1C1] rounded-sm p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#D9D1C1] text-[#BF360C] flex items-center justify-center mx-auto">
          <Database className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FAF9F5] text-[#BF360C] border border-[#D9D1C1]">
            <Upload className="w-3.5 h-3.5" />
            <span>Section 01 Data Cleared</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Section 01: Snowflake Architecture &amp; Performance
          </h1>
          <p className="text-sm font-sans text-[#5A5245] max-w-xl mx-auto leading-relaxed">
            All previous Section 1 curriculum data, deep dives, crosswalks, and interview Q&amp;As have been completely cleared per your request. The canvas is clean and ready for your fresh data upload.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-[#FAF9F5] border border-[#D9D1C1] max-w-lg mx-auto text-left space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C7B65] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#BF360C]" />
            <span>Ready for Ingestion Protocol:</span>
          </div>
          <ul className="text-xs text-[#1A1A1A] space-y-2 font-sans">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Paste your markdown, text notes, or curriculum outline in the chat.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Provide your desired section sequence, sub-topics, code examples, or interview questions.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Your material will be formatted verbatim into the application data schemas without synthetic generation.</span>
            </li>
          </ul>
        </div>

        {onNavigateToSection0 && (
          <div className="pt-2">
            <button
              onClick={onNavigateToSection0}
              className="px-6 py-2.5 rounded-sm bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Section 00 Study Guide in the Meantime</span>
            </button>
          </div>
        )}
      </div>

      {/* Inter-Section Navigation Transition Bridge */}
      <div className="bg-white border border-[#D9D1C1] p-4 sm:p-6 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {onNavigateToSection0 ? (
          <button
            onClick={onNavigateToSection0}
            className="w-full sm:w-auto px-4 py-2.5 rounded-sm bg-white hover:bg-[#FAF9F5] border border-[#D9D1C1] text-xs font-mono font-bold text-[#1A1A1A] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev: Section 00 (Strategy)</span>
          </button>
        ) : <div />}

        {onNavigateToSection2 && (
          <button
            onClick={onNavigateToSection2}
            className="w-full sm:w-auto px-4 py-2.5 rounded-sm bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <span>Next: Section 02 (Advanced SQL)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#BF360C]" />
          </button>
        )}
      </div>
    </div>
  );
};
