import { useState } from 'react'
import type { TransportCompanyDetailDto } from '@/lib/api-hooks'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SectionHeader from '@/components/ui/section-header'
import EyeIcon from '@/components/ui/icons/eye-icon';
import SiteIcon from '@/components/ui/icons/site-icon';

interface BasicInfoTabProps {
  data: TransportCompanyDetailDto
}

export const BasicInfoTab = ({ data }: BasicInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false)

  // accountList 분류 및 정렬
  const etas = data.accountList.find((a) => a.homepageName === 'ETAS')
  const fuel = data.accountList.find((a) => a.homepageName === '버스유가보조금통합관리시스템')
  const charges = data.accountList.filter((a) => a.accountInfoTypeDescription === '충전량')

  // 렌더링 순서 배열 생성
  const orderedAccounts = [
    ...(etas ? [{ ...etas, label: 'ETAS' }] : []),
    ...(fuel ? [{ ...fuel, label: '버스 유가 보조' }] : []),
    ...charges.map((charge, idx) => ({ ...charge, label: `충전량 ${charges.length > 1 ? idx + 1 : ''}`.trim() })),
  ]

  return (
    <div className="w-full min-h-screen pt-4">
      {/* 섹션 헤더 */}
      <SectionHeader
        title="기본정보"
        actionButton={{
          text: isEditing ? '저장' : '수정',
          onClick: () => setIsEditing(!isEditing),
          variant: 'secondary'
        }}
      />
      {/* 필터 바 */}
      {/* 폼 영역 */}
      <div className='space-y-8  pb-8'>
        {/* 첫 번째 행 - 회사명, 사업자번호 */}
        <div className='grid grid-cols-3 gap-x-5 gap-y-6 mb-6'>
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
        <div className='grid grid-cols-3 gap-x-5 gap-y-6 mb-6'>
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
        <div className='grid grid-cols-1 mb-6'>
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

        {/* ETAS, 버스 유가 보조, 충전량 N개 */}
        <div className='grid grid-cols-3 gap-x-5 '>
          {orderedAccounts.map((account) => (
            <div key={account.transportAccountId} style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
              <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
                <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'inline-flex' }}>
                  <div style={{ color: '#141C25', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, lineHeight: '20px', wordWrap: 'break-word' }} className="font-inter text-[14px] font-medium leading-5">
                    {account.label}
                  </div>
                </div>
                {/* 사이트 주소 줄 */}
                <div style={{ alignSelf: 'stretch', boxShadow: '0px 1px 2px rgba(20, 28, 37, 0.04)', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                  <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: '#F9FAFB', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderLeft: '1px #E4E7EC solid', borderTop: '1px #E4E7EC solid', borderBottom: '1px #E4E7EC solid', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
                    <div style={{ color: '#637083', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '24px', wordWrap: 'break-word' }}>https://</div>
                  </div>
                  <div style={{ flex: '1 1 0', paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 10, background: 'white', borderTopRightRadius: 10, borderBottomRightRadius: 10, outline: '1px #E4E7EC solid', outlineOffset: '-1px', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                    <div style={{ flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex', color: '#141C25', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '24px', wordWrap: 'break-word' }} className="font-inter text-[14px] font-medium leading-5">
                      {account.homepageUrl ? account.homepageUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''}
                    </div>
                    <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                      <SiteIcon />
                    </div>
                  </div>
                </div>
              </div>
              {/* ID/PW 줄 */}
              <BuscardIdPw loginId={account.loginId} password={undefined} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// BuscardIdPw 컴포넌트 (비번이 있을 수도 없을 수도 있음)
function BuscardIdPw({ loginId, password }: { loginId: string, password?: string }) {
  const [showPw, setShowPw] = useState(false)
  const hasPw = !!password
  const pwMasked = hasPw ? (showPw ? password : '*'.repeat(password.length)) : ''
  return (
    <div style={{ alignSelf: 'stretch', boxShadow: '0px 1px 2px rgba(20, 28, 37, 0.04)', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex', marginTop: 8 }}>
      <div style={{ width: 79, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: '#F9FAFB', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderLeft: '1px #E4E7EC solid', borderTop: '1px #E4E7EC solid', borderBottom: '1px #E4E7EC solid', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
        <div style={{ color: '#637083', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '24px', wordWrap: 'break-word' }}>ID/PW</div>
      </div>
      <div style={{ flex: '1 1 0', paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 10, background: 'white', borderTopRightRadius: 10, borderBottomRightRadius: 10, outline: '1px #E4E7EC solid', outlineOffset: '-1px', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <div style={{ flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex', color: '#637083', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '24px', wordWrap: 'break-word' }}>
          {hasPw ? `${loginId} / ${pwMasked}` : loginId}
        </div>
        <button
          type='button'
          style={{ background: 'none', border: 'none', padding: 0, marginLeft: 8, cursor: hasPw ? 'pointer' : 'not-allowed', opacity: hasPw ? 1 : 0.4, display: 'flex', alignItems: 'center' }}
          onClick={() => hasPw && setShowPw(v => !v)}
          tabIndex={-1}
          disabled={!hasPw}
        >
          <EyeIcon open={showPw} />
        </button>
      </div>
    </div>
  )
}
