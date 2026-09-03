import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  notes?: string[];
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'sql',
  title,
  notes,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="my-5 rounded-lg border border-[#D9D1C1] bg-[#1E1E1E] text-[#E0E0E0] shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333333] bg-[#252525] text-xs">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-[#BF360C]" />
          <span className="font-mono-code font-semibold tracking-wide text-[#CCCCCC]">
            {title || `${language.toUpperCase()} SNIPPET`}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#333333] text-[10px] uppercase font-mono-code text-[#AAAAAA]">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#333333] hover:bg-[#444444] text-[#E0E0E0] transition-colors cursor-pointer text-[11px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#AAAAAA]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto p-4 font-mono-code text-[13px] leading-relaxed select-text">
        <pre className="m-0 text-[#E6E6E6]">
          <code>{code}</code>
        </pre>
      </div>

      {/* Optional notes */}
      {notes && notes.length > 0 && (
        <div className="px-4 py-2 bg-[#282828] border-t border-[#333333] text-[11px] text-[#BBBBBB]">
          <span className="font-semibold text-[#BF360C]">Note: </span>
          {notes.join(' • ')}
        </div>
      )}
    </div>
  );
};
