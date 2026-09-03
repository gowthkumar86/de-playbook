import React from 'react';
import { MermaidDiagram } from './MermaidDiagram';

interface MermaidViewerProps {
  chart: string;
  title?: string;
  className?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = (props) => {
  return <MermaidDiagram {...props} />;
};

export default MermaidViewer;
