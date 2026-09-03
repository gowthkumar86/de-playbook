import React, { useState } from 'react';
import { InterviewQuestion } from '../types';
import { TieredQACard } from './TieredQACard';
import { CheckCircle, Filter, RotateCcw } from 'lucide-react';

interface QuizModeProps {
  questions: InterviewQuestion[];
  scores: Record<string, 'nailed' | 'close' | 'missed'>;
  onRecordScore: (questionId: string, rating: 'nailed' | 'close' | 'missed') => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  questions,
  scores,
  onRecordScore,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'missed' | 'unrated'>('all');

  const nailedCount = Object.values(scores).filter((s) => s === 'nailed').length;
  const closeCount = Object.values(scores).filter((s) => s === 'close').length;
  const missedCount = Object.values(scores).filter((s) => s === 'missed').length;
  const totalCount = questions.length;
  const scoredCount = Object.keys(scores).length;

  const filteredQuestions = questions.filter((q) => {
    const s = scores[q.id];
    if (filterMode === 'missed') return s === 'missed';
    if (filterMode === 'unrated') return !s;
    return true;
  });

  return (
    <div className="my-8 max-w-4xl mx-auto">
      {/* Score Dashboard Card */}
      <div className="rounded-xl border border-[#D9D1C1] bg-[#FFFFFF] p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E9E4D9]">
          <div>
            <h2 className="text-xl font-serif-heading font-bold text-[#1A1A1A]">
              Self-Assessment Readiness Tracker
            </h2>
            <p className="text-xs text-[#5A5245] mt-0.5">
              Practice answering aloud first. Gauge yourself against the Senior standard.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono-code font-bold text-[#5A5245]">
              {scoredCount} / {totalCount} Assessed
            </span>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-2xl font-bold font-mono-code text-emerald-800">
              {nailedCount}
            </div>
            <div className="text-xs font-semibold text-emerald-900 mt-1 uppercase tracking-wide">
              Nailed It
            </div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <div className="text-2xl font-bold font-mono-code text-amber-800">
              {closeCount}
            </div>
            <div className="text-xs font-semibold text-amber-900 mt-1 uppercase tracking-wide">
              Close / Partial
            </div>
          </div>
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-center">
            <div className="text-2xl font-bold font-mono-code text-rose-800">
              {missedCount}
            </div>
            <div className="text-xs font-semibold text-rose-900 mt-1 uppercase tracking-wide">
              Missed / Revisit
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-[#8C7B65]" />
            <span className="text-[#5A5245] font-semibold">Filter:</span>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#1A1A1A] text-white font-bold'
                  : 'bg-[#F9F7F2] text-[#5A5245] hover:bg-[#E9E4D9]'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilterMode('missed')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'missed'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              Only Missed ({missedCount})
            </button>
            <button
              onClick={() => setFilterMode('unrated')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'unrated'
                  ? 'bg-[#BF360C] text-white font-bold'
                  : 'bg-[#F9F7F2] text-[#5A5245] hover:bg-[#E9E4D9]'
              }`}
            >
              Unrated ({totalCount - scoredCount})
            </button>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {filteredQuestions.map((q) => (
          <TieredQACard
            key={q.id}
            question={q}
            score={scores[q.id]}
            onScore={(rating) => onRecordScore(q.id, rating)}
          />
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 bg-[#FFFFFF] rounded-xl border border-[#D9D1C1] text-sm text-[#8C7B65]">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
            <p className="font-semibold text-[#1A1A1A]">No questions in this filter view!</p>
            <p className="text-xs mt-1">Change filter or reset your reviews.</p>
          </div>
        )}
      </div>
    </div>
  );
};
