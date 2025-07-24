import React, { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  className?: string;
  simple?: boolean; // 체크박스 숨김 (단일 선택 스타일)
  // 제어된 다중 선택
  selectedValues?: string[];
  onSelectionChange?: (values: string[]) => void;
  // 제어된 단일 선택
  value?: string;
  onValueChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
                                         options,
                                         placeholder = '선택',
                                         className = '',
                                         simple = false,
                                         selectedValues,
                                         onSelectionChange,
                                         value,
                                         onValueChange,
                                       }) => {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMulti = onSelectionChange !== undefined;
  const isSingle = onValueChange !== undefined;

  const multiSelected = selectedValues ?? internalSelected;
  const singleSelected = value;

  const toggleMulti = (val: string) => {
    const newSel = multiSelected.includes(val)
      ? multiSelected.filter(v => v !== val)
      : [...multiSelected, val];
    if (onSelectionChange) onSelectionChange(newSel);
    else setInternalSelected(newSel);
  };

  const selectSingle = (val: string) => {
    if (onValueChange) onValueChange(val);
    setOpen(false);
  };

  let buttonLabel = placeholder;
  if (isSingle && singleSelected) {
    const found = options.find(o => o.value === singleSelected);
    buttonLabel = found ? found.label : placeholder;
  } else if (isMulti && multiSelected.length) {
    // ALL, '' 등 placeholder 역할 값은 제외
    const filtered = options
      .filter(o => multiSelected.includes(o.value) && o.value !== '' && o.value !== 'ALL' && o.label !== placeholder);
    buttonLabel = filtered.length
      ? filtered.map(o => o.label).join(', ')
      : placeholder;
  }

  const hideCheckbox = simple || isSingle;

  return (
    <div className={`relative inline-block text-left`} ref={ref}>
      <button
        type="button"
        className={`inline-flex items-center justify-between pl-[20px] pr-[12px] py-[10px] h-[40px] border rounded-[10px] text-sm font-medium leading-5 bg-white flex gap-2 ${className}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <span className="truncate">{buttonLabel}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute mt-1 w-[246px] rounded-[12px] border border-[#e4e7ec] shadow-[0_10px_15px_-3px_rgba(20,28,37,0.08)] bg-white overflow-hidden z-50 p-0 pt-2 pb-2">
          {/* heading (placeholder) */}
          <div className="px-[10px] py-[8px] text-xs text-[#637083] font-['Inter'] border-b border-[#f2f4f7]">
            {placeholder}
          </div>
          {options
            .filter(option => option.label !== placeholder && option.value !== '' && option.value !== 'ALL')
            .map((option) => {
              const selectedFlag = isSingle
                ? option.value === singleSelected
                : multiSelected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`flex items-center gap-1 px-[16px] py-[8px] h-[36px] cursor-pointer select-none w-full ${selectedFlag ? 'bg-[#F2F4F7]' : 'hover:bg-[#f9fafb]'} transition-colors`}
                  onClick={() => (isSingle ? selectSingle(option.value) : toggleMulti(option.value))}
                >
                  {!hideCheckbox && (
                    <span
                      className={`w-[16px] h-[16px] rounded-[6px] flex items-center justify-center border ${selectedFlag ? 'bg-[#0166FF] border-none' : 'border-[#ced2da] bg-white'}`}
                    >
                      {selectedFlag && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 7.5L6 10.5L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  )}
                  <span className="text-[#344051] text-[14px] font-normal font-['Inter'] leading-[20px] flex-1 text-left">
                    {option.label}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Select;
