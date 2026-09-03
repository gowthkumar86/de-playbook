import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  chart: string;
  title?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [showRaw, setShowRaw] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        themeVariables: {
          primaryColor: '#F9F7F2',
          primaryTextColor: '#1A1A1A',
          primaryBorderColor: '#BF360C',
          lineColor: '#5A5245',
          secondaryColor: '#E9E4D9',
          tertiaryColor: '#FFFFFF',
        },
      });

      const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

      mermaid
        .render(uniqueId, chart)
        .then(({ svg }) => {
          if (isMounted) {
            setSvgContent(svg);
            setHasError(false);
          }
        })
        .catch((err) => {
          console.error('Mermaid render error', err);
          if (isMounted) {
            setHasError(true);
          }
        });
    } catch (e) {
      console.error('Mermaid initialization error', e);
      setHasError(true);
    }

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className="my-6 rounded-lg border border-[#D9D1C1] bg-[#FFFFFF] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#F4EFE6] border-b border-[#D9D1C1] text-xs">
        <span className="font-semibold text-[#1A1A1A] tracking-wide">
          {title || 'ARCHITECTURE FLOW'}
        </span>
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="px-2 py-0.5 rounded border border-[#D9D1C1] bg-[#FFFFFF] text-[#5A5245] hover:text-[#1A1A1A] hover:bg-[#E9E4D9] transition-colors text-[11px] font-mono-code"
        >
          {showRaw ? 'Show Diagram' : 'View Code'}
        </button>
      </div>

      {showRaw || hasError ? (
        <div className="p-4 bg-[#1E1E1E] text-[#E0E0E0] font-mono-code text-xs overflow-x-auto">
          {hasError && (
            <div className="mb-2 text-amber-400 font-sans">
              Diagram rendering preview mode. Raw syntax:
            </div>
          )}
          <pre>{chart}</pre>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="p-6 overflow-x-auto flex justify-center items-center bg-[#FCFAF7] min-h-[160px]"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
};
