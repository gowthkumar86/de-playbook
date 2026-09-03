import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Copy,
  Check,
  Download,
  X,
  AlertTriangle,
} from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  className?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  title,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const modalViewportRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [svgContent, setSvgContent] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Zoom state for diagram card instance
  const [zoom, setZoom] = useState<number>(1);

  // Fullscreen modal state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [modalZoom, setModalZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Detect dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return (
        document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark')
      );
    }
    return false;
  });

  // Watch for theme changes on html/body
  useEffect(() => {
    const checkTheme = () => {
      const dark =
        document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark');
      setIsDark(dark);
    };

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (
        !document.documentElement.classList.contains('light') &&
        !document.documentElement.classList.contains('dark')
      ) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Initialize and render diagram
  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!chart || !chart.trim()) return;

      try {
        // 1a. Initialize mermaid with useMaxWidth: false and larger default fonts
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'base',
          themeVariables: isDark
            ? {
                fontSize: '16px',
                fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui',
                primaryColor: '#26221D',
                primaryTextColor: '#F9F7F2',
                primaryBorderColor: '#8C7B65',
                lineColor: '#C4B9A7',
                tertiaryColor: '#363028',
                background: '#1C1A17',
                darkMode: true,
              }
            : {
                fontSize: '16px',
                fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui',
                primaryColor: '#F9F7F2',
                primaryTextColor: '#1A1A1A',
                primaryBorderColor: '#8C7B65',
                lineColor: '#5A5245',
                tertiaryColor: '#E9E4D9',
              },
          flowchart: {
            nodeSpacing: 60,
            rankSpacing: 80,
            padding: 20,
            htmlLabels: true,
          },
          sequence: {
            messageFontSize: 16,
            actorFontSize: 16,
          },
        });

        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
        const existing = document.getElementById(uniqueId);
        if (existing) existing.remove();

        const { svg } = await mermaid.render(uniqueId, chart.trim());

        // Cleanup temporary element if mermaid leaves it behind
        const tempEl = document.getElementById(`d${uniqueId}`);
        if (tempEl) tempEl.remove();

        if (isMounted) {
          // Normalize SVG style to prevent cropping while respecting natural size
          // Mermaid with useMaxWidth: false may set style="max-width: ...px;".
          // We ensure max-width is not artificially constricted.
          const cleanSvg = svg.replace(/<svg\s+([^>]*?)>/i, (match, attrs) => {
            if (!attrs.includes('style=')) {
              return `<svg ${attrs} style="max-width: none; height: auto;">`;
            }
            return match.replace(/style="([^"]*)"/i, (sMatch, styleVal) => {
              // Replace max-width with max-width: none
              let newStyle = styleVal.replace(/max-width:\s*[^;]+;?/gi, '');
              newStyle = `max-width: none; height: auto; ${newStyle}`.trim();
              return `style="${newStyle}"`;
            });
          });

          setSvgContent(cleanSvg);
          setHasError(false);
          setErrorMessage('');
        }
      } catch (err: unknown) {
        console.error('Mermaid render failure:', err);
        if (isMounted) {
          setHasError(true);
          const msg = err instanceof Error ? err.message : String(err);
          setErrorMessage(msg);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, isDark]);

  // Apply transform: scale(zoom) on SVG in diagram card
  useEffect(() => {
    if (!svgWrapperRef.current) return;
    const svgEl = svgWrapperRef.current.querySelector('svg');
    if (svgEl) {
      svgEl.style.transform = `scale(${zoom})`;
      svgEl.style.transformOrigin = 'center center';
      svgEl.style.transition = 'transform 0.15s ease-out';
    }
  }, [zoom, svgContent]);

  // Keyboard shortcut for fullscreen modal (Esc to close)
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Zoom controls for card
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3.0, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.3, Number((prev - 0.15).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Copy Mermaid source code
  const handleCopySource = () => {
    navigator.clipboard.writeText(chart.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Open fullscreen modal
  const handleOpenFullscreen = () => {
    setModalZoom(1);
    setPan({ x: 0, y: 0 });
    setIsFullscreen(true);
  };

  // Download SVG file
  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = (title || 'architecture-diagram')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    link.download = `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Modal pan and zoom mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.88;
    setModalZoom((prev) => Math.max(0.2, Math.min(5.0, Number((prev * factor).toFixed(2)))));
  }, []);

  const handleResetModal = () => {
    setModalZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Error fallback: Requirement 4 - show raw Mermaid source in code block
  if (hasError) {
    return (
      <div className={`my-6 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-[#FFFDF9] dark:bg-[#1C1814] p-4 shadow-xs ${className}`}>
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-amber-200 dark:border-amber-800/60">
          <div className="flex items-center space-x-2 text-xs font-mono-code text-amber-800 dark:text-amber-300 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Diagram failed to render — showing source</span>
          </div>
          <button
            onClick={handleCopySource}
            className="flex items-center space-x-1 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-[#25221E] text-xs text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] cursor-pointer"
            title="Copy Mermaid source"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        {errorMessage && (
          <p className="text-[11px] font-mono-code text-amber-700 dark:text-amber-400 mb-2">
            {errorMessage}
          </p>
        )}
        <pre className="p-3.5 rounded-lg bg-[#1E1E1E] text-[#E0E0E0] font-mono-code text-xs overflow-x-auto leading-relaxed">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  return (
    <>
      {/* Main Diagram Card Container: Requirement 1b */}
      <div
        className={`relative my-6 rounded-xl border border-[#D9D1C1] dark:border-[#3E3830] bg-[#FFFFFF] dark:bg-[#1C1A17] shadow-xs overflow-hidden group ${className}`}
      >
        {/* Card Header with optional Title & Floating Toolbar Overlay */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#F4EFE6] dark:bg-[#221F1B] border-b border-[#D9D1C1] dark:border-[#3E3830] text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-mono-code font-bold text-[#8C7B65] dark:text-[#A69882] tracking-wider uppercase text-[11px]">
              {title || 'ARCHITECTURE SPECIFICATION'}
            </span>
            {zoom !== 1 && (
              <span className="font-mono-code text-[10px] px-1.5 py-0.2 rounded bg-[#E9E4D9] dark:bg-[#332C23] text-[#5A5245] dark:text-[#CCCCCC]">
                {Math.round(zoom * 100)}%
              </span>
            )}
          </div>

          {/* Floating Toolbar: Requirement 1c */}
          <div className="flex items-center space-x-1 bg-[#FFFFFF]/90 dark:bg-[#1C1A17]/90 px-1.5 py-0.5 rounded-lg border border-[#D9D1C1] dark:border-[#3E3830] shadow-2xs">
            {/* Zoom In (+) */}
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] hover:bg-[#E9E4D9] dark:hover:bg-[#2E2822] transition-colors cursor-pointer"
              title="Zoom in (+)"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            {/* Zoom Out (-) */}
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] hover:bg-[#E9E4D9] dark:hover:bg-[#2E2822] transition-colors cursor-pointer"
              title="Zoom out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            {/* Reset Zoom */}
            <button
              onClick={handleResetZoom}
              className="p-1 rounded text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] hover:bg-[#E9E4D9] dark:hover:bg-[#2E2822] transition-colors cursor-pointer"
              title="Reset zoom (100%)"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="h-3.5 w-px bg-[#D9D1C1] dark:bg-[#3E3830] mx-0.5" />

            {/* Fullscreen Modal Toggle */}
            <button
              onClick={handleOpenFullscreen}
              className="p-1 rounded text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] hover:bg-[#E9E4D9] dark:hover:bg-[#2E2822] transition-colors cursor-pointer"
              title="Fullscreen (90% viewport)"
              aria-label="Fullscreen diagram"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Copy Mermaid Source */}
            <button
              onClick={handleCopySource}
              className="p-1 rounded text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] hover:bg-[#E9E4D9] dark:hover:bg-[#2E2822] transition-colors cursor-pointer"
              title="Copy Mermaid source"
              aria-label="Copy Mermaid source"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Diagram SVG Container:
            - min-height: 280px
            - overflow-x-auto with horizontal scrollbar for wide diagrams
            - padding: 16px 24px (px-6 py-4)
            - never clips or crops SVG
            - double-click to open fullscreen */}
        <div
          ref={containerRef}
          className="relative min-h-[280px] p-[16px_24px] overflow-x-auto overflow-y-visible flex items-center justify-center bg-[#FCFAF7] dark:bg-[#161412] cursor-default"
          onDoubleClick={handleOpenFullscreen}
          title="Double-click to open fullscreen"
        >
          <div
            ref={svgWrapperRef}
            className="diagram-svg-target flex items-center justify-center w-full [&_svg]:max-w-none [&_svg]:h-auto [&_svg]:block"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>

      {/* Fullscreen Modal: Requirement 1d */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative flex flex-col rounded-2xl border border-[#D9D1C1] dark:border-[#3E3830] bg-[#FCFAF7] dark:bg-[#161412] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{ width: '90vw', height: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Actions */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#D9D1C1] dark:border-[#3E3830] bg-[#F4EFE6] dark:bg-[#1E1B17] shrink-0">
              <div className="flex items-center space-x-3">
                <span className="font-serif-heading font-bold text-[#1A1A1A] dark:text-[#F9F7F2] text-sm sm:text-base">
                  {title || 'Architecture Diagram'}
                </span>
                <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-[#E9E4D9] dark:bg-[#2A241E] text-[#5A5245] dark:text-[#C4B9A7]">
                  {Math.round(modalZoom * 100)}%
                </span>
              </div>

              {/* Modal Toolbar: Zoom Out, Zoom In, Reset, Download SVG, Copy Source, Close */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() =>
                    setModalZoom((z) => Math.max(0.2, Number((z - 0.15).toFixed(2))))
                  }
                  className="p-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#3E3830] bg-white dark:bg-[#25221E] text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
                  title="Zoom out (-)"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  onClick={() =>
                    setModalZoom((z) => Math.min(5.0, Number((z + 0.15).toFixed(2))))
                  }
                  className="p-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#3E3830] bg-white dark:bg-[#25221E] text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
                  title="Zoom in (+)"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={handleResetModal}
                  className="p-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#3E3830] bg-white dark:bg-[#25221E] text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
                  title="Reset zoom & pan"
                  aria-label="Reset zoom and pan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="h-5 w-px bg-[#D9D1C1] dark:bg-[#3E3830] mx-1" />

                {/* Download SVG */}
                <button
                  onClick={handleDownloadSvg}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#3E3830] bg-white dark:bg-[#25221E] text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer text-xs font-mono-code font-semibold"
                  title="Download SVG file"
                  aria-label="Download SVG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">SVG</span>
                </button>

                {/* Copy Mermaid Source */}
                <button
                  onClick={handleCopySource}
                  className="p-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#3E3830] bg-white dark:bg-[#25221E] text-[#5A5245] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
                  title="Copy Mermaid source"
                  aria-label="Copy source"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <div className="h-5 w-px bg-[#D9D1C1] dark:bg-[#3E3830] mx-1" />

                {/* Close Button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#3E3830] bg-[#E9E4D9] dark:bg-[#2E2822] text-[#1A1A1A] dark:text-white hover:bg-[#BF360C] hover:text-white transition-colors cursor-pointer"
                  title="Close (Esc)"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Canvas: Supports pan by drag and zoom by wheel / trackpad pinch */}
            <div
              ref={modalViewportRef}
              className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center select-none bg-[#FCFAF7] dark:bg-[#161412]"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onDoubleClick={handleResetModal}
            >
              <div
                className="diagram-svg-modal flex items-center justify-center [&_svg]:max-w-none [&_svg]:h-auto [&_svg]:block"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${modalZoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.08s ease-out',
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>

            {/* Modal Footer helper */}
            <div className="px-5 py-2 border-t border-[#D9D1C1] dark:border-[#3E3830] bg-[#F4EFE6] dark:bg-[#1E1B17] text-[11px] font-mono-code text-[#8C7B65] dark:text-[#A69882] flex items-center justify-between shrink-0">
              <span>Drag canvas to pan • Scroll / pinch to zoom • Double-click to reset</span>
              <span>Press Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MermaidDiagram;
