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
    buttonLabel = options
      .filter(o => multiSelected.includes(o.value))
      .map(o => o.label)
      .join(', ');
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
        <div className="absolute mt-1 min-w-full w-auto max-h-60 overflow-auto bg-white border rounded-lg shadow-lg z-10">
          {/* 헤더: placeholder */}
          <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500">
            {placeholder}
          </div>
          {options.map(option => {
            const selectedFlag = isSingle
              ? option.value === singleSelected
              : multiSelected.includes(option.value);
            return (
              <div
                key={option.value}
                className={`cursor-pointer px-4 py-2 ${selectedFlag ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => (isSingle ? selectSingle(option.value) : toggleMulti(option.value))}
              >
                <div className={`flex items-center ${hideCheckbox ? '' : 'gap-2'}`}>
                  {!hideCheckbox && (
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        selectedFlag ? 'bg-blue-600' : 'border-gray-300'
                      }`}
                    >
                      {selectedFlag && (
                        <svg
                          className="w-3 h-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  )}
                  <span className="text-gray-700 truncate">{option.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
