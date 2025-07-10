import React from 'react';
import { Button } from './button';
import { Input } from './input';
import Select from './select';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterBarProps {
  // 필터 아이콘 표시 여부
  showFilterIcon?: boolean;
  // Select 필터들 (가변적) - 다중선택 지원
  selects?: Array<{
    options: FilterOption[];
    placeholder?: string;
    // 단일 선택
    value?: string;
    onValueChange?: (value: string) => void;
    // 다중 선택
    selectedValues?: string[];
    onSelectionChange?: (values: string[]) => void;
    className?: string;
  }>;
  // 검색 Input 설정
  searchInput?: {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
  };
  // 검색 버튼 설정
  searchButton?: {
    text?: string;
    onClick?: () => void;
    className?: string;
  };
  // 우측 영역 (Rows per page 등)
  rightSection?: React.ReactNode;
  // 전체 컨테이너 클래스
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  showFilterIcon = true,
  selects = [],
  searchInput,
  searchButton,
  rightSection,
  className = ''
}) => {
  return (
    <div className={`flex justify-between items-center w-full gap-4 mt-6 mb-6 ${className}`}>
      {/* 좌측: 필터들 */}
      <div className="flex items-center gap-2">
        {/* 필터 아이콘 */}
        {showFilterIcon && (
          <div className="flex items-center h-10 px-3 py-2 bg-white rounded-[10px] border border-[#e4e7ec]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z" 
                stroke="#637083" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        
        {/* Select 필터들 */}
        {selects.map((select, index) => (
          <Select
            key={index}
            options={select.options}
            placeholder={select.placeholder}
            value={select.value}
            onValueChange={select.onValueChange}
            selectedValues={select.selectedValues}
            onSelectionChange={select.onSelectionChange}
            className={select.className}
          />
        ))}
        
        {/* 검색 Input */}
        {searchInput && (
          <div className="w-60 flex items-center">
            <Input 
              className={`flex-1 border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-base h-10 ${searchInput.className || ''}`}
              placeholder={searchInput.placeholder}
              value={searchInput.value}
              onChange={(e) => searchInput.onChange?.(e.target.value)}
              onKeyDown={searchInput.onKeyDown}
            />
          </div>
        )}
        
        {/* 검색 버튼 */}
        {searchButton && (
          <Button 
            className={`h-10 min-w-[80px] px-5 py-2 rounded-[10px] bg-[#141c25] text-white text-sm font-medium ${searchButton.className || ''}`}
            onClick={searchButton.onClick}
          >
            {searchButton.text || '검색'}
          </Button>
        )}
      </div>
      
      {/* 우측: Rows per page 등 */}
      {rightSection && (
        <div className="flex items-center gap-2">
          {rightSection}
        </div>
      )}
    </div>
  );
};

export default FilterBar; 