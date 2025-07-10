import React, { useState } from 'react';
import SectionHeader from '@/components/ui/section-header';
import FilterBar from '@/components/ui/filter-bar';
import { RefreshIcon } from '@/components/ui/icons/refresh-icon';

const companyOptions = [
  { value: '', label: '전체 운수사' },
  { value: '서울버스조합', label: '서울버스조합' },
  { value: '성남버스조합', label: '성남버스조합' },
];
const fuelOptions = [
  { value: '', label: '전체 연료' },
  { value: 'CNG', label: 'CNG' },
  { value: '경유', label: '경유' },
];
const yearOptions = [
  { value: '', label: '전체 연식' },
  { value: '2019', label: '2019년' },
  { value: '2020', label: '2020년' },
  { value: '2021', label: '2021년' },
];
const rowsPerPageOptions = [10, 20, 50];

type MonthlyData = Record<string, { days: number; distance: number; charge: number }>

const mockData = [
  {
    id: 1,
    carNo: '서울71사2208',
    company: '서울버스조합',
    regDate: '2020-04-20',
    fuel: 'CNG',
    monthly: {
      '2019-01': { days: 20, distance: 5950, charge: 1200 },
      '2019-02': { days: 18, distance: 5700, charge: 1100 },
      '2019-03': { days: 22, distance: 6100, charge: 1300 },
    } as MonthlyData,
  },
  {
    id: 2,
    carNo: '서울71사2209',
    company: '서울버스조합',
    regDate: '2020-05-10',
    fuel: 'CNG',
    monthly: {
      '2019-01': { days: 19, distance: 5800, charge: 1150 },
      '2019-02': { days: 20, distance: 6000, charge: 1250 },
      '2019-03': { days: 21, distance: 6050, charge: 1280 },
    } as MonthlyData,
  },
  {
    id: 3,
    carNo: '성남71사3301',
    company: '성남버스조합',
    regDate: '2021-01-15',
    fuel: '경유',
    monthly: {
      '2019-01': { days: 21, distance: 5900, charge: 1100 },
      '2019-02': { days: 19, distance: 5750, charge: 1120 },
      '2019-03': { days: 20, distance: 6000, charge: 1200 },
    } as MonthlyData,
  },
  {
    id: 4,
    carNo: '성남71사3302',
    company: '성남버스조합',
    regDate: '2021-02-20',
    fuel: '경유',
    monthly: {
      '2019-01': { days: 18, distance: 5600, charge: 1050 },
      '2019-02': { days: 20, distance: 5900, charge: 1180 },
      '2019-03': { days: 22, distance: 6200, charge: 1350 },
    } as MonthlyData,
  },
  // ... 4개 더 추가 (총 8개)
  {
    id: 5,
    carNo: '서울71사2210',
    company: '서울버스조합',
    regDate: '2020-06-11',
    fuel: 'CNG',
    monthly: {
      '2019-01': { days: 20, distance: 6000, charge: 1220 },
      '2019-02': { days: 21, distance: 6100, charge: 1250 },
      '2019-03': { days: 19, distance: 5800, charge: 1190 },
    } as MonthlyData,
  },
  {
    id: 6,
    carNo: '서울71사2211',
    company: '서울버스조합',
    regDate: '2020-07-01',
    fuel: 'CNG',
    monthly: {
      '2019-01': { days: 22, distance: 6200, charge: 1350 },
      '2019-02': { days: 20, distance: 6000, charge: 1200 },
      '2019-03': { days: 21, distance: 6100, charge: 1280 },
    } as MonthlyData,
  },
  {
    id: 7,
    carNo: '성남71사3303',
    company: '성남버스조합',
    regDate: '2021-03-10',
    fuel: '경유',
    monthly: {
      '2019-01': { days: 20, distance: 6000, charge: 1200 },
      '2019-02': { days: 18, distance: 5700, charge: 1100 },
      '2019-03': { days: 22, distance: 6300, charge: 1400 },
    } as MonthlyData,
  },
  {
    id: 8,
    carNo: '성남71사3304',
    company: '성남버스조합',
    regDate: '2021-04-05',
    fuel: '경유',
    monthly: {
      '2019-01': { days: 19, distance: 5800, charge: 1150 },
      '2019-02': { days: 20, distance: 6000, charge: 1250 },
      '2019-03': { days: 21, distance: 6050, charge: 1280 },
    } as MonthlyData,
  },
];

const months = ['2019-01', '2019-02', '2019-03'];

export default function ElectricTab() {
  // 필터 상태
  const [company, setCompany] = useState('');
  const [fuel, setFuel] = useState('');
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 필터링된 데이터
  const filtered = mockData.filter(row =>
    (company === '' || row.company === company) &&
    (fuel === '' || row.fuel === fuel) &&
    (year === '' || row.regDate.startsWith(year)) &&
    (search === '' || row.carNo.includes(search))
  );

  return (
    <div className="w-full">
      <SectionHeader
        title="전기 차량 운행 정보"
        count={filtered.length}
        lastUpdated="2025-06-25 15:20"
        secondaryButton={{
          text: '목록 업데이트',
          onClick: () => {},
          icon: <RefreshIcon className="w-5 h-5" />,
        }}
      />
      <FilterBar
        selects={[
          {
            options: companyOptions,
            placeholder: '운수사',
            value: company,
            onValueChange: setCompany,
          },
          {
            options: fuelOptions,
            placeholder: '연료',
            value: fuel,
            onValueChange: setFuel,
          },
          {
            options: yearOptions,
            placeholder: '연식',
            value: year,
            onValueChange: setYear,
          },
        ]}
        searchInput={{
          placeholder: '차량번호',
          value: search,
          onChange: setSearch,
        }}
        searchButton={{
          text: '검색',
          onClick: () => {},
        }}
        rightSection={
          <>
            <span className="text-xs text-[#637083]">Rows per page</span>
            <select
              className="border border-[#e4e7ec] rounded-[10px] px-3 py-2 text-sm bg-white"
              value={rowsPerPage}
              onChange={e => setRowsPerPage(Number(e.target.value))}
            >
              {rowsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </>
        }
      />
      <div className="w-full overflow-x-auto bg-white rounded-2xl p-0 mt-2">
        <table className="w-full min-w-[1200px] text-left">
          <thead>
            <tr>
              <th className="bg-[#f7f8fa] px-5 py-2.5 rounded-tl-lg">자동차등록번호</th>
              <th className="bg-[#f7f8fa] px-5 py-2.5">운수사명</th>
              <th className="bg-[#f7f8fa] px-5 py-2.5">차량등록일</th>
              <th className="bg-[#f7f8fa] px-5 py-2.5">연료</th>
              {months.map(month => (
                <th key={month} colSpan={3} className="bg-[#f7f8fa] px-5 py-2.5 text-center">{month}</th>
              ))}
            </tr>
            <tr>
              <th colSpan={4}></th>
              {months.map(month => (
                <React.Fragment key={month}>
                  <th className="bg-[#f7f8fa] px-5 py-1.5 text-xs">운행일수</th>
                  <th className="bg-[#f7f8fa] px-5 py-1.5 text-xs">운행거리</th>
                  <th className="bg-[#f7f8fa] px-5 py-1.5 text-xs">충전량</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, rowsPerPage).map(row => (
              <tr key={row.id} className="border-b border-[#e4e7ec]">
                <td className="p-5 align-middle font-medium text-sm">{row.carNo}</td>
                <td className="p-5 align-middle text-sm">{row.company}</td>
                <td className="p-5 align-middle text-sm">{row.regDate}</td>
                <td className="p-5 align-middle text-sm">{row.fuel}</td>
                {months.map(month => (
                  <React.Fragment key={month}>
                    <td className="p-5 align-middle text-sm text-right">{row.monthly[month]?.days ?? '-'}</td>
                    <td className="p-5 align-middle text-sm text-right">{row.monthly[month]?.distance?.toLocaleString() ?? '-'}</td>
                    <td className="p-5 align-middle text-sm text-right">{row.monthly[month]?.charge?.toLocaleString() ?? '-'}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination 목업 */}
      <div className="flex justify-between items-center mt-6">
        <button className="p-2 bg-[#f7f8fa] rounded-lg">
          <span className="sr-only">이전</span>
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M12 15l-5-5 5-5" stroke="#344051" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-lg text-[#637083] text-sm font-medium">1</button>
          <button className="w-9 h-9 rounded-lg bg-[#f7f8fa] text-[#141c25] text-sm font-medium">2</button>
          <button className="w-9 h-9 rounded-lg text-[#637083] text-sm font-medium">...</button>
          <button className="w-9 h-9 rounded-lg text-[#637083] text-sm font-medium">7</button>
          <button className="w-9 h-9 rounded-lg text-[#637083] text-sm font-medium">8</button>
        </div>
        <button className="p-2 bg-[#f7f8fa] rounded-lg">
          <span className="sr-only">다음</span>
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M8 5l5 5-5 5" stroke="#344051" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
} 