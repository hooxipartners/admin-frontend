import React from 'react';
import SortIcon from './icons/sort-icon';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: SortDirection } | null;
  onSort: (key: string, direction: SortDirection) => void;
  className?: string;
  showSortIcon?: boolean;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
  className = '',
  showSortIcon = true
}) => {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  const handleClick = () => {
    let newDirection: SortDirection;
    
    if (!isActive) {
      newDirection = 'asc';
    } else if (direction === 'asc') {
      newDirection = 'desc';
    } else if (direction === 'desc') {
      newDirection = null;
    } else {
      newDirection = 'asc';
    }
    
    onSort(sortKey, newDirection);
  };

  return (
    <div 
      className={`flex items-center gap-2 cursor-pointer select-none ${className}`}
      onClick={handleClick}
    >
      <span className="text-xs font-medium text-[#344051] leading-5 whitespace-nowrap font-inter text-[14px] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      {showSortIcon && (
        <div className="flex flex-col items-center">
          <SortIcon 
            size={14} 
            className={`transition-all duration-200 ${
              isActive && direction === 'asc' 
                ? 'text-[#0166FF]' 
                : 'text-[#414E62]'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default SortableHeader; 