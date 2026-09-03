import React, { useState, useMemo } from 'react';
import { TermItem } from '../types';
import { Search, Sparkles } from 'lucide-react';

interface TerminologyGridProps {
  terms: TermItem[];
  title?: string;
}

export const TerminologyGrid: React.FC<TerminologyGridProps> = ({
  terms,
  title = '0. Terminology Primer — Core Concepts',
}) => {
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    terms.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['all', ...Array.from(set)];
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(filter.toLowerCase()) ||
        item.definition.toLowerCase().includes(filter.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [terms, filter, selectedCategory]);

  return (
    <div className="my-8 rounded-xl border border-[#D9D1C1] bg-[#FFFFFF] p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E9E4D9]">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-serif-heading font-bold text-[#1A1A1A]">
              {title}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#E9E4D9] text-[#5A5245] text-xs font-mono-code font-semibold">
              {terms.length} Terms
            </span>
          </div>
          <p className="text-xs text-[#5A5245] mt-1">
            Interview-tight definitions. Know these cold before going into depth.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B65]" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search terms..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-[#D9D1C1] bg-[#F9F7F2] text-xs text-[#1A1A1A] placeholder-[#8C7B65] focus:outline-none focus:border-[#BF360C]"
            />
          </div>

          {categories.length > 2 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-[#D9D1C1] bg-[#F9F7F2] text-xs text-[#5A5245] focus:outline-none focus:border-[#BF360C]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Terms grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {filteredTerms.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border transition-all ${
              item.highlight
                ? 'border-[#BF360C]/30 bg-[#FFFDFB] shadow-sm'
                : 'border-[#E9E4D9] bg-[#FAFAF8] hover:border-[#D9D1C1]'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center space-x-1.5">
                {item.highlight && (
                  <Sparkles className="w-3.5 h-3.5 text-[#BF360C] shrink-0" />
                )}
                <h3 className="font-semibold text-[15px] text-[#1A1A1A]">
                  {item.term}
                </h3>
              </div>
              {item.category && (
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono-code font-semibold tracking-wider bg-[#E9E4D9] text-[#5A5245]">
                  {item.category}
                </span>
              )}
            </div>
            <p className="text-[13.5px] leading-relaxed text-[#443E37]">
              {item.definition}
            </p>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-8 text-sm text-[#8C7B65]">
          No terms matching "{filter}".
        </div>
      )}
    </div>
  );
};
