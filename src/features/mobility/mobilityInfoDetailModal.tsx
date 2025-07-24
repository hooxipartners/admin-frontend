import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import {
  useSaveSingleFile,
  useUploadSingleFile,
  useUpdateMobility,
} from '@/lib/api-hooks'
import { FUEL_TYPE_MAP } from '@/constants/fuelType'
import { MOBILITY_TYPE_MAP } from '@/constants/mobilityType'
import { BUSINESS_TYPE_MAP } from '@/constants/businessType'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import Select from '@/components/ui/select'
import InputFile from '@/components/ui/input-file';
import { uploadSingleFile, saveSingleFile } from '@/lib/api';
import { Button } from '@/components/ui/button'
import { X} from 'lucide-react'

interface Props {
  mobilityId: number
  onClose: () => void
}

// 날짜 포맷 변환 함수
const toDashDate = (str: string) =>
  str && str.length === 8
    ? `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`
    : str
const toYYYYMMDD = (str: string) => str?.replace(/-/g, '')

const MobilityInfoDetailModal: React.FC<Props> = ({ mobilityId, onClose }) => {
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
  const [mobilityType, setMobilityType] = React.useState<string[]>(['A'])
  const [fuelType, setFuelType] = React.useState(data?.fuelType || '')
  const [businessType, setBusinessType] = React.useState<string[]>(['A'])

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
  const [project, setProject] = React.useState(data?.project || '');

  // 파일 변경 플래그
  const [carRegChanged, setCarRegChanged] = React.useState(false);
  const [exportChanged, setExportChanged] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setMobilityType(['A']);
      setFuelType(data.fuelType);
      setBusinessType(['A']);
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
      setProject(data.project || '');
      // 자동차등록증 파일 세팅
      const carRegFile = data.files?.find((f: any) => (f.fileType === 'mobility' || f.fileTypeName === 'mobility'));
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
  const handleCarRegFileChange = async (file: File) => {
    const res = await uploadSingleFile(file);
    setCarRegUpload(res.data);
    setCarRegChanged(true);
  };
  const handleExportFileChange = async (file: File) => {
    const res = await uploadSingleFile(file);
    setExportUpload(res.data);
    setExportChanged(true);
  };

  // 파일 저장(저장 버튼 클릭 시)
  const handleSave = async () => {
    let carRegFileRes = null;
    let exportFileRes = null;
    let files = [];
    if (carRegChanged && carRegUpload) {
      carRegFileRes = await saveSingleFile({
        uploadDirPath: 'mobility',
        ...carRegUpload,
      });
      if (carRegFileRes?.data?.attachFileId) {
        files.push({
          attachFileId: carRegFileRes.data.attachFileId,
          fileType: 'mobility',
          file: carRegFileRes.data,
        });
      }
    }
    if (exportChanged && exportUpload) {
      exportFileRes = await saveSingleFile({
        uploadDirPath: 'mobility',
        ...exportUpload,
      });
      if (exportFileRes?.data?.attachFileId) {
        files.push({
          attachFileId: exportFileRes.data.attachFileId,
          fileType: 'EXPORT_DELETE_CERT',
          file: exportFileRes.data,
        });
      }
    }

    // 2. 차량 정보 업데이트
    const updateData = {
      mobilityId,
      mobilityNo,
      model,
      year,
      vin,
      length: Number(length),
      width: Number(width),
      height: Number(height),
      totalWeight: Number(totalWeight),
      passengerCapacity: Number(passengerCapacity),
      mobilityReleasePrice: Number(mobilityReleasePrice),
      mobilityRegDate: toYYYYMMDD(mobilityRegDate),
      fuelType,
      mobilityType: mobilityType[0],
      businessType: businessType[0],
      project,
      files,
    }

    try {
      await updateMobilityMutation.mutateAsync({ id: updateData.mobilityId, data: updateData })
      onClose()
    } catch (error) {
      console.error('Update failed:', error)
    }
    // 저장 후 변경 플래그 초기화
    setCarRegChanged(false);
    setExportChanged(false);
  }

  // 파일 삭제 핸들러
  const handleDeleteCarReg = () => setCarRegUpload(null)
  const handleDeleteExport = () => setExportUpload(null)

  if (isLoading) return <div>로딩중...</div>
  if (error) return <div>에러 발생</div>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#b2bfd2]/60">
      <div className="relative w-[520px] h-full bg-white rounded-[20px] shadow-xl flex flex-col p-6 overflow-y-auto">
        {/* 상단 타이틀/닫기 */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-medium text-[#344051] leading-7">차량 상세정보</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-[#F8F9FA] rounded-lg flex justify-center items-center gap-2 hover:bg-[#E9ECEF]"
          >
            <X className="w-4 h-4 text-[#6C757D]" />
          </button>
        </div>

        {/* 폼 컨테이너 */}
        <div className="flex flex-col gap-6">
          {/* 첫 번째 행: 차량번호, 사업구분, 프로젝트 */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">차량번호</label>
              <Input
                value={mobilityNo}
                onChange={(e) => setMobilityNo(e.target.value)}
                placeholder="차량번호"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">사업구분</label>
              <Select
                options={Object.entries(BUSINESS_TYPE_MAP).map(([key, value]) => ({
                  value: key,
                  label: value,
                }))}
                value={businessType[0]}
                onValueChange={(value) => setBusinessType([value])}
                placeholder="사업구분 선택"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">프로젝트</label>
              <Input
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="프로젝트"
                className="pl-3 pr-2.5 py-2 bg-[#F8F9FA] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
          </div>

          {/* 두 번째 행: 차대번호, 모델명 */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">차대번호</label>
              <Input
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="차대번호"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">모델명</label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="모델명"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
          </div>

          {/* 세 번째 행: 차량유형, 연식, 연료, 승차정원 */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">차량유형</label>
              <Select
                options={Object.entries(MOBILITY_TYPE_MAP).map(([key, value]) => ({
                  value: key,
                  label: value,
                }))}
                value={mobilityType[0]}
                onValueChange={(value) => setMobilityType([value])}
                placeholder="차량유형 선택"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">연식</label>
              <Select
                options={Array.from({ length: 30 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return { value: year.toString(), label: year.toString() };
                })}
                value={year}
                onValueChange={(value) => setYear(value)}
                placeholder="연식 선택"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">연료</label>
              <Select
                options={Object.entries(FUEL_TYPE_MAP).map(([key, value]) => ({
                  value: key,
                  label: value,
                }))}
                value={fuelType}
                onValueChange={(value) => setFuelType(value)}
                placeholder="연료 선택"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">승차정원</label>
              <Input
                value={passengerCapacity}
                onChange={(e) => setPassengerCapacity(e.target.value)}
                placeholder="승차정원"
                type="number"
                suffix="인승"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
          </div>

          {/* 네 번째 행: 차량등록일, 차량출고가 */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">차량등록일</label>
              <InputDate
                value={mobilityRegDate}
                onChange={handleDateChange}
                placeholder="YYYY-MM-DD"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">차량출고가</label>
              <Input
                value={mobilityReleasePrice}
                onChange={(e) => setMobilityReleasePrice(e.target.value)}
                placeholder="차량출고가"
                type="number"
                suffix="원"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
          </div>

          {/* 다섯 번째 행: 길이, 너비, 높이, 중량 */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">길이</label>
              <Input
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="길이"
                type="number"
                suffix="mm"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">너비</label>
              <Input
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="너비"
                type="number"
                suffix="mm"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">높이</label>
              <Input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="높이"
                type="number"
                suffix="mm"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">중량</label>
              <Input
                value={totalWeight}
                onChange={(e) => setTotalWeight(e.target.value)}
                placeholder="중량"
                type="number"
                suffix="kg"
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
          </div>

          {/* 파일 업로드 섹션 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#344051] leading-tight">자동차등록증</label>
            <InputFile
              label=""
              value={carRegUpload ? { name: carRegUpload.originalFileName } : null}
              onChange={handleCarRegFileChange}
              onDelete={handleDeleteCarReg}
              placeholder="파일을 업로드해주세요."
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#344051] leading-tight">수출/자진말소증명서</label>
            <InputFile
              label=""
              value={exportUpload ? { name: exportUpload.originalFileName } : null}
              onChange={handleExportFileChange}
              onDelete={handleDeleteExport}
              placeholder="파일을 업로드해주세요."
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto pt-6">
          <Button 
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#141c25] text-[#F9FAFB] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] text-sm font-medium leading-tight hover:bg-[#0f1419]"
          >
            수정
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MobilityInfoDetailModal 