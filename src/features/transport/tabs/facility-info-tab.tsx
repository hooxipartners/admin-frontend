import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Pagination from '@/components/ui/pagination';
import SectionHeader from '@/components/ui/section-header';
import FilterBar from '@/components/ui/filter-bar'
import DataTable from '@/components/ui/data-table'
import TrashIcon from '@/components/ui/icons/trash-icon';

// 설비정보 목업 데이터 (차량정보와 동일하게 배열 형태, 각 컬럼별 데이터)
const getFacilityMockData = () => Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  garage: '경기 포천시 내촌면 음고개길 7 내촌전기충전소',
  company: '다모아자동차',
  acMeterNo: '06212036315',
  acMeterYear: '2020-04',
  chargerNo: 'PUMPKIN-24002C2-DB-0004',
  chargerYear: '2020-04',
  serial: (i+1).toString().padStart(2, '0'),
  plateFile: '다모아자동차(주)_충전동판이미지.pdf',
}))

export const FacilityInfoTab = () => {
  const [page, setPage] = useState(0)
  const size = 10
  const rows = getFacilityMockData().slice(page * size, (page + 1) * size)
  const totalElements = getFacilityMockData().length
  const totalPages = Math.ceil(totalElements / size)

  return (
    <div className="w-full min-h-screen pt-4 px-8 pb-8">
      {/* 섹션 헤더 */}
      <SectionHeader
        title="설비정보"
        count={totalElements}
        primaryButton={{
          text: "설비 추가",
          onClick: () => console.log("설비 추가")
        }}
      />
      {/* 필터 바 */}
      <FilterBar
        searchInput={{
          placeholder: "Search",
          className: "w-80"
        }}
        searchButton={{
          text: "검색"
        }}
      />
      {/* 테이블 */}
      <DataTable
        columns={[
          { key: 'garage', label: '차고지', sortable: false },
          { key: 'company', label: '운수사', sortable: false },
          { key: 'acMeterNo', label: 'AC전력계 제조번호', sortable: false },
          { key: 'acMeterYear', label: 'AC전력계 제조년월', sortable: false },
          { key: 'chargerNo', label: '충전기 제조번호', sortable: false },
          { key: 'chargerYear', label: '충전기 제조년월', sortable: false },
          { key: 'serial', label: '연번', sortable: false },
          { key: 'plateFile', label: '충전설비 붙임 이미지', sortable: false },
          { key: 'detail', label: '상세', sortable: false }
        ]}
        data={rows.map((row) => ({
          ...row,
          plateFile: (
            <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-[#f2f4f7] rounded px-1.5 py-0.5 text-xs font-medium text-[#344051] whitespace-nowrap">PDF</div>
              <span className="text-xs text-[#141c25] whitespace-nowrap font-inter text-[14px] font-medium leading-5">{row.plateFile}</span>
            </a>
          ),
          detail: (
            <button className="w-[22px] h-[22px] flex items-center justify-center mx-auto hover:opacity-70 transition-opacity h-full">
              <TrashIcon />
            </button>
          )
        }))}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
