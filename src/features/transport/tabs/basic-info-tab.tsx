import { useState } from 'react'
import type { TransportCompanyDetailDto } from '@/lib/api-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BasicInfoTabProps {
  data: TransportCompanyDetailDto
}

// 사이트(지구본) 아이콘 컴포넌트
const SiteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_606_8822)">
      <path d="M10.0003 19.0834C10.4145 19.0834 10.7503 18.7476 10.7503 18.3334C10.7503 17.9192 10.4145 17.5834 10.0003 17.5834V19.0834ZM17.5837 10.0001C17.5837 10.4143 17.9194 10.7501 18.3337 10.7501C18.7479 10.7501 19.0837 10.4143 19.0837 10.0001H17.5837ZM11.431 1.25427C11.1805 0.924389 10.71 0.860041 10.3801 1.11054C10.0502 1.36105 9.98585 1.83154 10.2364 2.16142L11.431 1.25427ZM8.56969 18.7458C8.82019 19.0757 9.29068 19.14 9.62056 18.8895C9.95045 18.639 10.0148 18.1685 9.76429 17.8386L8.56969 18.7458ZM9.76429 2.16142C10.0148 1.83154 9.95045 1.36105 9.62057 1.11054C9.29069 0.860041 8.82019 0.924389 8.56969 1.25427L9.76429 2.16142ZM2.19169 12.1667C1.77748 12.1667 1.44169 12.5025 1.44169 12.9167C1.44169 13.331 1.77748 13.6667 2.19169 13.6667V12.1667ZM10.0004 13.6667C10.4146 13.6667 10.7504 13.331 10.7504 12.9167C10.7504 12.5025 10.4146 12.1667 10.0004 12.1667V13.6667ZM2.19169 6.33341C1.77748 6.33341 1.44169 6.6692 1.44169 7.08341C1.44169 7.49763 1.77748 7.83341 2.19169 7.83341V6.33341ZM17.809 7.83341C18.2232 7.83341 18.559 7.49763 18.559 7.08341C18.559 6.6692 18.2232 6.33341 17.809 6.33341V7.83341ZM18.1951 15.8485L18.2796 16.5937L18.2796 16.5937L18.1951 15.8485ZM18.2327 14.9312L17.8397 15.57L17.8397 15.57L18.2327 14.9312ZM16.0563 16.0909L15.9718 15.3457L15.5666 15.3916L15.3849 15.7567L16.0563 16.0909ZM15.0969 18.0178L14.4255 17.6836L14.4255 17.6836L15.0969 18.0178ZM14.2221 17.7395L14.9568 17.5887L14.9568 17.5887L14.2221 17.7395ZM13.176 12.6428L13.9107 12.492L13.9107 12.492L13.176 12.6428ZM13.8012 12.2051L13.4082 12.8439L13.4082 12.8439L13.8012 12.2051ZM10.0003 18.3334V17.5834C5.81217 17.5834 2.41699 14.1882 2.41699 10.0001H1.66699H0.916992C0.916992 15.0167 4.98374 19.0834 10.0003 19.0834V18.3334ZM10.0003 1.66675V2.41675C14.1885 2.41675 17.5837 5.81192 17.5837 10.0001H18.3337H19.0837C19.0837 4.9835 15.0169 0.916748 10.0003 0.916748V1.66675ZM1.66699 10.0001H2.41699C2.41699 5.81192 5.81217 2.41675 10.0003 2.41675V1.66675V0.916748C4.98374 0.916748 0.916992 4.9835 0.916992 10.0001H1.66699ZM10.8337 1.70785C10.2364 2.16142 10.2362 2.16122 10.2361 2.16103C10.236 2.16098 10.2359 2.16081 10.2358 2.16072C10.2357 2.16053 10.2356 2.16039 10.2355 2.16031C10.2354 2.16013 10.2354 2.16016 10.2356 2.16038C10.2359 2.16082 10.2368 2.16204 10.2383 2.16405C10.2413 2.16806 10.2465 2.17519 10.2539 2.18538C10.2686 2.20577 10.2918 2.23842 10.3223 2.28294C10.3834 2.37201 10.4734 2.50841 10.5829 2.68906C10.802 3.05063 11.098 3.58785 11.3951 4.27615C11.9898 5.65405 12.5837 7.62525 12.5837 10H13.3337H14.0837C14.0837 7.37482 13.4275 5.19992 12.7723 3.68173C12.4443 2.92198 12.1154 2.32365 11.8657 1.91168C11.7408 1.70557 11.6355 1.54571 11.5598 1.4352C11.522 1.37994 11.4915 1.33697 11.4696 1.3067C11.4586 1.29156 11.4498 1.27959 11.4434 1.27084C11.4401 1.26646 11.4374 1.26289 11.4354 1.26012C11.4343 1.25874 11.4335 1.25756 11.4327 1.25659C11.4323 1.2561 11.432 1.25566 11.4317 1.25528C11.4316 1.25508 11.4314 1.25483 11.4313 1.25473C11.4311 1.2545 11.431 1.25427 10.8337 1.70785ZM9.16699 18.2922C9.76429 17.8386 9.76444 17.8388 9.76459 17.839C9.76462 17.8391 9.76476 17.8393 9.76483 17.8393C9.76497 17.8395 9.76507 17.8397 9.76514 17.8398C9.76527 17.8399 9.76525 17.8399 9.76508 17.8397C9.76475 17.8392 9.76384 17.838 9.76235 17.836C9.75938 17.832 9.75413 17.8249 9.74676 17.8147C9.73202 17.7943 9.7088 17.7616 9.6783 17.7171C9.61729 17.6281 9.52726 17.4917 9.41779 17.311C9.19868 16.9494 8.90267 16.4122 8.60559 15.7239C8.01087 14.346 7.41699 12.3748 7.41699 10H6.66699H5.91699C5.91699 12.6252 6.57312 14.8001 7.22839 16.3183C7.55631 17.0781 7.8853 17.6764 8.13494 18.0884C8.25984 18.2945 8.36513 18.4544 8.44083 18.5649C8.47869 18.6201 8.50918 18.6631 8.53107 18.6934C8.54201 18.7085 8.5508 18.7205 8.55729 18.7292C8.56053 18.7336 8.5632 18.7372 8.56527 18.7399C8.56631 18.7413 8.5672 18.7425 8.56793 18.7435C8.5683 18.744 8.56863 18.7444 8.56892 18.7448C8.56907 18.745 8.56926 18.7452 8.56933 18.7453C8.56952 18.7456 8.56969 18.7458 9.16699 18.2922ZM6.66699 10H7.41699C7.41699 7.62525 8.01087 5.65405 8.60559 4.27615C8.90267 3.58785 9.19868 3.05063 9.41779 2.68906C9.52726 2.50841 9.61729 2.37201 9.67831 2.28294C9.7088 2.23842 9.73202 2.20577 9.74676 2.18538C9.75413 2.17519 9.75938 2.16806 9.76235 2.16405C9.76384 2.16204 9.76475 2.16082 9.76509 2.16038C9.76525 2.16016 9.76527 2.16013 9.76514 2.16031C9.76507 2.16039 9.76497 2.16053 9.76483 2.16072C9.76476 2.16081 9.76462 2.16098 9.76459 2.16103C9.76445 2.16122 9.76429 2.16142 9.16699 1.70785C8.56969 1.25427 8.56952 1.2545 8.56934 1.25473C8.56926 1.25483 8.56907 1.25508 8.56893 1.25528C8.56863 1.25566 8.5683 1.2561 8.56794 1.25659C8.5672 1.25756 8.56631 1.25874 8.56527 1.26012C8.5632 1.26289 8.56053 1.26646 8.55729 1.27084C8.5508 1.27959 8.54201 1.29156 8.53107 1.3067C8.50919 1.33697 8.4787 1.37994 8.44083 1.4352C8.36513 1.54571 8.25985 1.70557 8.13495 1.91168C7.8853 2.32365 7.55631 2.92198 7.22839 3.68173C6.57312 5.19992 5.91699 7.37482 5.91699 10H6.66699ZM2.19169 12.9167V13.6667H10.0004V12.9167V12.1667H2.19169V12.9167ZM2.19169 7.08341V7.83341H17.809V7.08341V6.33341H2.19169V7.08341ZM18.1951 15.8485L18.2796 16.5937C18.9442 16.5184 19.2573 15.9658 19.2765 15.4975C19.295 15.0464 19.0726 14.5673 18.6257 14.2924L18.2327 14.9312L17.8397 15.57C17.8043 15.5482 17.775 15.5037 17.7778 15.436C17.7793 15.3989 17.7924 15.3254 17.8552 15.248C17.9263 15.1604 18.0257 15.1129 18.1106 15.1032L18.1951 15.8485ZM16.0563 16.0909L16.1407 16.8361L18.2796 16.5937L18.1951 15.8485L18.1106 15.1032L15.9718 15.3457L16.0563 16.0909ZM15.0969 18.0178L15.7683 18.3521L16.7276 16.4252L16.0563 16.0909L15.3849 15.7567L14.4255 17.6836L15.0969 18.0178ZM14.2221 17.7395L13.4874 17.8903C13.5929 18.4042 13.967 18.7771 14.3972 18.914C14.8439 19.0561 15.4702 18.9509 15.7683 18.3521L15.0969 18.0178L14.4255 17.6836C14.4636 17.6071 14.5422 17.5299 14.6489 17.4931C14.7431 17.4605 14.8167 17.4734 14.852 17.4846C14.9166 17.5052 14.9484 17.548 14.9568 17.5887L14.2221 17.7395ZM13.176 12.6428L12.4413 12.7936L13.4874 17.8903L14.2221 17.7395L14.9568 17.5887L13.9107 12.492L13.176 12.6428ZM13.8012 12.2051L14.1942 11.5663C13.7996 11.3236 13.2964 11.2998 12.8972 11.5793C12.498 11.8589 12.3482 12.3398 12.4413 12.7936L13.176 12.6428L13.9107 12.492C13.9217 12.5458 13.9107 12.7009 13.7576 12.8081C13.6045 12.9153 13.455 12.8726 13.4082 12.8439L13.8012 12.2051ZM18.2327 14.9312L18.6257 14.2924L14.1942 11.5663L13.8012 12.2051L13.4082 12.8439L17.8397 15.57L18.2327 14.9312Z" fill="#637083"/>
    </g>
    <defs>
      <clipPath id="clip0_606_8822">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

// 눈(비밀번호 보기) 아이콘
const EyeIcon = ({ open }: { open: boolean }) => (
  open ? (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M1.667 10S4.167 4.167 10 4.167 18.333 10 18.333 10 15.833 15.833 10 15.833 1.667 10 1.667 10Z" stroke="#637083" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="#637083" strokeWidth="1.5"/></svg>
  ) : (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M1.667 10S4.167 4.167 10 4.167c1.5 0 2.833.333 4 .833M18.333 10S15.833 15.833 10 15.833c-1.5 0-2.833-.333-4-.833M7.5 7.5l5 5" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/></svg>
  )
)

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

        {/* ETAS, 버스 유가 보조, 충전량 N개 */}
        <div className='grid grid-cols-3 gap-6'>
          {orderedAccounts.map((account) => (
            <div key={account.transportAccountId} style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
              <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
                <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'inline-flex' }}>
                  <div style={{ color: '#141C25', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, lineHeight: '20px', wordWrap: 'break-word' }}>{account.label}</div>
                </div>
                {/* 사이트 주소 줄 */}
                <div style={{ alignSelf: 'stretch', boxShadow: '0px 1px 2px rgba(20, 28, 37, 0.04)', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                  <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: '#F9FAFB', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderLeft: '1px #E4E7EC solid', borderTop: '1px #E4E7EC solid', borderBottom: '1px #E4E7EC solid', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
                    <div style={{ color: '#637083', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '24px', wordWrap: 'break-word' }}>https://</div>
                  </div>
                  <div style={{ flex: '1 1 0', paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 10, background: 'white', borderTopRightRadius: 10, borderBottomRightRadius: 10, outline: '1px #E4E7EC solid', outlineOffset: '-1px', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                    <div style={{ flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex', color: '#141C25', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '24px', wordWrap: 'break-word' }}>
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
