import React, { forwardRef, useRef, useState, useEffect } from 'react';

interface InputDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: 'date' | 'month';
}

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(({ value, onChange, className = '', type, ...rest }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // value 형식에 따라 자동으로 타입 결정
  const inputType = type || (value && value.length === 7 && value.includes('-') ? 'month' : 'date');

  // month 타입일 때 value 포맷팅 (yyyy-mm 형식 유지)
  const formatValue = (val: string, type: string) => {
    if (type === 'month' && val) {
      // yyyy-mm 형식이면 그대로 사용, yyyy-mm-dd 형식이면 yyyy-mm으로 변환
      if (val.length === 10) {
        return val.substring(0, 7);
      }
      return val;
    }
    return val;
  };

  // onChange 핸들러 래핑
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputType === 'month') {
      // month 타입일 때 yyyy-mm 형식으로 변환
      const newValue = e.target.value;
      if (newValue && newValue.length === 7) {
        // 이미 yyyy-mm 형식이면 그대로 사용
        onChange(e);
      } else if (newValue && newValue.length === 10) {
        // yyyy-mm-dd 형식이면 yyyy-mm으로 변환
        const modifiedEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue.substring(0, 7)
          }
        };
        onChange(modifiedEvent as React.ChangeEvent<HTMLInputElement>);
      } else {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };

  // 커스텀 월 선택 핸들러
  const handleMonthSelect = (year: number, month: number) => {
    const monthStr = month.toString().padStart(2, '0');
    const newValue = `${year}-${monthStr}`;
    
    const modifiedEvent = {
      target: {
        value: newValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(modifiedEvent);
    setShowMonthPicker(false);
  };

  // 현재 선택된 년월 파싱
  const currentValue = formatValue(value, inputType);
  const [currentYear, currentMonth] = currentValue ? currentValue.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];

  // ref 우선순위: 외부 ref > 내부 ref
  const mergedRef = (node: HTMLInputElement) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    inputRef.current = node;
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowMonthPicker(false);
      }
    };

    if (showMonthPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMonthPicker]);

  // month 타입일 때 커스텀 UI 렌더링
  if (inputType === 'month') {
    return (
      <div className="relative">
        <div className="relative flex items-center">
          <input
            ref={mergedRef}
            type="text"
            value={currentValue}
            readOnly
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            className={`pl-3 pr-10 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] outline-offset-[-1px] text-sm w-full h-[36px] min-h-[36px] cursor-pointer ${className}`}
            {...rest}
          />
          <span
            className="absolute right-3 cursor-pointer"
            onClick={() => setShowMonthPicker(!showMonthPicker)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 8.33341V15.8334C2.5 16.7539 3.24619 17.5001 4.16667 17.5001H15.8333C16.7538 17.5001 17.5 16.7539 17.5 15.8334V8.33341M2.5 8.33341H17.5M2.5 8.33341V5.00008C2.5 4.07961 3.24619 3.33341 4.16667 3.33341H5.83333M17.5 8.33341V5.00008C17.5 4.07961 16.7538 3.33341 15.8333 3.33341H15.4167M12.5 3.33341V1.66675M12.5 3.33341V5.00008M12.5 3.33341H8.75M5.83333 5.00008V1.66675" stroke="#637083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        
        {/* 커스텀 월 선택 드롭다운 */}
        {showMonthPicker && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e7ec] rounded-[10px] shadow-lg z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => handleMonthSelect(currentYear - 1, currentMonth)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="#637083" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="text-sm font-medium">{currentYear}년</span>
              <button
                onClick={() => handleMonthSelect(currentYear + 1, currentMonth)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#637083" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(currentYear, month)}
                  className={`p-2 text-sm rounded hover:bg-gray-100 ${
                    month === currentMonth ? 'bg-[#141C25] text-white' : ''
                  }`}
                >
                  {month}월
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // date 타입일 때 기존 UI 렌더링
  return (
    <div className="relative flex items-center">
      <input
        ref={mergedRef}
        type={inputType}
        value={formatValue(value, inputType)}
        onChange={handleChange}
        className={`pl-3 pr-10 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] outline-offset-[-1px] text-sm w-full h-[36px] min-h-[36px] ${className}`}
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