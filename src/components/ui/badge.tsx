import React from 'react';

interface BadgeProps {
  type?: 'charge' | 'mileage' | 'fuel' | 'default';
  children: React.ReactNode;
  className?: string;
}

const badgeStyle = {
  charge: {
    background: '#FFFBEB',
    color: '#78350F',
  },
  mileage: {
    background: '#ECFDF5',
    color: '#064E3B',
  },
  fuel: {
    background: '#F0F9FF',
    color: '#0B4A6F',
  },
  default: {
    background: '#F3F4F6',
    color: '#111827',
  },
};

export const Badge = ({ type = 'default', children, className = '' }: BadgeProps) => (
  <div
    className={`inline-flex justify-center items-center rounded-[6px] font-medium font-inter text-[14px] leading-5 px-[10px] py-[4px] ${className}`}
    style={{
      background: badgeStyle[type]?.background || badgeStyle['default'].background,
      color: badgeStyle[type]?.color || badgeStyle['default'].color,
    }}
  >
    {children}
  </div>
);

export default Badge;
