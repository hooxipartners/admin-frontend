interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function CheckIcon({ className, ...props }: CheckIconProps) {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 14 14" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d="M2.91699 7.58325L5.25033 9.91659L11.0837 4.08325" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}
