import React, { useState } from 'react';
import { Maximize2, X, ZoomIn, ZoomOut, ExternalLink, Info, Check, Layers } from 'lucide-react';

export interface ArchitectureFigureProps {
  id?: string;
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  caption?: string;
  seniorTakeaway?: string;
  sourceNote?: string;
  badge?: string;
  tags?: string[];
  aspectRatio?: string;
}

export const ArchitectureFigure: React.FC<ArchitectureFigureProps> = ({
  id,
  src,
  alt,
  title,
  subtitle,
  caption,
  seniorTakeaway,
  sourceNote = 'Official Snowflake Architectural Specification',
  badge = 'OFFICIAL REFERENCE DIAGRAM',
  tags = [],
  aspectRatio = 'auto',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
    document.body.style.overflow = 'auto';
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <>
      <figure
        id={id}
        className="my-8 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1E1C1A] overflow-hidden shadow-xs transition-all hover:border-[#BF360C]/40"
      >
        {/* Figure Header */}
        <div className="px-5 py-3.5 bg-[#FAF7F2] dark:bg-[#23201D] border-b border-[#E9E4D9] dark:border-[#2E2923] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-[#BF360C]/10 text-[#BF360C] dark:text-[#E05A36] font-mono-code text-[11px] font-bold tracking-wide uppercase">
              {badge}
            </span>
            <h4 className="font-serif-heading font-bold text-sm text-[#1A1A1A] dark:text-[#EDE8DF]">
              {title}
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="hidden sm:inline-block text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#EDE8DF] dark:bg-[#2E2A25] text-[#5A5245] dark:text-[#A89F91]"
              >
                {t}
              </span>
            ))}
            <button
              onClick={handleOpenModal}
              title="Expand High-Resolution View"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#FFFFFF] dark:bg-[#2E2A25] border border-[#D9D1C1] dark:border-[#3E3830] text-xs font-mono-code font-semibold text-[#5A5245] dark:text-[#D1C9BC] hover:text-[#BF360C] hover:border-[#BF360C] transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Expand</span>
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div
          onClick={handleOpenModal}
          className="relative group cursor-zoom-in bg-[#FAF8F5] dark:bg-[#181615] flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[220px]"
        >
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            className="max-h-[380px] w-auto max-w-full object-contain rounded-md transition-transform duration-200 group-hover:scale-[1.01]"
            loading="lazy"
          />

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-[#1A1A1A]/85 text-white font-mono-code text-xs backdrop-blur-xs flex items-center space-x-1.5 shadow-md">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Click to view full diagram</span>
            </span>
          </div>
        </div>

        {/* Caption & Senior Engineering Breakdown */}
        <div className="p-5 border-t border-[#E9E4D9] dark:border-[#2E2923] space-y-3">
          {caption && (
            <p className="text-xs md:text-sm font-serif-heading text-[#333333] dark:text-[#D1C9BC] leading-relaxed">
              {caption}
            </p>
          )}

          {seniorTakeaway && (
            <div className="p-3.5 rounded-lg bg-[#F4EFE6] dark:bg-[#262320] border-l-3 border-[#BF360C] text-xs space-y-1">
              <div className="font-mono-code font-bold text-[#BF360C] dark:text-[#E05A36] uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Senior Interview Takeaway</span>
              </div>
              <p className="text-[#1A1A1A] dark:text-[#EDE8DF] font-serif-heading leading-relaxed">
                {seniorTakeaway}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] font-mono-code text-[#8C7B65] dark:text-[#7A7062] pt-1 border-t border-dashed border-[#E9E4D9] dark:border-[#2E2923]">
            <span>{sourceNote}</span>
            <button
              onClick={handleOpenModal}
              className="text-[#BF360C] dark:text-[#E05A36] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Full resolution diagram</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </figure>

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col p-3 md:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1E1C1A] border border-[#38332B] rounded-t-xl text-white">
            <div className="flex items-center space-x-3">
              <span className="px-2 py-0.5 rounded bg-[#BF360C] text-white font-mono-code text-[11px] font-bold uppercase">
                Architecture Blueprint
              </span>
              <h3 className="font-serif-heading font-bold text-sm md:text-base text-[#EDE8DF] truncate max-w-md">
                {title}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-[#2E2A25] rounded-lg border border-[#3E3830] p-0.5 text-xs font-mono-code">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.75}
                  className="p-1.5 hover:bg-[#3E3830] rounded text-[#EDE8DF] disabled:opacity-40 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-2 py-1 text-[11px] text-[#A89F91] hover:text-white cursor-pointer"
                  title="Reset Zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2.5}
                  className="p-1.5 hover:bg-[#3E3830] rounded text-[#EDE8DF] disabled:opacity-40 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg bg-[#2E2A25] hover:bg-[#BF360C] text-white border border-[#3E3830] transition-colors cursor-pointer"
                title="Close Viewer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Image Body */}
          <div className="flex-1 bg-[#121110] border-x border-[#38332B] overflow-auto flex items-center justify-center p-4">
            <img
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.15s ease-out',
              }}
              className="max-h-[85vh] max-w-full object-contain rounded shadow-2xl bg-white p-2"
            />
          </div>

          {/* Modal Footer Notes */}
          <div className="px-5 py-3 bg-[#1E1C1A] border border-[#38332B] rounded-b-xl text-xs text-[#A89F91] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="font-serif-heading text-[#D1C9BC] max-w-3xl">
              {caption || title}
            </p>
            <div className="shrink-0 font-mono-code text-[11px] text-[#8C7B65]">
              Press Esc or click top right to exit
            </div>
          </div>
        </div>
      )}
    </>
  );
};
