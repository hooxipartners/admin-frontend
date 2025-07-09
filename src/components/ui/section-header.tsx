import React from 'react';

interface SectionHeaderProps {
  title: string;
  count?: number;
  lastUpdated?: string;
  primaryButton?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  actionButton?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  count,
  lastUpdated,
  primaryButton,
  secondaryButton,
  actionButton
}) => {
  return (
    <div className="flex w-full h-12 py-3 bg-Background-Colors-bg-0 items-center mb-6">
      {/* 좌측: 제목 + 카운트 */}
      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
        <span 
          className="text-base font-medium text-[#141c25] truncate"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {title}
        </span>
        {count !== undefined && (
          <span 
            className="text-[#0166FF] font-semibold text-[14px] leading-5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {count}
          </span>
        )}
      </div>
      
      {/* 중앙 공간 */}
      <div className="flex-1" />
      
      {/* 우측: 버튼들 */}
      <div className="flex items-center gap-4">
        {lastUpdated && (
          <span className="text-[#637083] text-xs">
            최근 업데이트 일시<br/>{lastUpdated}
          </span>
        )}
        
        {secondaryButton && (
          <button 
            onClick={secondaryButton.onClick}
            className="flex items-center gap-2 py-2 px-5 rounded-[10px] border border-[#e4e7ec] bg-white shadow text-[#344051] text-sm font-medium"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {secondaryButton.icon}
            {secondaryButton.text}
          </button>
        )}
        
        {primaryButton && (
          <button 
            onClick={primaryButton.onClick}
            className="flex items-center gap-2 py-2 px-5 rounded-[10px] bg-[#0166ff] text-white text-sm font-medium"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {primaryButton.icon}
            {primaryButton.text}
          </button>
        )}
        
        {actionButton && (
          <button 
            onClick={actionButton.onClick}
            className={
              actionButton.variant === 'primary'
                ? 'px-4 py-2 text-sm font-medium rounded-lg bg-[#0166ff] text-white hover:bg-[#0166ff]/90'
                : 'px-5 py-2.5 rounded-[10px] bg-[#141C25] text-white shadow text-[14px] font-medium leading-5 font-inter'
            }
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {actionButton.text}
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionHeader; 