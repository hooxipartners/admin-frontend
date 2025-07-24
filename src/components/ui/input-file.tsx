import React from 'react';

interface FileInfo {
  name: string;
  type?: string;
}

interface InputFileProps {
  label: string;
  value?: FileInfo | null;
  onChange: (file: File) => void;
  onDelete?: () => void;
  placeholder?: string;
  accept?: string;
  className?: string;
}

// 업로드 아이콘 SVG
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 15V5M10 5L6 9M10 5L14 9" stroke="#637083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 파일(PDF) 아이콘 SVG
const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff" stroke="#E4E7EC"/>
    <text x="7" y="16" fontSize="8" fontWeight="bold" fill="#98A2B3">PDF</text>
  </svg>
);

// 삭제(X) 아이콘 SVG
const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" fill="#F2F4F7"/>
    <path d="M7 7L13 13M13 7L7 13" stroke="#CED2DA" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const InputFile: React.FC<InputFileProps> = ({
  label,
  value,
  onChange,
  onDelete,
  placeholder = '파일을 업로드해주세요.',
  accept = '.pdf,.jpg,.jpeg,.png',
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={`InputField self-stretch inline-flex flex-col items-start gap-2 ${className || ''}`.trim()}>
      {/* 라벨 */}
      <label className="inline-flex items-center gap-1 text-sm font-medium text-[#344051] font-['Inter'] leading-tight">
        {label}
      </label>
      {/* 인풋 영역 */}
      <div
        className={`Input self-stretch pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#E4E7EC] inline-flex justify-between items-center overflow-hidden min-h-[44px]`}
      >
        {/* 왼쪽: 파일명/플레이스홀더 + 아이콘 */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {value ? (
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center"><FileIcon /></span>
              <span className="truncate text-sm font-medium text-[#344051] font-['Inter'] leading-tight">{value.name}</span>
            </span>
          ) : (
            <span className="truncate text-sm font-medium text-[#98A2B3] font-['Inter'] leading-tight">{placeholder}</span>
          )}
        </div>
        {/* 오른쪽: 업로드/삭제 버튼 */}
        <div className="flex items-center">
          {value ? (
            onDelete && (
              <button type="button" onClick={onDelete} className="ml-2 p-1 hover:bg-[#F2F4F7] rounded-full">
                <DeleteIcon />
              </button>
            )
          ) : (
            <button type="button" onClick={() => inputRef.current?.click()} className="ml-2 p-1 hover:bg-[#F2F4F7] rounded-full">
              <UploadIcon />
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                onChange(e.target.files[0]);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InputFile; 