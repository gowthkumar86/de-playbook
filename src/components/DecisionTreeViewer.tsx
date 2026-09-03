import React from 'react';
import { GitBranch } from 'lucide-react';

interface DecisionTreeViewerProps {
  treeText: string;
  title?: string;
}

export const DecisionTreeViewer: React.FC<DecisionTreeViewerProps> = ({
  treeText,
  title = 'DECISION TREE / DIAGNOSTIC MATRIX',
}) => {
  return (
    <div className="my-6 rounded-lg border border-[#D9D1C1] bg-[#1C1A17] text-[#EDE8DF] shadow-sm overflow-hidden">
      <div className="flex items-center space-x-2 px-4 py-2.5 bg-[#26231F] border-b border-[#38332C] text-xs font-mono-code">
        <GitBranch className="w-3.5 h-3.5 text-[#E67E22]" />
        <span className="font-semibold tracking-wider text-[#DCD6CA] uppercase">
          {title}
        </span>
      </div>
      <div className="p-4 overflow-x-auto font-mono-code text-[12.5px] leading-relaxed select-text text-[#F2ECE1]">
        <pre className="m-0 font-mono-code">{treeText}</pre>
      </div>
    </div>
  );
};
