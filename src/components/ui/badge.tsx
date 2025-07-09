import React from 'react';

interface BadgeProps {
  type: 'charge' | 'mileage' | 'fuel';
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
};

export const Badge = ({ type, children, className = '' }: BadgeProps) => (
  <div
    className={`inline-flex justify-center items-center rounded-[6px] font-medium font-inter text-[14px] leading-5 px-[10px] py-[4px] ${className}`}
    style={{
      background: badgeStyle[type].background,
      color: badgeStyle[type].color,
    }}
  >
    {children}
  </div>
);

export default Badge;
