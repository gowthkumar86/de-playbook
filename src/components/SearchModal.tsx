import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { searchStudyGuide } from '../utils/searchEngine';
import { SearchMatch } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (match: SearchMatch) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchMatch[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const res = searchStudyGuide(query);
    setResults(res);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#FFFFFF] rounded-2xl border border-[#D9D1C1] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#E9E4D9] bg-[#F9F7F2]">
          <Search className="w-5 h-5 text-[#BF360C] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 31 sections, terms, and senior Q&As..."
            className="w-full bg-transparent text-sm md:text-base text-[#1A1A1A] placeholder-[#8C7B65] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#E9E4D9] rounded-md text-[#8C7B65]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 rounded bg-[#E9E4D9] text-[#5A5245] text-xs font-mono-code hover:bg-[#D9D1C1]"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#F0ECE1]">
          {query.trim().length < 2 && (
            <div className="py-12 text-center text-xs text-[#8C7B65]">
              <p className="font-semibold text-sm text-[#5A5245] mb-1">
                Type at least 2 characters to search
              </p>
              <p>Search topics: "micro-partitions", "remote spill", "dynamic tables", "cortex", "Q12"</p>
            </div>
          )}

          {query.trim().length >= 2 && results.length === 0 && (
            <div className="py-12 text-center text-xs text-[#8C7B65]">
              No matches found for "{query}". Try checking terminology or broader topics.
            </div>
          )}

          {results.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectResult(item);
                onClose();
              }}
              className="w-full text-left py-3 px-3 hover:bg-[#F9F7F2] rounded-lg transition-colors flex items-start space-x-3 cursor-pointer group"
            >
              <div className="mt-0.5 shrink-0">
                {item.type === 'term' ? (
                  <Sparkles className="w-4 h-4 text-[#BF360C]" />
                ) : item.type === 'question' ? (
                  <HelpCircle className="w-4 h-4 text-[#1F4B7A]" />
                ) : (
                  <BookOpen className="w-4 h-4 text-[#2A6E3F]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 text-[11px] font-mono-code text-[#8C7B65] mb-0.5">
                  <span>{item.sectionTitle}</span>
                  {item.partTitle && <span>• {item.partTitle}</span>}
                  <span className="px-1.5 py-0.2 rounded bg-[#E9E4D9] text-[#5A5245] uppercase text-[9px] font-bold">
                    {item.type}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#BF360C] transition-colors truncate">
                  {item.title}
                </div>
                <p className="text-xs text-[#5A5245] line-clamp-2 mt-0.5">
                  {item.snippet}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8C7B65] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-center" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#F4EFE6] border-t border-[#E9E4D9] text-[11px] text-[#8C7B65] flex items-center justify-between">
          <span>Tip: Press <kbd className="px-1 py-0.5 bg-white rounded border border-[#D9D1C1] font-mono-code">/</kbd> anywhere to open search</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
