import React from 'react';

interface PaginationProps {
  page: number; // 0부터 시작
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, disabled, className }) => {
  // 페이지 버튼 배열 생성 (5개까지만, ... 점, 마지막 페이지)
  const getPageButtons = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    if (page < 3) {
      return [0, 1, 2, 3, '...', totalPages - 1];
    }
    if (page > totalPages - 4) {
      return [0, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    }
    return [0, '...', page - 1, page, page + 1, '...', totalPages - 1];
  };

  const pageButtons = getPageButtons();

  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <button
        className="rounded-lg bg-[#f2f4f7] p-2 disabled:opacity-50"
        disabled={disabled || page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M12.5 5L7.5 10L12.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="flex items-center gap-2">
        {pageButtons.map((btn, idx) =>
          btn === '...'
            ? <span key={idx} className="px-2 leading-5 text-[#637083]" style={{ fontFamily: 'Inter-Medium, sans-serif' }}>...</span>
            : <button
                key={idx}
                onClick={() => onPageChange(Number(btn))}
                className={`h-9 w-9 rounded-lg text-sm leading-5 font-medium transition-colors ${page === btn ? 'bg-[#f2f4f7] text-[#141c25]' : 'text-[#637083] hover:bg-gray-100'}`}
                style={{ fontFamily: 'Inter-Medium, sans-serif' }}
                disabled={disabled}
              >
                {Number(btn) + 1}
              </button>
        )}
      </div>
      <button
        className="rounded-lg bg-[#f2f4f7] p-2 disabled:opacity-50"
        disabled={disabled || page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7.5 5L12.5 10L7.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
};

export default Pagination; 