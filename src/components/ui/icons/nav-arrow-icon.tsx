interface NavArrowIconProps extends React.SVGProps<SVGSVGElement> {
  direction?: 'up' | 'down';
  className?: string;
}

export function NavArrowIcon({ direction = 'down', className, ...props }: NavArrowIconProps) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d={direction === 'down' ? "M5 7.5L10 12.5L15 7.5" : "M5 12.5L10 7.5L15 12.5"}
        stroke="#637083" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}
