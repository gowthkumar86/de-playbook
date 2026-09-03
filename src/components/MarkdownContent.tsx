import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
  className?: string;
  compact?: boolean;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`editorial-markdown text-[#2C2520] leading-relaxed ${
        compact ? 'text-inherit space-y-2' : 'text-[15px] space-y-4'
      } ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={`${compact ? 'text-xl mt-3 mb-1.5' : 'text-2xl md:text-3xl mt-6 mb-3'} font-serif-heading font-extrabold text-[#1A1A1A]`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`${compact ? 'text-lg mt-2.5 mb-1' : 'text-xl md:text-2xl mt-5 mb-2.5'} font-serif-heading font-bold text-[#1A1A1A]`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`${compact ? 'text-base mt-2 mb-1' : 'text-lg md:text-xl mt-4 mb-2'} font-serif-heading font-semibold text-[#1A1A1A]`}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className={`${compact ? 'text-sm mt-1.5 mb-0.5' : 'text-base mt-3 mb-1.5'} font-serif-heading font-semibold text-[#1A1A1A]`}>
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className={`${compact ? 'my-1' : 'my-2.5'} leading-relaxed text-inherit`}>
              {children}
            </p>
          ),
          strong: ({ children }) => {
            const text = typeof children === 'string' ? children : '';
            const lower = text.toLowerCase();

            if (lower.includes('senior line')) {
              return (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#BF360C]/10 text-[#BF360C] font-mono-code text-xs font-bold mr-1.5 uppercase">
                  {children}
                </span>
              );
            }
            if (lower.includes('interview line')) {
              return (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#1F4B7A]/10 text-[#1F4B7A] font-mono-code text-xs font-bold mr-1.5 uppercase">
                  {children}
                </span>
              );
            }
            if (lower.includes('gotcha')) {
              return (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#A65D00]/10 text-[#A65D00] font-mono-code text-xs font-bold mr-1.5 uppercase">
                  {children}
                </span>
              );
            }
            return <strong className="font-bold text-[#1A1A1A]">{children}</strong>;
          },
          em: ({ children }) => (
            <em className="italic text-inherit">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className={`list-disc list-outside ml-6 ${compact ? 'my-1.5 space-y-1' : 'my-3 space-y-2'} text-inherit`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal list-outside ml-6 ${compact ? 'my-1.5 space-y-1' : 'my-3 space-y-2'} text-inherit`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed text-inherit">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 border-[#BF360C] pl-4 ${compact ? 'py-1.5 my-2' : 'py-2.5 my-4'} bg-[#FBF9F5] rounded-r-lg text-[#332C23] italic shadow-2xs font-serif-heading text-[15px] leading-relaxed`}>
              {children}
            </blockquote>
          ),
          pre: ({ children }) => {
            return (
              <CodeContainer compact={compact}>
                {children}
              </CodeContainer>
            );
          },
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code
                  className="font-mono-code text-[12px] bg-[#E9E4D9]/80 text-[#8C2A2A] px-1.5 py-0.5 rounded border border-[#D9D1C1]/60 font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={`font-mono-code text-[#E6E6E6] text-[13px] ${className || ''}`} {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-[#D9D1C1] bg-[#FFFFFF] shadow-2xs">
              <table className="min-w-full divide-y divide-[#D9D1C1] text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#F4EFE6] font-mono-code font-bold text-[#1A1A1A] tracking-wider uppercase text-[11px]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#E9E4D9] text-[#2C2520]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[#F9F7F2] transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-[#1A1A1A]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 leading-relaxed text-[#2C2520]">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-6 border-t border-[#D9D1C1]" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

interface CodeContainerProps {
  children: React.ReactNode;
  compact?: boolean;
}

const CodeContainer: React.FC<CodeContainerProps> = ({ children, compact = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeElement = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === 'code'
    ) as React.ReactElement<{ children: React.ReactNode }> | undefined;

    let textToCopy = '';
    if (codeElement && typeof codeElement.props.children === 'string') {
      textToCopy = codeElement.props.children;
    } else {
      textToCopy = String(children);
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`${compact ? 'my-2.5' : 'my-5'} rounded-lg border border-[#D9D1C1] bg-[#1E1E1E] text-[#E0E0E0] shadow-xs overflow-hidden`}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#333333] bg-[#252525] text-xs">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3 h-3 text-[#BF360C]" />
          <span className="font-mono-code font-semibold tracking-wide text-[#CCCCCC] text-[10px]">
            CODE / SPECIFICATION
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#333333] hover:bg-[#444444] text-[#E0E0E0] transition-colors cursor-pointer text-[10.5px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-[#AAAAAA]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3 font-mono-code text-[12.5px] leading-relaxed">
        <pre className="m-0 text-[#E6E6E6] bg-transparent border-0 p-0">
          {children}
        </pre>
      </div>
    </div>
  );
};
