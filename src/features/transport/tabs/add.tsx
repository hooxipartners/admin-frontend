import { useState, useRef } from 'react';
import { uploadMultiFiles, getNaverOcrResult, HooxiOcrRequestDto, NaverOcrResponseDto } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

const OCR_FIELDS = [
  { key: 'mobilityNo', label: '차량번호' },
  { key: 'type', label: '차량유형' },
  { key: 'model', label: '모델' },
  { key: 'year', label: '연식' },
  { key: 'vin', label: '차대번호' },
  { key: 'companyName', label: '회사명' },
  { key: 'corporateRegistrationNumber', label: '법인등록번호' },
  { key: 'mobilityRegDate', label: '등록일' },
  { key: 'length', label: '길이' },
  { key: 'width', label: '너비' },
  { key: 'height', label: '높이' },
  { key: 'totalWeight', label: '총중량' },
  { key: 'passengerCapacity', label: '승차정원' },
  { key: 'fuelType', label: '연료' },
  { key: 'mobilityReleasePrice', label: '출고가' },
];

export default function AddMobilityModal({ onClose, onBack }: { onClose?: () => void, onBack?: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 1. 파일 업로드 상태
  const [files, setFiles] = useState<File[]>([]);
  const [uploadResult, setUploadResult] = useState<any[]>([]); // 업로드 API 결과
  const [, setOcrResult] = useState<NaverOcrResponseDto | null>(null);
  const [step, setStep] = useState<'upload' | 'ocr' | 'review'>('upload');
  const [currentIdx, setCurrentIdx] = useState(0); // 실패 리스트 인덱스
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // OCR 검증/수정용 상태
  const [editList, setEditList] = useState<any[]>([]); // failureList 복사본
  const [, setSuccessList] = useState<any[]>([]);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // 파일 업로드
  const handleUpload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadMultiFiles(files);
      setUploadResult(res.data || []);
      setStep('ocr');
    } catch (err: any) {
      setError('파일 업로드 실패');
    } finally {
      setLoading(false);
    }
  };

  // OCR 요청
  const handleOcr = async () => {
    setLoading(true);
    setError(null);
    try {
      const ocrReq: HooxiOcrRequestDto[] = (uploadResult || [])
        .filter((f: any) => f.success)
        .map((f: any) => ({
          originalFileName: f.originalFileName,
          storedFileName: f.storedFileName,
          uploadTempPath: f.uploadTempPath,
        }));
      const ocrRes = await getNaverOcrResult(ocrReq);
      setOcrResult(ocrRes);
      setEditList(ocrRes.failureList.map((item: any) => ({ ...item })));
      setStep('review');
      setCurrentIdx(0);
    } catch (err: any) {
      setError('OCR 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  // 필드별 인풋 변경
  const handleFieldChange = (key: string, value: string) => {
    setEditList((prev) => {
      const next = [...prev];
      next[currentIdx] = { ...next[currentIdx], [key]: value };
      return next;
    });
  };

  // 저장(검증 완료 → successList로 이동)
  const handleSave = () => {
    setSuccessList((prev) => [...prev, editList[currentIdx]]);
    // 현재 항목을 failureList(editList)에서 제거
    const nextEditList = editList.filter((_, i) => i !== currentIdx);
    setEditList(nextEditList);
    // 다음 항목으로 이동 or 모두 완료 시 안내
    if (nextEditList.length === 0) {
      alert('모든 차량 정보 검증/수정이 완료되었습니다! (실제 저장 API 연동 필요)');
      setStep('upload'); // 또는 onClose() 등
    } else {
      setCurrentIdx(Math.max(0, currentIdx - (currentIdx === nextEditList.length ? 1 : 0)));
    }
  };

  // 다음/이전
  const handleNext = () => {
    if (currentIdx < editList.length - 1) setCurrentIdx(currentIdx + 1);
  };
  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  // // 미리보기 URL 생성 함수 (files를 붙이지 않고 relativePath 그대로 사용)
  // const getPreviewUrl = (relativePath: string) => {
  //   if (!relativePath) return '';
  //   // '/files'가 포함되어 있으면 제거
  //   if (relativePath.startsWith('/files/')) {
  //     return relativePath.replace('/files', '');
  //   }
  //   return relativePath;
  // };

  // uploadTempPath를 HTTP 접근 가능한 경로로 변환하는 함수
  const uploadTempPathToRelativePath = (uploadTempPath: string) => {
    if (!uploadTempPath) return '';
    // 윈도우 경로를 슬래시로 변환
    const normalized = uploadTempPath.replace(/\\/g, '/');
    // '/temp/' 이후만 추출
    const tempIdx = normalized.indexOf('/temp/');
    if (tempIdx >= 0) {
      return normalized.substring(tempIdx);
    }
    return '';
  };

  const renderPreview = () => {
    const item = editList[currentIdx];
    if (!item) return null;
    // uploadTempPath를 HTTP 경로로 변환
    const url = uploadTempPathToRelativePath(item.uploadTempPath);
    const ext = item.originalFileName?.split('.').pop()?.toLowerCase();
    if (!url) return <div>미리보기 경로 없음</div>;
    if (ext === 'pdf') {
      return (
        <embed
          src={url}
          type="application/pdf"
          className="w-full h-96 rounded border"
        />
      );
    }
    if ([
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'
    ].includes(ext)) {
      return (
        <img
          src={url}
          alt={item.originalFileName}
          className="max-w-full max-h-96 rounded border"
        />
      );
    }
    return <div>미리보기를 지원하지 않는 파일입니다.</div>;
  };

  // 파일 삭제 핸들러 추가
  const handleRemoveFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // UI
  return (
    <div className="px-8 py-6 bg-white">
      <div className="flex items-center mb-4">
        {onBack && (
          <button onClick={onBack} className="mr-2 text-gray-600 hover:text-black">
            <ArrowLeft className="w-[18px] h-[18px]" />
          </button>
        )}
        <h1 className="text-2xl font-bold">차량 등록 (파일 업로드 & OCR)</h1>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl">✕</button>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {step === 'upload' && (
        <div className="w-full max-w-lg">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col bg-gray-50 w-full">
            <input
              type="file"
              multiple
              accept="application/pdf,image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              파일 선택
            </button>
            <p className="mt-4 text-gray-500">PDF 또는 이미지 파일을 업로드하세요.<br/>여러 개 선택 가능</p>
            {files.length > 0 && (
              <ul className="mt-4 w-full max-w-xs space-y-2">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-white rounded px-2 py-1 shadow border">
                    <span className="text-blue-500">{file.type.startsWith('image') ? '🖼️' : '📄'}</span>
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="text-xs text-gray-400">{(file.size/1024).toFixed(1)}KB</span>
                    <button onClick={() => handleRemoveFile(idx)} className="ml-2 text-gray-400 hover:text-red-500">✕</button>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={handleUpload}
              disabled={loading || files.length === 0}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-medium shadow hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? '업로드 중...' : '업로드'}
            </button>
          </div>
        </div>
      )}
      {step === 'ocr' && (
        <div className="w-full max-w-lg mt-8">
          <div className="mb-4 text-lg font-semibold">업로드 결과 및 미리보기</div>
          <div className="mb-2 text-sm text-gray-600">
            {uploadResult.filter(f => f.success).length}개 성공, {uploadResult.filter(f => !f.success).length}개 실패
          </div>
          <ul className="mb-6 w-full max-w-xs space-y-2">
            {uploadResult.map((file, idx) => (
              <li key={idx} className={`flex items-center gap-2 rounded px-2 py-1 shadow border ${file.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className={`text-xl ${file.success ? 'text-green-600' : 'text-red-500'}`}>{file.success ? '✅' : '❌'}</span>
                <span className="truncate flex-1">{file.originalFileName}</span>
                <span className={`font-semibold ${file.success ? 'text-green-600' : 'text-red-500'}`}>{file.success ? '성공' : '실패'}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleOcr}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition"
          >
            차량정보 불러오기(OCR)
          </button>
        </div>
      )}
      {step === 'review' && editList.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-8 flex-col md:flex-row">
            {/* 좌: 파일 미리보기 */}
            <div className="md:w-1/2 w-full border rounded p-2 flex flex-col items-center justify-center">
              <div className="font-semibold mb-2">첨부파일 미리보기</div>
              {renderPreview()}
            </div>
            {/* 우: OCR 결과 필드별 인풋 */}
            <div className="md:w-1/2 w-full border rounded p-2">
              <div className="font-semibold mb-2">OCR 결과(필드별 검증/수정)</div>
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-2">파일명: {editList[currentIdx].originalFileName}</div>
                {OCR_FIELDS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <label className="w-32 text-sm text-gray-700">{label}</label>
                    <input
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      value={editList[currentIdx][key] ?? ''}
                      onChange={e => handleFieldChange(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">저장(검증완료)</button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            <button onClick={handlePrev} disabled={currentIdx === 0} className="px-3 py-1 bg-gray-200 rounded">이전</button>
            <button onClick={handleNext} disabled={currentIdx === editList.length - 1} className="px-3 py-1 bg-gray-200 rounded">다음</button>
          </div>
        </div>
      )}
    </div>
  );
} 