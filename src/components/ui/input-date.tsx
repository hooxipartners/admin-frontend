import React, { forwardRef, useRef } from 'react';

interface InputDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(({ value, onChange, className = '', ...rest }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // ref 우선순위: 외부 ref > 내부 ref
  const mergedRef = (node: HTMLInputElement) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    inputRef.current = node;
  };

  return (
    <div className="relative flex items-center">
      <input
        ref={mergedRef}
        type="date"
        value={value}
        onChange={onChange}
        className={`pl-3 pr-10 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm w-full ${className}`}
        {...rest}
      />
      <span
        className="absolute right-3 cursor-pointer"
        onClick={() => inputRef.current?.showPicker ? inputRef.current.showPicker() : inputRef.current?.focus()}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 8.33341V15.8334C2.5 16.7539 3.24619 17.5001 4.16667 17.5001H15.8333C16.7538 17.5001 17.5 16.7539 17.5 15.8334V8.33341M2.5 8.33341H17.5M2.5 8.33341V5.00008C2.5 4.07961 3.24619 3.33341 4.16667 3.33341H5.83333M17.5 8.33341V5.00008C17.5 4.07961 16.7538 3.33341 15.8333 3.33341H15.4167M12.5 3.33341V1.66675M12.5 3.33341V5.00008M12.5 3.33341H8.75M5.83333 5.00008V1.66675" stroke="#637083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <style>{`
        input[type='date']::-webkit-calendar-picker-indicator {
          opacity: 0;
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
        input[type='date']::-ms-clear {
          display: none;
        }
        input[type='date']::-ms-expand {
          display: none;
        }
        input[type='date']::-o-clear {
          display: none;
        }
        input[type='date']::-o-expand {
          display: none;
        }
      `}</style>
    </div>
  );
});

InputDate.displayName = 'InputDate';

export default InputDate; 