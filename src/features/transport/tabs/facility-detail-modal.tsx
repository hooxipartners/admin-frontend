import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import InputFile from '@/components/ui/input-file'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'
import { XIcon, PlusIcon } from '@/components/ui/icons'

interface FacilityDetailModalProps {
  open: boolean
  onClose: () => void
  facilityData?: {
    id: number
    garage: string
    acMeterNo: string
    acMeterYear: string
    chargerNo: string
    chargerYear: string
  }
}

export const FacilityDetailModal: React.FC<FacilityDetailModalProps> = ({
  open,
  onClose,
  facilityData
}) => {
  const [acMeterImage, setAcMeterImage] = useState<File | null>(null)
  const [chargerImage, setChargerImage] = useState<File | null>(null)

  const handleAcMeterImageChange = (file: File) => {
    setAcMeterImage(file)
  }

  const handleChargerImageChange = (file: File) => {
    setChargerImage(file)
  }

  const handleAcMeterImageDelete = () => {
    setAcMeterImage(null)
  }

  const handleChargerImageDelete = () => {
    setChargerImage(null)
  }

  const handleModify = () => {
    console.log('수정 버튼 클릭')
    // 수정 로직 구현
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#b2bfd2]/60">
      <div className="relative w-[520px] h-full bg-white rounded-[20px] shadow-xl flex flex-col p-6">
        {/* 상단 타이틀/닫기 */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-medium text-[#344051] leading-7">설비 상세정보</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-[#F8F9FA] rounded-lg flex justify-center items-center gap-2 hover:bg-[#E9ECEF]"
          >
            <XIcon className="w-4 h-4 text-[#6C757D]" />
          </button>
        </div>

        {/* 폼 컨테이너 */}
        <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
          {/* 차고지 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#344051] leading-tight">
              차고지
            </label>
            <Input
              value={facilityData?.garage || ''}
              readOnly
              className="pl-3 pr-2.5 py-2 bg-[#F8F9FA] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD] text-[#98A2B3]"
            />
          </div>

          <Separator />

          {/* AC전력량계 섹션 */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">
                AC전력량계 제조번호
              </label>
              <Input
                value={facilityData?.acMeterNo || ''}
                readOnly
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">
                제조년월
              </label>
              <InputDate
                value={facilityData?.acMeterYear || ''}
                onChange={() => {}}
                readOnly
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
          </div>

          {/* AC전력량계 이미지 */}
          <div className="flex flex-col gap-2">
            <InputFile
              label="AC전력량계 이미지"
              value={acMeterImage ? { name: acMeterImage.name } : null}
              onChange={handleAcMeterImageChange}
              onDelete={handleAcMeterImageDelete}
              placeholder="파일을 업로드해주세요."
            />
          </div>

          {/* 충전설비 섹션 */}
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">
                충전설비 제조번호
              </label>
              <Input
                value={facilityData?.chargerNo || ''}
                readOnly
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344051] leading-tight">
                충전설비 제조년월
              </label>
              <InputDate
                value={facilityData?.chargerYear || ''}
                onChange={() => {}}
                readOnly
                className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-[#D0D5DD]"
              />
            </div>
          </div>

          {/* 충전설비동판 이미지 */}
          <div className="flex flex-col gap-2">
            <InputFile
              label="충전설비동판 이미지"
              value={chargerImage ? { name: chargerImage.name } : null}
              onChange={handleChargerImageChange}
              onDelete={handleChargerImageDelete}
              placeholder="파일을 업로드해주세요."
            />
          </div>

          {/* 충전설비 추가 버튼 */}
          <Button
            variant="outline"
            className="w-full px-5 py-2.5 bg-[#F8F9FA] rounded-[10px] border-[#D0D5DD] text-[#344051] hover:bg-[#E9ECEF]"
          >
            <PlusIcon className="w-5 h-5" />
            충전설비 추가
          </Button>

          <Separator />

          {/* AC전력량계 추가 버튼 */}
          <Button
            variant="outline"
            className="w-full px-5 py-2.5 bg-[#F8F9FA] rounded-[10px] border-[#D0D5DD] text-[#344051] hover:bg-[#E9ECEF]"
          >
            <PlusIcon className="w-5 h-5" />
            AC전력량계 추가
          </Button>
        </div>

        {/* 하단 수정 버튼 - 고정 위치 */}
        <div className="flex justify-start pt-6 border-t border-[#E4E7EC]">
          <Button
            onClick={handleModify}
            className="px-5 py-2.5 bg-[#344051] text-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] hover:bg-[#2A3441]"
          >
            수정
          </Button>
        </div>
      </div>
    </div>
  )
} 