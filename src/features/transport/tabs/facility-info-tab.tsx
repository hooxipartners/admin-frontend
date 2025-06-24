import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FacilityInfoTabProps {
  data: any // TODO: 실제 타입 정의
}

export const FacilityInfoTab = ({ data }: FacilityInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="bg-white">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-[#141c25] leading-6" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
          설비정보
        </h2>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-transparent hover:bg-gray-50 text-[#141c25] border border-[#e4e7ec] px-4 py-2 rounded-lg text-sm font-medium"
          style={{ fontFamily: '"Inter-Medium", sans-serif' }}
        >
          {isEditing ? '저장' : '수정'}
        </Button>
      </div>

      {/* 폼 영역 */}
      <div className="space-y-8">
        {/* 충전기 정보 */}
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              충전기 대수
            </Label>
            <Input
              value="5"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              충전기 제조사
            </Label>
            <Input
              value="SK시그넷"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              충전기 모델명
            </Label>
            <Input
              value="SK-C120"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
        </div>

        {/* 충전소 정보 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              충전소 주소
            </Label>
            <Input
              value="서울특별시 영등포구 의사당대로 83"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              설치일자
            </Label>
            <Input
              value="2024-01-15"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
        </div>

        {/* 운영 정보 */}
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              운영 시간
            </Label>
            <Input
              value="24시간"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              관리업체
            </Label>
            <Input
              value="SK시그넷"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              관리업체 연락처
            </Label>
            <Input
              value="1588-1234"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
        </div>

        {/* 정비 정보 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              최근 점검일
            </Label>
            <Input
              value="2024-12-15"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#344051]" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              다음 점검 예정일
            </Label>
            <Input
              value="2025-03-15"
              readOnly={!isEditing}
              className="bg-white border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm"
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
