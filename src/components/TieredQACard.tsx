import React, { useState } from 'react';
import { InterviewQuestion } from '../types';
import { MarkdownContent } from './MarkdownContent';
import { Award, CheckCircle2, ChevronDown, ChevronUp, HelpCircle, Layers, Lightbulb } from 'lucide-react';

interface TieredQACardProps {
  question: InterviewQuestion;
  score?: 'nailed' | 'close' | 'missed';
  onScore?: (rating: 'nailed' | 'close' | 'missed') => void;
}

export const TieredQACard: React.FC<TieredQACardProps> = ({
  question,
  score,
  onScore,
}) => {
  const [activeTier, setActiveTier] = useState<'senior' | 'strong' | 'basic'>('senior');
  const [showAllThree, setShowAllThree] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  return (
    <div
      id={question.id}
      className={`my-6 rounded-xl border transition-all ${
        score === 'nailed'
          ? 'border-emerald-300 bg-[#FAFCF9]'
          : score === 'close'
          ? 'border-amber-300 bg-[#FFFDF9]'
          : score === 'missed'
          ? 'border-rose-300 bg-[#FDFBFB]'
          : 'border-[#D9D1C1] bg-[#FFFFFF]'
      } shadow-sm p-5 md:p-6`}
    >
      {/* Question Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E9E4D9]">
        <div className="flex items-start space-x-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#BF360C] text-white font-mono-code font-bold text-xs shrink-0 mt-0.5">
            Q{question.number}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono-code font-bold bg-[#E9E4D9] text-[#5A5245]">
                {question.topic}
              </span>
              {question.subtopic && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code text-[#8C7B65] border border-[#E9E4D9]">
                  {question.subtopic}
                </span>
              )}
              {score && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    score === 'nailed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : score === 'close'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Rating: {score}
                </span>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-serif-heading font-bold text-[#1A1A1A] leading-snug">
              {question.question}
            </h3>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
          <button
            onClick={() => setShowAllThree(!showAllThree)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors border ${
              showAllThree
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-[#F9F7F2] text-[#5A5245] border-[#D9D1C1] hover:bg-[#E9E4D9]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare All 3 Tiers</span>
          </button>
        </div>
      </div>

      {/* Tier Switcher (when not showing all three) */}
      {!showAllThree && (
        <div className="flex items-center space-x-2 my-4 p-1 bg-[#F9F7F2] rounded-lg border border-[#E9E4D9] text-xs font-semibold">
          <button
            onClick={() => setActiveTier('senior')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all flex items-center justify-center space-x-1.5 ${
              activeTier === 'senior'
                ? 'bg-[#BF360C] text-white shadow-xs font-bold'
                : 'text-[#5A5245] hover:text-[#1A1A1A]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Senior Tier (5–10 YOE) ✅</span>
          </button>
          <button
            onClick={() => setActiveTier('strong')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all flex items-center justify-center space-x-1.5 ${
              activeTier === 'strong'
                ? 'bg-[#1F4B7A] text-white shadow-xs font-bold'
                : 'text-[#5A5245] hover:text-[#1A1A1A]'
            }`}
          >
            <span>Strong Tier (Mid) ⚠️</span>
          </button>
          <button
            onClick={() => setActiveTier('basic')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all flex items-center justify-center space-x-1.5 ${
              activeTier === 'basic'
                ? 'bg-[#5A5245] text-white shadow-xs font-bold'
                : 'text-[#5A5245] hover:text-[#1A1A1A]'
            }`}
          >
            <span>Basic Tier (Junior) ❌</span>
          </button>
        </div>
      )}

      {/* Answer Presentation */}
      <div className="my-4">
        {showAllThree ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic */}
            <div className="p-4 rounded-lg border border-[#E9E4D9] bg-[#FDFDFD]">
              <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-[#E9E4D9]">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Basic Tier (Junior)
                </span>
              </div>
              <div className="text-xs leading-relaxed text-[#4A4A4A] italic">
                <MarkdownContent content={question.answers.basic} compact />
              </div>
              <div className="mt-3 text-[11px] text-gray-500">
                ⚠️ Recites textbook definition without internal depth or trade-offs.
              </div>
            </div>

            {/* Strong */}
            <div className="p-4 rounded-lg border border-blue-200 bg-[#F9FBFE]">
              <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-blue-100">
                <span className="w-2 h-2 rounded-full bg-[#1F4B7A]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F4B7A]">
                  Strong Tier (Mid-Level)
                </span>
              </div>
              <div className="text-xs leading-relaxed text-[#1A2838] italic">
                <MarkdownContent content={question.answers.strong} compact />
              </div>
              <div className="mt-3 text-[11px] text-[#2A4868]">
                ✓ Understands mechanical operation and typical usage patterns.
              </div>
            </div>

            {/* Senior */}
            <div className="p-4 rounded-lg border border-[#BF360C]/40 bg-[#FFFDFB] shadow-xs">
              <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-[#BF360C]/20">
                <Award className="w-3.5 h-3.5 text-[#BF360C]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#BF360C]">
                  Senior Tier (5–10 YOE) ✅
                </span>
              </div>
              <div className="text-xs leading-relaxed text-[#1A1A1A] font-medium italic">
                <MarkdownContent content={question.answers.senior} compact />
              </div>
              <div className="mt-3 text-[11px] text-[#BF360C] font-semibold">
                ★ Explains engine storage internals, failure modes, and defensible trade-offs.
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`p-5 rounded-lg border leading-relaxed text-[15px] ${
              activeTier === 'senior'
                ? 'border-l-4 border-l-[#BF360C] border-[#D9D1C1] bg-[#FFFDFB] text-[#1A1A1A]'
                : activeTier === 'strong'
                ? 'border-l-4 border-l-[#1F4B7A] border-[#D9D1C1] bg-[#F9FBFE] text-[#1A2838]'
                : 'border-l-4 border-l-gray-400 border-[#D9D1C1] bg-[#FAFAFA] text-[#444444]'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-2 text-[#5A5245]">
              {activeTier === 'senior'
                ? 'Senior Interview Response (Gold Standard)'
                : activeTier === 'strong'
                ? 'Mid-Level Response'
                : 'Junior Response (Anti-Pattern)'}
            </div>
            <div className="italic leading-relaxed">
              <MarkdownContent content={question.answers[activeTier]} compact />
            </div>
          </div>
        )}
      </div>

      {/* Expandable Interview Insights */}
      <div className="mt-4 pt-3 border-t border-[#E9E4D9]">
        <button
          onClick={() => setExpandedDetails(!expandedDetails)}
          className="flex items-center space-x-2 text-xs font-semibold text-[#BF360C] hover:text-[#8C2A2A] transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>
            {expandedDetails ? 'Hide' : 'Show'} Interviewer Intent, Follow-ups & Key Takeaways
          </span>
          {expandedDetails ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {expandedDetails && (
          <div className="mt-3 space-y-3 p-4 rounded-lg bg-[#F9F7F2] text-xs text-[#2C2520] border border-[#E9E4D9]">
            {question.answers.interviewerIntent && (
              <div>
                <span className="font-bold text-[#BF360C] uppercase tracking-wider block mb-1">
                  What the Interviewer is Really Testing:
                </span>
                <p className="text-[#443E37]">{question.answers.interviewerIntent}</p>
              </div>
            )}

            {question.answers.seniorKeyTakeaways && question.answers.seniorKeyTakeaways.length > 0 && (
              <div>
                <span className="font-bold text-[#1F4B7A] uppercase tracking-wider block mb-1">
                  Senior Takeaways You Must Hit:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[#443E37]">
                  {question.answers.seniorKeyTakeaways.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {question.answers.followUps && question.answers.followUps.length > 0 && (
              <div>
                <span className="font-bold text-[#A65D00] uppercase tracking-wider block mb-1">
                  Expected Pushback & Follow-Up Questions:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[#443E37]">
                  {question.answers.followUps.map((fu, idx) => (
                    <li key={idx} className="italic">"{fu}"</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Self-Rating Controls */}
      {onScore && (
        <div className="mt-4 pt-3 border-t border-[#E9E4D9] flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-[#5A5245] font-medium">
            Self-Assessment (Practice aloud first):
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onScore('nailed')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center space-x-1 ${
                score === 'nailed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Nailed It</span>
            </button>
            <button
              onClick={() => onScore('close')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center space-x-1 ${
                score === 'close'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <span>Close / Partial</span>
            </button>
            <button
              onClick={() => onScore('missed')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center space-x-1 ${
                score === 'missed'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
              }`}
            >
              <span>Missed / Revisit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
