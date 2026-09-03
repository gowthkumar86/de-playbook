import React from 'react';
import { Award, HelpCircle, AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';

interface CalloutBoxProps {
  type: 'senior-line' | 'interview-line' | 'gotcha' | 'warning' | 'tip';
  title?: string;
  text: string;
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({ type, title, text }) => {
  const getStyles = () => {
    switch (type) {
      case 'senior-line':
        return {
          border: 'border-l-4 border-l-[#BF360C] border-[#D9D1C1]',
          bg: 'bg-[#FFF9F5]',
          icon: <Award className="w-5 h-5 text-[#BF360C] shrink-0" />,
          badge: 'bg-[#BF360C]/10 text-[#BF360C]',
          defaultTitle: 'Senior Engineering Line',
        };
      case 'interview-line':
        return {
          border: 'border-l-4 border-l-[#1F4B7A] border-[#D9D1C1]',
          bg: 'bg-[#F2F7FD]',
          icon: <HelpCircle className="w-5 h-5 text-[#1F4B7A] shrink-0" />,
          badge: 'bg-[#1F4B7A]/10 text-[#1F4B7A]',
          defaultTitle: 'Interview Delivery Line',
        };
      case 'gotcha':
        return {
          border: 'border-l-4 border-l-[#A65D00] border-[#D9D1C1]',
          bg: 'bg-[#FFFBF2]',
          icon: <AlertTriangle className="w-5 h-5 text-[#A65D00] shrink-0" />,
          badge: 'bg-[#A65D00]/10 text-[#A65D00]',
          defaultTitle: 'Production Gotcha & Pitfall',
        };
      case 'warning':
        return {
          border: 'border-l-4 border-l-[#8C2A2A] border-[#D9D1C1]',
          bg: 'bg-[#FDF3F3]',
          icon: <ShieldAlert className="w-5 h-5 text-[#8C2A2A] shrink-0" />,
          badge: 'bg-[#8C2A2A]/10 text-[#8C2A2A]',
          defaultTitle: 'Critical Warning',
        };
      case 'tip':
      default:
        return {
          border: 'border-l-4 border-l-[#2A6E3F] border-[#D9D1C1]',
          bg: 'bg-[#F4FAF5]',
          icon: <Lightbulb className="w-5 h-5 text-[#2A6E3F] shrink-0" />,
          badge: 'bg-[#2A6E3F]/10 text-[#2A6E3F]',
          defaultTitle: 'Architectural Tip',
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`my-5 rounded-r-lg border ${style.border} ${style.bg} p-4 shadow-sm`}>
      <div className="flex items-start space-x-3">
        {style.icon}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${style.badge}`}>
              {title || style.defaultTitle}
            </span>
          </div>
          <div className="text-[14px] leading-relaxed text-[#2C2520] font-normal italic">
            <MarkdownContent content={text} compact />
          </div>
        </div>
      </div>
    </div>
  );
};
