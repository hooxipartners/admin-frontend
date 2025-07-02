import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import {
  useSaveSingleFile,
  useUploadSingleFile,
  useUpdateMobility,
} from '@/lib/api-hooks'
import { BUSINESS_TYPE_MAP } from '@/constants/businessType'
import { FUEL_TYPE_MAP } from '@/constants/fuelType'
import { MOBILITY_TYPE_MAP } from '@/constants/mobilityType'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  mobilityId: number
  onClose: () => void
}

const formatNumber = (num?: number | string) =>
  num ? (num.toLocaleString?.() ?? String(num)) : '-'

// 날짜 포맷 변환 함수
const toDashDate = (str: string) =>
  str && str.length === 8
    ? `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`
    : str
const toYYYYMMDD = (str: string) => str?.replace(/-/g, '')

const VechicleInfoDetailModal: React.FC<Props> = ({ mobilityId, onClose }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['mobilityDetail', mobilityId],
    queryFn: async () => {
      const res = await apiClient.get(`/mobility/detail/${mobilityId}`)
      return res.data.data
    },
    enabled: !!mobilityId,
  })

  const uploadMutation = useUploadSingleFile()
  const saveMutation = useSaveSingleFile()
  const updateMobilityMutation = useUpdateMobility()

  // 파일 업로드 상태
  const [carRegUpload, setCarRegUpload] = React.useState<any>(null)
  const [carRegFileInput, setCarRegFileInput] =
    React.useState<HTMLInputElement | null>(null)
  const [exportUpload, setExportUpload] = React.useState<any>(null)
  const [exportFileInput, setExportFileInput] =
    React.useState<HTMLInputElement | null>(null)

  // 차량유형, 연료 수정 상태
  const [mobilityType, setMobilityType] = React.useState(
    data?.mobilityType || ''
  )
  const [fuelType, setFuelType] = React.useState(data?.fuelType || '')
  const [businessType, setBusinessType] = React.useState(
    data?.businessType || ''
  )

  // 차량등록일 상태 추가
  const [mobilityRegDate, setMobilityRegDate] = React.useState(
    data?.mobilityRegDate || ''
  )

  // 상태 선언 (이미 선언된 것 제외)
  const [mobilityNo, setMobilityNo] = React.useState(data?.mobilityNo || '');
  const [model, setModel] = React.useState(data?.model || '');
  const [year, setYear] = React.useState(data?.year || '');
  const [vin, setVin] = React.useState(data?.vin || '');
  const [length, setLength] = React.useState(data?.length || '');
  const [width, setWidth] = React.useState(data?.width || '');
  const [height, setHeight] = React.useState(data?.height || '');
  const [totalWeight, setTotalWeight] = React.useState(data?.totalWeight || '');
  const [passengerCapacity, setPassengerCapacity] = React.useState(data?.passengerCapacity || '');
  const [mobilityReleasePrice, setMobilityReleasePrice] = React.useState(data?.mobilityReleasePrice || '');

  // 배터리 정보 상태 추가
  const [batteryType, setBatteryType] = React.useState('');
  const [batteryCapacity, setBatteryCapacity] = React.useState('');

  // dirty 상태 비교
  const isMobilityNoDirty = mobilityNo !== data?.mobilityNo;
  const isBusinessTypeDirty = businessType !== data?.businessType;
  const isVinDirty = vin !== data?.vin;
  const isModelDirty = model !== data?.model;
  const isMobilityTypeDirty = mobilityType !== data?.mobilityType;
  const isYearDirty = year !== data?.year;
  const isPassengerCapacityDirty = String(passengerCapacity) !== String(data?.passengerCapacity);
  const isFuelTypeDirty = fuelType !== data?.fuelType;
  const isMobilityRegDateDirty = toYYYYMMDD(mobilityRegDate) !== data?.mobilityRegDate;
  const isMobilityReleasePriceDirty = String(mobilityReleasePrice) !== String(data?.mobilityReleasePrice);
  const isLengthDirty = String(length) !== String(data?.length);
  const isWidthDirty = String(width) !== String(data?.width);
  const isHeightDirty = String(height) !== String(data?.height);
  const isTotalWeightDirty = String(totalWeight) !== String(data?.totalWeight);
  // 파일 dirty 비교
  const isCarRegDirty = !!carRegUpload && carRegUpload.originalFileName !== data?.files?.find((f: any) => (f.fileType === 'VEHICLE_REG' || f.fileTypeName === 'VEHICLE_REG'))?.file?.originalFileName;
  const isExportDirty = !!exportUpload && exportUpload.originalFileName !== data?.files?.find((f: any) => (f.fileType === 'EXPORT_DELETE_CERT' || f.fileTypeName === 'EXPORT_DELETE_CERT'))?.file?.originalFileName;

  const isAnyDirty = [
    isMobilityNoDirty,
    isBusinessTypeDirty,
    isVinDirty,
    isModelDirty,
    isMobilityTypeDirty,
    isYearDirty,
    isPassengerCapacityDirty,
    isFuelTypeDirty,
    isMobilityRegDateDirty,
    isMobilityReleasePriceDirty,
    isLengthDirty,
    isWidthDirty,
    isHeightDirty,
    isTotalWeightDirty,
    isCarRegDirty,
    isExportDirty,
  ].some(Boolean);

  React.useEffect(() => {
    if (data) {
      setMobilityType(data.mobilityType);
      setFuelType(data.fuelType);
      setBusinessType(data.businessType);
      setMobilityRegDate(toDashDate(data.mobilityRegDate || ''));
      setMobilityNo(data.mobilityNo || '');
      setModel(data.model || '');
      setYear(data.year || '');
      setVin(data.vin || '');
      setLength(data.length || '');
      setWidth(data.width || '');
      setHeight(data.height || '');
      setTotalWeight(data.totalWeight || '');
      setPassengerCapacity(data.passengerCapacity || '');
      setMobilityReleasePrice(data.mobilityReleasePrice || '');
      // 자동차등록증 파일 세팅
      const carRegFile = data.files?.find((f: any) => (f.fileType === 'VEHICLE_REG' || f.fileTypeName === 'VEHICLE_REG'));
      if (carRegFile && carRegFile.file) {
        setCarRegUpload({
          originalFileName: carRegFile.file.originalFileName,
          storedFileName: carRegFile.file.storedFileName,
          uploadTempPath: carRegFile.file.uploadTempPath,
          fileSizeByte: carRegFile.file.fileSizeByte,
        });
      } else {
        setCarRegUpload(null);
      }
      // 수출/자진말소증명서 파일 세팅
      const exportFile = data.files?.find((f: any) => (f.fileType === 'EXPORT_DELETE_CERT' || f.fileTypeName === 'EXPORT_DELETE_CERT'));
      if (exportFile && exportFile.file) {
        setExportUpload({
          originalFileName: exportFile.file.originalFileName,
          storedFileName: exportFile.file.storedFileName,
          uploadTempPath: exportFile.file.uploadTempPath,
          fileSizeByte: exportFile.file.fileSizeByte,
        });
      } else {
        setExportUpload(null);
      }
    }
  }, [data]);

  // 차량등록일 onChange 핸들러 (e.target.value만 사용)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobilityRegDate(e.target.value)
  }

  // 파일 업로드 핸들러
  const handleCarRegFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await uploadMutation.mutateAsync(file)
    setCarRegUpload(res.data) // 업로드 결과 저장
  }
  const handleExportFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await uploadMutation.mutateAsync(file)
    setExportUpload(res.data)
  }

  // 파일 저장(저장 버튼 클릭 시)
  const handleSaveFiles = async () => {
    // 1. 파일 저장(자동차등록증, 수출/자진말소증명서)
    let files: Array<any> = [];

    // 자동차등록증 파일 저장
    let carRegFileRes = null;
    if (carRegUpload) {
      carRegFileRes = await saveMutation.mutateAsync({
        uploadDirPath: 'mobility',
        originalFileName: carRegUpload.originalFileName,
        storedFileName: carRegUpload.storedFileName,
        uploadTempPath: carRegUpload.uploadTempPath,
        fileSizeByte: carRegUpload.fileSizeByte,
      });
      if (carRegFileRes?.data?.attachFileId) {
        files.push({
          attachFileId: carRegFileRes.data.attachFileId,
          file: {
            fileType: 'VEHICLE_REG',
            uploadDirPath: 'mobility',
            originalFileName: carRegFileRes.data.originalFileName,
            storedFileName: carRegFileRes.data.storedFileName,
            uploadTempPath: carRegFileRes.data.uploadTempPath || carRegUpload.uploadTempPath,
            fileSizeByte: carRegFileRes.data.fileSizeByte,
          },
        });
      }
    }

    // 수출/자진말소증명서 파일 저장
    let exportFileRes = null;
    if (exportUpload) {
      exportFileRes = await saveMutation.mutateAsync({
        uploadDirPath: 'mobility',
        originalFileName: exportUpload.originalFileName,
        storedFileName: exportUpload.storedFileName,
        uploadTempPath: exportUpload.uploadTempPath,
        fileSizeByte: exportUpload.fileSizeByte,
      });
      if (exportFileRes?.data?.attachFileId) {
        files.push({
          attachFileId: exportFileRes.data.attachFileId,
          fileType: 'EXPORT_DELETE_CERT',
          file: {
            uploadDirPath: 'mobility',
            originalFileName: exportFileRes.data.originalFileName,
            storedFileName: exportFileRes.data.storedFileName,
            uploadTempPath: exportFileRes.data.uploadTempPath || exportUpload.uploadTempPath,
            fileSizeByte: exportFileRes.data.fileSizeByte,
          },
        });
      }
    }

    // 2. 차량 정보 수정 payload 생성
    const payload = {
      mobilityId: data.mobilityId,
      mobilityNo,
      businessType,
      vin,
      model,
      mobilityType,
      year,
      passengerCapacity,
      fuelType,
      mobilityRegDate: toYYYYMMDD(mobilityRegDate),
      mobilityReleasePrice,
      length,
      width,
      height,
      totalWeight,
      files,
    };

    // 3. 변경사항이 있을 때만 차량 정보 저장 API 호출
    const isChanged =
      mobilityNo !== data.mobilityNo ||
      businessType !== data.businessType ||
      vin !== data.vin ||
      model !== data.model ||
      mobilityType !== data.mobilityType ||
      year !== data.year ||
      String(passengerCapacity) !== String(data.passengerCapacity) ||
      fuelType !== data.fuelType ||
      toYYYYMMDD(mobilityRegDate) !== data.mobilityRegDate ||
      String(mobilityReleasePrice) !== String(data.mobilityReleasePrice) ||
      String(length) !== String(data.length) ||
      String(width) !== String(data.width) ||
      String(height) !== String(data.height) ||
      String(totalWeight) !== String(data.totalWeight) ||
      files.length > 0;
    if (isChanged) {
      await updateMobilityMutation.mutateAsync({ id: data.mobilityId, data: payload });
    }
    onClose?.();
  }

  // 파일 삭제
  const handleDeleteCarReg = () => setCarRegUpload(null)
  const handleDeleteExport = () => setExportUpload(null)

  if (isLoading)
    return (
      <div className='flex h-full items-center justify-center'>로딩중...</div>
    )
  if (error || !data)
    return (
      <div className='flex h-full items-center justify-center'>
        데이터를 불러올 수 없습니다.
      </div>
    )

  //const files = data.files || []
  // const carRegFile = files.find((f: any) => f.fileType === 'VEHICLE_REG')
  // const exportFile = files.find((f: any) => f.fileType === 'EXPORT_DELETE_CERT')

  return (
    <div className='fixed inset-0 z-50 flex'>
      <div
        className='fixed inset-0 bg-[#334f6f]/50 backdrop-blur-[1px]'
        onClick={onClose}
      />
      <div className='animate-slide-in-right fixed top-0 right-0 z-50 flex h-full w-full max-w-[540px] flex-col overflow-y-auto rounded-l-2xl border-l border-[#e4e7ec] bg-white p-0 shadow-xl'>
        <div className='flex min-h-full flex-col gap-10 rounded-2xl bg-white px-6 py-8'>
          <div className='flex items-center justify-between'>
            <div className='text-xl font-medium text-[#141c25]'>
              차량 상세정보
            </div>
            <button
              className='flex items-center justify-center rounded-lg bg-[#f2f4f7] p-2'
              onClick={onClose}
            >
              <svg
                width={16}
                height={16}
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4.50488 11.4951L7.99998 7.99998M7.99998 7.99998L11.4951 4.50488M7.99998 7.99998L4.50488 4.50488M7.99998 7.99998L11.4951 11.4951'
                  stroke='#141C25'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
          {/* ALERT 영역 */}
          {isAnyDirty && (
            <div className="self-stretch p-4 bg-[#FFF0F0] rounded-xl inline-flex flex-col justify-start items-start gap-1">
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 flex justify-start items-start gap-2">
                  <div className="pt-0.5 flex justify-start items-center">
                    {/* 왼쪽 SVG: 빨간 원+느낌표 */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V13C11.25 13.4142 11.5858 13.75 12 13.75C12.4142 13.75 12.75 13.4142 12.75 13V7ZM12.5675 17.5006C12.8446 17.1927 12.8196 16.7185 12.5117 16.4414C12.2038 16.1643 11.7296 16.1893 11.4525 16.4972L11.4425 16.5083C11.1654 16.8162 11.1904 17.2904 11.4983 17.5675C11.8062 17.8446 12.2804 17.8196 12.5575 17.5117L12.5675 17.5006Z" fill="#FF4D4D"/>
                    </svg>
                  </div>
                  <div className="flex-1 flex justify-start items-center gap-3">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch justify-start text-[#FF4C4C] text-xl font-medium">기존 데이터와 다른 값이 존재합니다.</div>
                      <div className="self-stretch justify-start text-[#FF4C4C] text-base font-normal">데이터를 수정하고 저장해주세요.</div>
                    </div>
                  </div>
                </div>
                <div className="w-6 h-6 relative overflow-hidden cursor-pointer" onClick={onClose}>
                  {/* 오른쪽 X SVG */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.75781 17.2426L12.0005 12M12.0005 12L17.2431 6.75732M12.0005 12L6.75781 6.75732M12.0005 12L17.2431 17.2426" stroke="#344051" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}
          <div className='flex flex-col gap-6'>
            <div className='flex gap-5'>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차량번호
                </label>
                <Input
                  value={mobilityNo}
                  onChange={e => setMobilityNo(e.target.value)}
                  className={`rounded-[10px] border ${isMobilityNoDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#344051]`}
                />
                {isMobilityNoDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.mobilityNo}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  사업구분
                </label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className={`rounded-[10px] border ${isBusinessTypeDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]`}>
                    <SelectValue>
                      {BUSINESS_TYPE_MAP[businessType] || businessType}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BUSINESS_TYPE_MAP).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isBusinessTypeDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {BUSINESS_TYPE_MAP[data?.businessType] || data?.businessType}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  프로젝트
                </label>
                <Input
                  value={data.projectName || ''}
                  disabled
                  placeholder="프로젝트명"
                  className="rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#637083] shadow-xs !border-[#e4e7ec] !bg-white"
                />
              </div>
            </div>
            <div className='flex gap-5'>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차대번호
                </label>
                <Input
                  value={vin}
                  onChange={e => setVin(e.target.value)}
                  className={`rounded-[10px] border ${isVinDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]`}
                />
                {isVinDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.vin}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  모델명
                </label>
                <Input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className={`rounded-[10px] border ${isModelDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]`}
                />
                {isModelDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.model}</div>
                )}
              </div>
            </div>
            <div className='flex gap-5'>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차량유형
                </label>
                <Select value={mobilityType} onValueChange={setMobilityType}>
                  <SelectTrigger className={`rounded-[10px] border ${isMobilityTypeDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]`}>
                    <SelectValue>
                      {MOBILITY_TYPE_MAP[mobilityType] || mobilityType}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MOBILITY_TYPE_MAP).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isMobilityTypeDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {MOBILITY_TYPE_MAP[data?.mobilityType] || data?.mobilityType}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  연식
                </label>
                <Input
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className={`rounded-[10px] border ${isYearDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]`}
                />
                {isYearDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.year}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  연료
                </label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger className={`rounded-[10px] border ${isFuelTypeDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]`}>
                    <SelectValue>
                      {FUEL_TYPE_MAP[fuelType] || fuelType}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FUEL_TYPE_MAP).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isFuelTypeDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {FUEL_TYPE_MAP[data?.fuelType] || data?.fuelType}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  승차정원
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(passengerCapacity)}
                    onChange={e => setPassengerCapacity(e.target.value)}
                    className={`rounded-[10px] border ${isPassengerCapacityDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]`}
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    인승
                  </span>
                </div>
                {isPassengerCapacityDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.passengerCapacity}</div>
                )}
              </div>
            </div>
            {/* 연료가 전기일 때만 배터리 정보 노출 */}
            {fuelType === 'ELECTRIC' && (
              <div className='flex gap-5'>
                <div className='flex flex-1 flex-col gap-2'>
                  <label className='text-sm font-medium text-[#141c25]'>배터리종류</label>
                  <Input
                    value={batteryType}
                    onChange={e => setBatteryType(e.target.value)}
                    placeholder='배터리종류'
                    className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]'
                  />
                </div>
                <div className='flex flex-1 flex-col gap-2'>
                  <label className='text-sm font-medium text-[#141c25]'>배터리용량</label>
                  <div className='relative'>
                    <Input
                      value={batteryCapacity}
                      onChange={e => setBatteryCapacity(e.target.value)}
                      placeholder='배터리용량'
                      className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]'
                    />
                    <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium' style={{ color: '#97A1AF' }}>Kwh</span>
                  </div>
                </div>
              </div>
            )}
            <div className='flex gap-5'>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차량등록일
                </label>
                <InputDate
                  value={mobilityRegDate}
                  onChange={handleDateChange}
                  className={`rounded-[10px] border ${isMobilityRegDateDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white text-sm`}
                />
                {isMobilityRegDateDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {toDashDate(data?.mobilityRegDate || '')}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차량출고가
                </label>
                <div className='flex items-center gap-1'>
                  <Input
                    value={formatNumber(mobilityReleasePrice)}
                    onChange={e => setMobilityReleasePrice(e.target.value)}
                    className={`rounded-[10px] border ${isMobilityReleasePriceDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]`}
                  />
                  <span className='ml-1 text-sm text-[#97a1af]'>원</span>
                </div>
                {isMobilityReleasePriceDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.mobilityReleasePrice}</div>
                )}
              </div>
            </div>
            <div className='flex gap-5'>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  길이
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(length)}
                    onChange={e => setLength(e.target.value)}
                    className={`rounded-[10px] border ${isLengthDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]`}
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    mm
                  </span>
                </div>
                {isLengthDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.length}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  너비
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(width)}
                    onChange={e => setWidth(e.target.value)}
                    className={`rounded-[10px] border ${isWidthDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]`}
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    mm
                  </span>
                </div>
                {isWidthDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.width}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  높이
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(height)}
                    onChange={e => setHeight(e.target.value)}
                    className={`rounded-[10px] border ${isHeightDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]`}
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    mm
                  </span>
                </div>
                {isHeightDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.height}</div>
                )}
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  중량
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(totalWeight)}
                    onChange={e => setTotalWeight(e.target.value)}
                    className={`rounded-[10px] border ${isTotalWeightDirty ? 'border-[#FF4C4C]' : 'border-[#e4e7ec]'} bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]`}
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    kg
                  </span>
                </div>
                {isTotalWeightDirty && (
                  <div style={{ color: '#FF4C4C', fontSize: 13, marginTop: 2 }}>기존 데이터 : {data?.totalWeight}</div>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-[#141c25]'>
                자동차등록증
              </label>
              <div className='flex items-center gap-2 rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3'>
                {carRegUpload ? (
                  <>
                    {/* PDF 아이콘 SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.38379 0.5H13.6504L21.6533 7.93164V21.5996C21.6533 22.6228 20.7677 23.4998 19.6152 23.5H4.38379C3.23137 23.4998 2.3457 22.6228 2.3457 21.5996V2.40039C2.3457 1.37721 3.23137 0.500191 4.38379 0.5Z" fill="white" stroke="#E4E7EC"/>
                      <path d="M5.50848 15.8572V10.7663H7.41757C7.80867 10.7663 8.13679 10.8392 8.40194 10.985C8.66875 11.1309 8.8701 11.3314 9.00599 11.5866C9.14354 11.8401 9.21231 12.1285 9.21231 12.4516C9.21231 12.7781 9.14354 13.0681 9.00599 13.3217C8.86845 13.5752 8.66544 13.7749 8.39697 13.9207C8.12851 14.0649 7.7979 14.137 7.40514 14.137H6.13987V13.3788H7.28085C7.50954 13.3788 7.69681 13.3391 7.84264 13.2595C7.98847 13.18 8.09619 13.0706 8.16579 12.9314C8.23705 12.7922 8.27268 12.6323 8.27268 12.4516C8.27268 12.271 8.23705 12.1119 8.16579 11.9744C8.09619 11.8368 7.98765 11.7299 7.84015 11.6537C7.69432 11.5758 7.50623 11.5369 7.27588 11.5369H6.43071V15.8572H5.50848ZM11.7385 15.8572H10.0134V10.7663H11.7733C12.2787 10.7663 12.7129 10.8682 13.0759 11.072C13.4404 11.2742 13.7205 11.565 13.9161 11.9445C14.1116 12.324 14.2094 12.7781 14.2094 13.3068C14.2094 13.8371 14.1108 14.2928 13.9136 14.6739C13.718 15.0551 13.4355 15.3476 13.0659 15.5514C12.698 15.7553 12.2555 15.8572 11.7385 15.8572ZM10.9356 15.0592H11.6938C12.0484 15.0592 12.3442 14.9946 12.5812 14.8653C12.8182 14.7344 12.9963 14.5397 13.1156 14.2812C13.235 14.021 13.2946 13.6962 13.2946 13.3068C13.2946 12.9173 13.235 12.5942 13.1156 12.3373C12.9963 12.0788 12.8198 11.8857 12.5862 11.7581C12.3542 11.6288 12.0658 11.5642 11.7211 11.5642H10.9356V15.0592ZM15.0856 15.8572V10.7663H18.347V11.5394H16.0079V12.9215H18.1233V13.6945H16.0079V15.8572H15.0856Z" fill="#344051"/>
                      <path d="M13.8457 4.74725V0L22.1534 7.71429H17.041C15.2763 7.71429 13.8457 6.3859 13.8457 4.74725Z" fill="url(#paint0_radial_661_12994)"/>
                      <defs>
                        <radialGradient id="paint0_radial_661_12994" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.9995 1.92857) rotate(90) scale(5.78571 6.23077)">
                          <stop stop-color="#E4E7EC"/>
                          <stop offset="1" stop-color="#CED2DA"/>
                        </radialGradient>
                      </defs>
                    </svg>
                    <span className='text-sm font-medium text-[#344051]'>
                      {carRegUpload.originalFileName}
                    </span>
                    <button
                      className='ml-auto'
                      title='삭제'
                      onClick={handleDeleteCarReg}
                    >
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M18.3337 10.0001C18.3337 14.6025 14.6027 18.3334 10.0003 18.3334C5.39795 18.3334 1.66699 14.6025 1.66699 10.0001C1.66699 5.39771 5.39795 1.66675 10.0003 1.66675C14.6027 1.66675 18.3337 5.39771 18.3337 10.0001ZM7.36961 6.48549C7.12554 6.24141 6.72981 6.24141 6.48573 6.48549C6.24165 6.72956 6.24165 7.12529 6.48573 7.36937L9.23415 10.1178L6.48573 12.8662C6.24165 13.1103 6.24165 13.506 6.48573 13.7501C6.72981 13.9942 7.12554 13.9942 7.36961 13.7501L10.118 11.0017L12.8664 13.7501C13.1105 13.9942 13.5062 13.9942 13.7503 13.7501C13.9944 13.506 13.9944 13.1103 13.7503 12.8662L11.0019 10.1178L13.7503 7.36937C13.9944 7.12529 13.9944 6.72956 13.7503 6.48549C13.5062 6.24141 13.1105 6.24141 12.8664 6.48549L10.118 9.2339L7.36961 6.48549Z'
                          fill='#CED2DA'
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <span className='text-sm font-medium text-[#b0b7c3]'>
                      파일을 업로드해주세요.
                    </span>
                    <button
                      className='ml-auto'
                      title='업로드'
                      onClick={() => carRegFileInput?.click()}
                    >
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M5 16.6666L15 16.6666M10 13.3333V3.33325M10 3.33325L12.9167 6.24992M10 3.33325L7.08333 6.24992'
                          stroke='#637083'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                    <input
                      type='file'
                      accept='application/pdf'
                      style={{ display: 'none' }}
                      ref={setCarRegFileInput}
                      onChange={handleCarRegFileChange}
                    />
                  </>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-[#141c25]'>
                수출/자진말소증명서
              </label>
              <div className='flex items-center gap-2 rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3'>
                {exportUpload ? (
                  <>
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='mr-2'
                    >
                      <path
                        d='M4.38379 0.5H13.6504L21.6533 7.93164V21.5996C21.6533 22.6228 20.7677 23.4998 19.6152 23.5H4.38379C3.23137 23.4998 2.3457 22.6228 2.3457 21.5996V2.40039C2.3457 1.37721 3.23137 0.500191 4.38379 0.5Z'
                        fill='white'
                        stroke='#E4E7EC'
                      />
                      <path
                        d='M13.8457 4.74725V0L22.1534 7.71429H17.041C15.2763 7.71429 13.8457 6.3859 13.8457 4.74725Z'
                        fill='url(#paint0_radial_629_12994)'
                      />
                      <defs>
                        <radialGradient
                          id='paint0_radial_629_12994'
                          cx='0'
                          cy='0'
                          r='1'
                          gradientUnits='userSpaceOnUse'
                          gradientTransform='translate(17.9995 1.92857) rotate(90) scale(5.78571 6.23077)'
                        >
                          <stop stopColor='#E4E7EC' />
                          <stop offset='1' stopColor='#CED2DA' />
                        </radialGradient>
                      </defs>
                    </svg>
                    <span className='text-sm font-medium text-[#344051]'>
                      {exportUpload.originalFileName}
                    </span>
                    <button
                      className='ml-auto'
                      title='삭제'
                      onClick={handleDeleteExport}
                    >
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M18.3337 10.0001C18.3337 14.6025 14.6027 18.3334 10.0003 18.3334C5.39795 18.3334 1.66699 14.6025 1.66699 10.0001C1.66699 5.39771 5.39795 1.66675 10.0003 1.66675C14.6027 1.66675 18.3337 5.39771 18.3337 10.0001ZM7.36961 6.48549C7.12554 6.24141 6.72981 6.24141 6.48573 6.48549C6.24165 6.72956 6.24165 7.12529 6.48573 7.36937L9.23415 10.1178L6.48573 12.8662C6.24165 13.1103 6.24165 13.506 6.48573 13.7501C6.72981 13.9942 7.12554 13.9942 7.36961 13.7501L10.118 11.0017L12.8664 13.7501C13.1105 13.9942 13.5062 13.9942 13.7503 13.7501C13.9944 13.506 13.9944 13.1103 13.7503 12.8662L11.0019 10.1178L13.7503 7.36937C13.9944 7.12529 13.9944 6.72956 13.7503 6.48549C13.5062 6.24141 13.1105 6.24141 12.8664 6.48549L10.118 9.2339L7.36961 6.48549Z'
                          fill='#CED2DA'
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <span className='text-sm font-medium text-[#b0b7c3]'>
                      파일을 업로드해주세요.
                    </span>
                    <button
                      className='ml-auto'
                      title='업로드'
                      onClick={() => exportFileInput?.click()}
                    >
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M5 16.6666L15 16.6666M10 13.3333V3.33325M10 3.33325L12.9167 6.24992M10 3.33325L7.08333 6.24992'
                          stroke='#637083'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                    <input
                      type='file'
                      accept='application/pdf'
                      style={{ display: 'none' }}
                      ref={setExportFileInput}
                      onChange={handleExportFileChange}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='absolute bottom-8 left-6'>
            <div
              data-color='Default Gray'
              data-icon-end='false'
              data-icon-only='False'
              data-icon-start='false'
              data-size='Small'
              data-state='Default'
              data-style='Filled'
              className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#141c25] px-5 py-2.5 shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)]'
              onClick={handleSaveFiles}
            >
              <div className="justify-start text-center font-['Inter'] text-sm leading-tight font-medium text-white">
                수정
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VechicleInfoDetailModal