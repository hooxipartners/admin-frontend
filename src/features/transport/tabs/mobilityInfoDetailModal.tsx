import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import {
  useSaveSingleFile,
  useUploadSingleFile,
  useUpdateMobility,
} from '@/lib/api-hooks'
import { FUEL_TYPE_MAP } from '@/constants/fuelType'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import Select from '@/components/ui/select.tsx'

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
      files,
    }

    try {
      await updateMobilityMutation.mutateAsync({ id: updateData.mobilityId, data: updateData })
      onClose()
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  // 파일 삭제 핸들러
  const handleDeleteCarReg = () => setCarRegUpload(null)
  const handleDeleteExport = () => setExportUpload(null)

  if (isLoading) return <div>로딩중...</div>
  if (error) return <div>에러 발생</div>

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">차량 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-lg font-medium mb-4">기본 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  자동차등록번호
                </label>
                <Input
                  value={mobilityNo}
                  onChange={(e) => setMobilityNo(e.target.value)}
                  placeholder="자동차등록번호"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모델명
                </label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="모델명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연식
                </label>
                <Input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="연식"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  차대번호
                </label>
                <Input
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="차대번호"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연료
                </label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  인승
                </label>
                <Input
                  value={passengerCapacity}
                  onChange={(e) => setPassengerCapacity(e.target.value)}
                  placeholder="인승"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  차량등록일
                </label>
                <InputDate
                  value={mobilityRegDate}
                  onChange={handleDateChange}
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>
          </div>

          {/* 차량 규격 */}
          <div>
            <h3 className="text-lg font-medium mb-4">차량 규격</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  길이 (mm)
                </label>
                <Input
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="길이"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  폭 (mm)
                </label>
                <Input
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="폭"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  높이 (mm)
                </label>
                <Input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="높이"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  총중량 (kg)
                </label>
                <Input
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                  placeholder="총중량"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  출고가 (원)
                </label>
                <Input
                  value={mobilityReleasePrice}
                  onChange={(e) => setMobilityReleasePrice(e.target.value)}
                  placeholder="출고가"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 파일 업로드 */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">파일</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* 자동차등록증 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자동차등록증
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {carRegUpload ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {carRegUpload.originalFileName}
                    </span>
                    <button
                      onClick={handleDeleteCarReg}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <input
                      ref={(el) => setCarRegFileInput(el)}
                      type="file"
                      onChange={handleCarRegFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <button
                      onClick={() => carRegFileInput?.click()}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      파일 선택
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 수출/자진말소증명서 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수출/자진말소증명서
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {exportUpload ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {exportUpload.originalFileName}
                    </span>
                    <button
                      onClick={handleDeleteExport}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <input
                      ref={(el) => setExportFileInput(el)}
                      type="file"
                      onChange={handleExportFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <button
                      onClick={() => exportFileInput?.click()}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      파일 선택
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSaveFiles}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={updateMobilityMutation.isPending}
          >
            {updateMobilityMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobilityInfoDetailModal 