import { useState } from 'react'
import type { TransportCompanyDetailDto } from '@/lib/api-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BasicInfoTabProps {
  data: TransportCompanyDetailDto
}

export const BasicInfoTab = ({ data }: BasicInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false)

  // accountList 분기
  const etas = data.accountList.find((a) => a.accountInfoTypeName === 'MILEAGE')
  const fuel = data.accountList.find((a) => a.accountInfoTypeName === 'FUEL')
  const charges = data.accountList.filter(
    (a) => a.accountInfoTypeName === 'CHARGE'
  )

  return (
    <div className='bg-white'>
      {/* 섹션 헤더 */}
      <div className='mb-6 flex items-center justify-between'>
        <h2
          className='text-base leading-6 font-medium text-[#141c25]'
          style={{ fontFamily: '"Inter-Medium", sans-serif' }}
        >
          기본정보
        </h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className='rounded-lg border border-[#e4e7ec] bg-transparent px-4 py-2 text-sm font-medium text-[#141c25] hover:bg-gray-50'
          style={{ fontFamily: '"Inter-Medium", sans-serif' }}
        >
          {isEditing ? '저장' : '수정'}
        </Button>
      </div>

      {/* 폼 영역 */}
      <div className='space-y-8'>
        {/* 첫 번째 행 - 회사명, 사업자번호 */}
        <div className='grid grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <Label
              className='text-sm font-medium text-[#344051]'
              style={{ fontFamily: '"Inter-Medium", sans-serif' }}
            >
              회사명
            </Label>
            <Input
              value={data.companyName || ''}
              readOnly={!isEditing}
              className='rounded-[10px] border border-[#e4e7ec] bg-white px-3 py-2 text-sm'
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className='space-y-2'>
            <Label
              className='text-sm font-medium text-[#344051]'
              style={{ fontFamily: '"Inter-Medium", sans-serif' }}
            >
              사업자번호
            </Label>
            <Input
              value={data.businessRegistrationNumber || ''}
              readOnly={!isEditing}
              className='rounded-[10px] border border-[#e4e7ec] bg-white px-3 py-2 text-sm'
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className='space-y-2'>
            <Label
              className='text-sm font-medium text-[#344051]'
              style={{ fontFamily: '"Inter-Medium", sans-serif' }}
            >
              주소
            </Label>
            <Input
              value={data.address || ''}
              readOnly={!isEditing}
              className='rounded-[10px] border border-[#e4e7ec] bg-white px-3 py-2 text-sm'
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
        </div>

        {/* 두 번째 행 - 상세주소, 담당자, 담당자 연락처 */}
        <div className='grid grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <Label
              className='text-sm font-medium text-[#344051]'
              style={{ fontFamily: '"Inter-Medium", sans-serif' }}
            >
              상세주소
            </Label>
            <Input
              value={data.detailedAddress || ''}
              readOnly={!isEditing}
              className='rounded-[10px] border border-[#e4e7ec] bg-white px-3 py-2 text-sm'
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className='space-y-2'>
            <Label
              className='text-sm font-medium text-[#344051]'
              style={{ fontFamily: '"Inter-Medium", sans-serif' }}
            >
              담당자
            </Label>
            <Input
              value={data.managerName || ''}
              readOnly={!isEditing}
              className='rounded-[10px] border border-[#e4e7ec] bg-white px-3 py-2 text-sm'
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
          <div className='space-y-2'>
            <Label
              className='text-sm font-medium text-[#344051]'
              style={{ fontFamily: '"Inter-Medium", sans-serif' }}
            >
              담당자 연락처
            </Label>
            <Input
              value={data.managerPhone || ''}
              readOnly={!isEditing}
              className='rounded-[10px] border border-[#e4e7ec] bg-white px-3 py-2 text-sm'
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
        </div>

        {/* 세 번째 행 - 담당자 이메일 */}
        <div className='grid grid-cols-1 gap-6'>
          <div className='space-y-2'>
            <Label
              className='text-sm font-medium text-[#344051]'
              style={{ fontFamily: '"Inter-Medium", sans-serif' }}
            >
              담당자 이메일
            </Label>
            <Input
              value={data.managerEmail || ''}
              readOnly={!isEditing}
              className='rounded-[10px] border border-[#e4e7ec] bg-white px-3 py-2 text-sm'
              style={{ fontFamily: '"Inter-Regular", sans-serif' }}
            />
          </div>
        </div>

        {/* ETAS, 버스 유가 보조, 충전량 사이트 N개 */}
        <div className='grid grid-cols-3 gap-6'>
          {/* ETAS */}
          {etas && (
            <div className='space-y-4'>
              <Label
                className='text-sm font-medium text-[#344051]'
                style={{ fontFamily: '"Inter-Medium", sans-serif' }}
              >
                ETAS
              </Label>
              <div className='space-y-3'>
                <div className='flex'>
                  <div className='flex min-w-[40px] items-center justify-center rounded-l-[10px] border border-[#e4e7ec] bg-[#f8fafc] px-3 py-2 text-xs text-[#637083]'>
                    ID
                  </div>
                  <Input
                    value={etas.loginId || ''}
                    readOnly={!isEditing}
                    className='flex-1 rounded-l-none rounded-r-[10px] border border-l-0 border-[#e4e7ec] bg-white px-3 py-2 text-sm'
                    style={{ fontFamily: '"Inter-Regular", sans-serif' }}
                  />
                </div>
                {/* PW는 API에 없으므로 생략 */}
              </div>
            </div>
          )}

          {/* 버스 유가 보조 */}
          {fuel && (
            <div className='space-y-4'>
              <Label
                className='text-sm font-medium text-[#344051]'
                style={{ fontFamily: '"Inter-Medium", sans-serif' }}
              >
                버스 유가 보조
              </Label>
              <div className='space-y-3'>
                <div className='flex'>
                  <div className='flex min-w-[40px] items-center justify-center rounded-l-[10px] border border-[#e4e7ec] bg-[#f8fafc] px-3 py-2 text-xs text-[#637083]'>
                    ID
                  </div>
                  <Input
                    value={fuel.loginId || ''}
                    readOnly={!isEditing}
                    className='flex-1 rounded-l-none rounded-r-[10px] border border-l-0 border-[#e4e7ec] bg-white px-3 py-2 text-sm'
                    style={{ fontFamily: '"Inter-Regular", sans-serif' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 충전량 사이트 N개 */}
          {charges.map((charge, idx) => (
            <div className='space-y-4' key={charge.transportAccountId}>
              <Label
                className='text-sm font-medium text-[#344051]'
                style={{ fontFamily: '"Inter-Medium", sans-serif' }}
              >
                충전량 사이트{idx + 1}
              </Label>
              <div className='space-y-3'>
                <div className='flex'>
                  <div className='flex min-w-[40px] items-center justify-center rounded-l-[10px] border border-[#e4e7ec] bg-[#f8fafc] px-3 py-2 text-xs text-[#637083]'>
                    ID
                  </div>
                  <Input
                    value={charge.loginId || ''}
                    readOnly={!isEditing}
                    className='flex-1 rounded-l-none rounded-r-[10px] border border-l-0 border-[#e4e7ec] bg-white px-3 py-2 text-sm'
                    style={{ fontFamily: '"Inter-Regular", sans-serif' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
