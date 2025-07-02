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
          <div className='flex flex-col gap-6'>
            <div className='flex gap-5'>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차량번호
                </label>
                <Input
                  value={mobilityNo}
                  onChange={e => setMobilityNo(e.target.value)}
                  className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#344051]'
                />
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  사업구분
                </label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]'>
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
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  프로젝트
                </label>
                <Input
                  value={data.projectName}
                  disabled
                  className='rounded-[10px] border border-[#e4e7ec] bg-gray-50 py-2 pr-2 pl-3 text-sm font-medium text-[#637083]'
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
                  className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]'
                />
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  모델명
                </label>
                <Input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]'
                />
              </div>
            </div>
            <div className='flex gap-5'>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차량유형
                </label>
                <Select value={mobilityType} onValueChange={setMobilityType}>
                  <SelectTrigger className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]'>
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
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  연식
                </label>
                <Input
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]'
                />
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  연료
                </label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]'>
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
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  승차정원
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(passengerCapacity)}
                    onChange={e => setPassengerCapacity(e.target.value)}
                    className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]'
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    인승
                  </span>
                </div>
              </div>
            </div>
            <div className='flex gap-5'>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차량등록일
                </label>
                <InputDate
                  value={mobilityRegDate}
                  onChange={handleDateChange}
                  className='rounded-[10px] border border-[#e4e7ec] bg-white text-sm'
                />
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  차량출고가
                </label>
                <div className='flex items-center gap-1'>
                  <Input
                    value={formatNumber(mobilityReleasePrice)}
                    onChange={e => setMobilityReleasePrice(e.target.value)}
                    className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3 text-sm font-medium text-[#141c25]'
                  />
                  <span className='ml-1 text-sm text-[#97a1af]'>원</span>
                </div>
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
                    className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]'
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    mm
                  </span>
                </div>
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  너비
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(width)}
                    onChange={e => setWidth(e.target.value)}
                    className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]'
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    mm
                  </span>
                </div>
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  높이
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(height)}
                    onChange={e => setHeight(e.target.value)}
                    className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]'
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    mm
                  </span>
                </div>
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <label className='text-sm font-medium text-[#141c25]'>
                  중량
                </label>
                <div className='relative'>
                  <Input
                    value={formatNumber(totalWeight)}
                    onChange={e => setTotalWeight(e.target.value)}
                    className='rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#141c25]'
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#97a1af]'>
                    kg
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-[#141c25]'>
                자동차등록증
              </label>
              <div className='flex items-center gap-2 rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-2 pl-3'>
                {carRegUpload ? (
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