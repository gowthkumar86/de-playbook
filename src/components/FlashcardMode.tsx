import React, { useState, useEffect } from 'react';
import { InterviewQuestion } from '../types';
import { MarkdownContent } from './MarkdownContent';
import { Award, ChevronLeft, ChevronRight, RotateCcw, Shuffle, Sparkles } from 'lucide-react';

interface FlashcardModeProps {
  questions: InterviewQuestion[];
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({ questions }) => {
  const [deck, setDeck] = useState<InterviewQuestion[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeTier, setActiveTier] = useState<'senior' | 'strong' | 'basic'>('senior');

  useEffect(() => {
    setDeck(questions);
    setCurrentIndex(0);
    setIsRevealed(false);
  }, [questions]);

  const currentQ = deck[currentIndex];

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsRevealed(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsRevealed(false);
  };

  const handleReset = () => {
    setDeck(questions);
    setCurrentIndex(0);
    setIsRevealed(false);
  };

  if (!currentQ) return null;

  return (
    <div className="my-8 max-w-3xl mx-auto">
      {/* Deck controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-md bg-[#BF360C]/10 text-[#BF360C] font-mono-code text-xs font-bold">
            Card {currentIndex + 1} of {deck.length}
          </span>
          <span className="text-xs text-[#5A5245]">
            Topic: {currentQ.topic}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShuffle}
            className="flex items-center space-x-1 px-2.5 py-1 rounded border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#E9E4D9] text-xs text-[#5A5245] transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 px-2.5 py-1 rounded border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#E9E4D9] text-xs text-[#5A5245] transition-colors"
            title="Reset to original order"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard */}
      <div className="min-h-[380px] rounded-2xl border-2 border-[#D9D1C1] bg-[#FFFFFF] shadow-md p-6 md:p-8 flex flex-col justify-between transition-all">
        {/* Card Top */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E4D9]">
            <span className="text-xs font-mono-code font-bold uppercase text-[#BF360C] tracking-wider">
              {currentQ.topic} • {currentQ.subtopic || 'Concept Drill'}
            </span>
            <span className="text-xs text-[#8C7B65] font-mono-code">
              Q{currentQ.number}
            </span>
          </div>

          {/* Question Text */}
          <div className="my-6">
            <h2 className="text-xl md:text-2xl font-serif-heading font-bold text-[#1A1A1A] leading-snug">
              {currentQ.question}
            </h2>
            {!isRevealed && (
              <p className="text-sm text-[#8C7B65] mt-4 italic">
                👉 Speak your answer out loud as if in a live senior interview. Then click Reveal.
              </p>
            )}
          </div>
        </div>

        {/* Revealed Answer Area */}
        {isRevealed ? (
          <div className="my-4 pt-4 border-t border-[#E9E4D9]">
            <div className="flex items-center space-x-2 mb-3">
              <button
                onClick={() => setActiveTier('senior')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activeTier === 'senior'
                    ? 'bg-[#BF360C] text-white shadow-xs'
                    : 'bg-[#F9F7F2] text-[#5A5245]'
                }`}
              >
                Senior Tier (5–10 YOE) ✅
              </button>
              <button
                onClick={() => setActiveTier('strong')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activeTier === 'strong'
                    ? 'bg-[#1F4B7A] text-white shadow-xs'
                    : 'bg-[#F9F7F2] text-[#5A5245]'
                }`}
              >
                Strong (Mid)
              </button>
              <button
                onClick={() => setActiveTier('basic')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activeTier === 'basic'
                    ? 'bg-gray-600 text-white shadow-xs'
                    : 'bg-[#F9F7F2] text-[#5A5245]'
                }`}
              >
                Basic (Junior)
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDFB] border border-[#BF360C]/30 text-[#1A1A1A] text-sm md:text-base leading-relaxed italic">
              <MarkdownContent content={currentQ.answers[activeTier]} compact />
            </div>

            {currentQ.answers.seniorKeyTakeaways && (
              <div className="mt-3 text-xs text-[#5A5245]">
                <span className="font-bold text-[#1F4B7A]">Senior Focus: </span>
                {currentQ.answers.seniorKeyTakeaways.join(' • ')}
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 flex justify-center">
            <button
              onClick={() => setIsRevealed(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-[#BF360C] hover:bg-[#8C2A2A] text-white font-semibold text-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Reveal Senior Model Answer</span>
            </button>
          </div>
        )}

        {/* Card Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E9E4D9]">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-[#D9D1C1] bg-[#F9F7F2] hover:bg-[#E9E4D9] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-[#1A1A1A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Card</span>
          </button>

          {isRevealed && (
            <button
              onClick={() => setIsRevealed(false)}
              className="text-xs text-[#8C7B65] hover:text-[#1A1A1A] transition-colors font-medium"
            >
              Hide Answer
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentIndex === deck.length - 1}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-white transition-colors"
          >
            <span>Next Card</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
