import React from 'react';

interface SortIconProps {
  className?: string;
  size?: number;
}

const SortIcon: React.FC<SortIconProps> = ({ className = '', size = 14 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 14 14" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M9.91634 4.66667L6.99967 1.75L4.08301 4.66667M9.91634 9.33333L6.99967 12.25L4.08301 9.33333" 
        stroke="#414E62" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SortIcon; 