import React, { useState } from 'react';
import SectionHeader from '@/components/ui/section-header';
import FilterBar from '@/components/ui/filter-bar';
import { RefreshIcon } from '@/components/ui/icons/refresh-icon';
import DataTable from '@/components/ui/data-table';

const companyOptions = [
  { value: '', label: '전체 운수사' },
  { value: '한진운수', label: '한진운수' },
  { value: '롯데운수', label: '롯데운수' },
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

const TABLE_DATA = [
  {
    id: 1,
    carNo: "90마5678",
    company: "한진운수",
    regDate: "2020-04-20",
    fuel: "CNG",
    monthly: {
      "2019-01": { days: 20, distance: 5950, fuel: 1200 },
      "2019-02": { days: 18, distance: 5700, fuel: 1100 },
      "2019-03": { days: 22, distance: 6100, fuel: 1300 },
      "2019-04": { days: 20, distance: 5950, fuel: 1200 },
      "2019-05": { days: 18, distance: 5700, fuel: 1100 },
      "2019-06": { days: 22, distance: 6100, fuel: 1300 },
      "2019-07": { days: 20, distance: 5950, fuel: 1200 },
      "2019-08": { days: 18, distance: 5700, fuel: 1100 },
      "2019-09": { days: 22, distance: 6100, fuel: 1300 },
      "2019-10": { days: 20, distance: 5950, fuel: 1200 },
      "2019-11": { days: 18, distance: 5700, fuel: 1100 },
      "2019-12": { days: 22, distance: 6100, fuel: 1300 },
    }
  },
  {
    id: 2,
    carNo: "12바3456",
    company: "롯데운수",
    regDate: "2020-05-10",
    fuel: "경유",
    monthly: {
      "2019-01": { days: 19, distance: 5800, fuel: 1150 },
      "2019-02": { days: 20, distance: 6000, fuel: 1250 },
      "2019-03": { days: 21, distance: 6050, fuel: 1280 },
      "2019-04": { days: 19, distance: 5800, fuel: 1150 },
      "2019-05": { days: 20, distance: 6000, fuel: 1250 },
      "2019-06": { days: 21, distance: 6050, fuel: 1280 },
      "2019-07": { days: 19, distance: 5800, fuel: 1150 },
      "2019-08": { days: 20, distance: 6000, fuel: 1250 },
      "2019-09": { days: 21, distance: 6050, fuel: 1280 },
      "2019-10": { days: 19, distance: 5800, fuel: 1150 },
      "2019-11": { days: 20, distance: 6000, fuel: 1250 },
      "2019-12": { days: 21, distance: 6050, fuel: 1280 },
    }
  },
  {
    id: 3,
    carNo: "90마5679",
    company: "한진운수",
    regDate: "2021-01-15",
    fuel: "경유",
    monthly: {
      "2019-01": { days: 21, distance: 5900, fuel: 1100 },
      "2019-02": { days: 19, distance: 5750, fuel: 1120 },
      "2019-03": { days: 20, distance: 6000, fuel: 1200 },
      "2019-04": { days: 21, distance: 5900, fuel: 1100 },
      "2019-05": { days: 19, distance: 5750, fuel: 1120 },
      "2019-06": { days: 20, distance: 6000, fuel: 1200 },
      "2019-07": { days: 21, distance: 5900, fuel: 1100 },
      "2019-08": { days: 19, distance: 5750, fuel: 1120 },
      "2019-09": { days: 20, distance: 6000, fuel: 1200 },
      "2019-10": { days: 21, distance: 5900, fuel: 1100 },
      "2019-11": { days: 19, distance: 5750, fuel: 1120 },
      "2019-12": { days: 20, distance: 6000, fuel: 1200 },
    }
  },
  {
    id: 4,
    carNo: "12바3457",
    company: "롯데운수",
    regDate: "2021-02-20",
    fuel: "CNG",
    monthly: {
      "2019-01": { days: 18, distance: 5600, fuel: 1050 },
      "2019-02": { days: 20, distance: 5900, fuel: 1180 },
      "2019-03": { days: 22, distance: 6200, fuel: 1350 },
      "2019-04": { days: 18, distance: 5600, fuel: 1050 },
      "2019-05": { days: 20, distance: 5900, fuel: 1180 },
      "2019-06": { days: 22, distance: 6200, fuel: 1350 },
      "2019-07": { days: 18, distance: 5600, fuel: 1050 },
      "2019-08": { days: 20, distance: 5900, fuel: 1180 },
      "2019-09": { days: 22, distance: 6200, fuel: 1350 },
      "2019-10": { days: 18, distance: 5600, fuel: 1050 },
      "2019-11": { days: 20, distance: 5900, fuel: 1180 },
      "2019-12": { days: 22, distance: 6200, fuel: 1350 },
    }
  },
  {
    id: 5,
    carNo: "90마5680",
    company: "한진운수",
    regDate: "2020-06-11",
    fuel: "CNG",
    monthly: {
      "2019-01": { days: 20, distance: 6000, fuel: 1220 },
      "2019-02": { days: 21, distance: 6100, fuel: 1250 },
      "2019-03": { days: 19, distance: 5800, fuel: 1190 },
      "2019-04": { days: 20, distance: 6000, fuel: 1220 },
      "2019-05": { days: 21, distance: 6100, fuel: 1250 },
      "2019-06": { days: 19, distance: 5800, fuel: 1190 },
      "2019-07": { days: 20, distance: 6000, fuel: 1220 },
      "2019-08": { days: 21, distance: 6100, fuel: 1250 },
      "2019-09": { days: 19, distance: 5800, fuel: 1190 },
      "2019-10": { days: 20, distance: 6000, fuel: 1220 },
      "2019-11": { days: 21, distance: 6100, fuel: 1250 },
      "2019-12": { days: 19, distance: 5800, fuel: 1190 },
    }
  },
  {
    id: 6,
    carNo: "12바3458",
    company: "롯데운수",
    regDate: "2020-07-01",
    fuel: "경유",
    monthly: {
      "2019-01": { days: 22, distance: 6200, fuel: 1350 },
      "2019-02": { days: 20, distance: 6000, fuel: 1200 },
      "2019-03": { days: 21, distance: 6100, fuel: 1280 },
      "2019-04": { days: 22, distance: 6200, fuel: 1350 },
      "2019-05": { days: 20, distance: 6000, fuel: 1200 },
      "2019-06": { days: 21, distance: 6100, fuel: 1280 },
      "2019-07": { days: 22, distance: 6200, fuel: 1350 },
      "2019-08": { days: 20, distance: 6000, fuel: 1200 },
      "2019-09": { days: 21, distance: 6100, fuel: 1280 },
      "2019-10": { days: 22, distance: 6200, fuel: 1350 },
      "2019-11": { days: 20, distance: 6000, fuel: 1200 },
      "2019-12": { days: 21, distance: 6100, fuel: 1280 },
    }
  },
  {
    id: 7,
    carNo: "90마5681",
    company: "한진운수",
    regDate: "2021-03-10",
    fuel: "경유",
    monthly: {
      "2019-01": { days: 20, distance: 6000, fuel: 1200 },
      "2019-02": { days: 18, distance: 5700, fuel: 1100 },
      "2019-03": { days: 22, distance: 6300, fuel: 1400 },
      "2019-04": { days: 20, distance: 6000, fuel: 1200 },
      "2019-05": { days: 18, distance: 5700, fuel: 1100 },
      "2019-06": { days: 22, distance: 6300, fuel: 1400 },
      "2019-07": { days: 20, distance: 6000, fuel: 1200 },
      "2019-08": { days: 18, distance: 5700, fuel: 1100 },
      "2019-09": { days: 22, distance: 6300, fuel: 1400 },
      "2019-10": { days: 20, distance: 6000, fuel: 1200 },
      "2019-11": { days: 18, distance: 5700, fuel: 1100 },
      "2019-12": { days: 22, distance: 6300, fuel: 1400 },
    }
  },
  {
    id: 8,
    carNo: "12바3459",
    company: "롯데운수",
    regDate: "2021-04-05",
    fuel: "CNG",
    monthly: {
      "2019-01": { days: 19, distance: 5800, fuel: 1150 },
      "2019-02": { days: 20, distance: 6000, fuel: 1250 },
      "2019-03": { days: 21, distance: 6050, fuel: 1280 },
      "2019-04": { days: 19, distance: 5800, fuel: 1150 },
      "2019-05": { days: 20, distance: 6000, fuel: 1250 },
      "2019-06": { days: 21, distance: 6050, fuel: 1280 },
      "2019-07": { days: 19, distance: 5800, fuel: 1150 },
      "2019-08": { days: 20, distance: 6000, fuel: 1250 },
      "2019-09": { days: 21, distance: 6050, fuel: 1280 },
      "2019-10": { days: 19, distance: 5800, fuel: 1150 },
      "2019-11": { days: 20, distance: 6000, fuel: 1250 },
      "2019-12": { days: 21, distance: 6050, fuel: 1280 },
    }
  },
];

export default function FossilTab() {
  const [page, setPage] = useState(0); // 0부터 시작
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [company, setCompany] = useState('');
  const [fuel, setFuel] = useState('');
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');

  // 월별 데이터 키 추출
  const months = TABLE_DATA.length > 0 ? Object.keys(TABLE_DATA[0].monthly).sort() : [];

  // 필터링된 데이터
  const filteredData = TABLE_DATA.filter(row =>
    (company === '' || row.company === company) &&
    (fuel === '' || row.fuel === fuel) &&
    (year === '' || row.regDate.startsWith(year)) &&
    (search === '' || row.carNo.includes(search))
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const currentPageData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // columns 정의 - 화석연료용
  const columns = [
    {
      key: 'carNo',
      label: '자동차등록번호',
      className: 'w-[120px] min-w-[120px] px-4 py-3 text-sm font-medium text-[#141c25] border-r border-[#e4e7ec] text-center',
    },
    {
      key: 'company',
      label: '운수사명',
      className: 'w-[100px] min-w-[100px] px-4 py-3 text-sm text-[#344051] border-r border-[#e4e7ec] text-center',
    },
    {
      key: 'regDate',
      label: '차량등록일',
      className: 'w-[110px] min-w-[110px] px-4 py-3 text-sm text-[#344051] border-r border-[#e4e7ec] text-center',
    },
    {
      key: 'fuel',
      label: '연료',
      className: 'w-[80px] min-w-[80px] px-4 py-3 text-sm text-[#344051] border-r border-[#e4e7ec] text-center',
    },
    {
      key: 'spacer',
      label: '',
      className: 'bg-white',
      render: () => <div style={{ width: '24px', minWidth: '24px' }}></div>
    },
    // 월별 데이터 컬럼들
    ...months.flatMap(month => ([
      {
        key: `${month}-days`,
        label: '운행일수',
        className: 'w-[70px] min-w-[70px] px-2 py-3 text-sm text-[#141c25] border-r border-[#e4e7ec] text-center',
      },
      {
        key: `${month}-distance`,
        label: '운행거리',
        className: 'w-[80px] min-w-[80px] px-2 py-3 text-sm text-[#141c25] border-r border-[#e4e7ec] text-center',
      },
      {
        key: `${month}-fuel`,
        label: '주유량',
        className: 'w-[70px] min-w-[70px] px-2 py-3 text-sm text-[#141c25] border-r border-[#e4e7ec] text-center',
      },
    ])),
  ];

  // 테이블 데이터 변환
  const tableData = currentPageData.map(row => {
    const monthData: Record<string, any> = {};
    months.forEach(month => {
      const m = (row.monthly as any)?.[month] || {};
      monthData[`${month}-days`] = m.days ?? '-';
      monthData[`${month}-distance`] = m.distance?.toLocaleString?.() ?? '-';
      monthData[`${month}-fuel`] = m.fuel?.toLocaleString?.() ?? '-';
    });
    return {
      carNo: row.carNo,
      company: row.company,
      regDate: row.regDate,
      fuel: row.fuel,
      spacer: '',
      ...monthData,
    };
  });

  // customHeader 정의 - 화석연료용 (주유량)
  const customHeader = (
    <>
      {/* 첫 번째 헤더 행 - 월별 컬럼 */}
      <tr className="bg-[#f2f4f7]">
        <th className="sticky left-0 w-[120px] min-w-[120px] px-4 py-3 text-xs font-medium text-[#344051] border-r border-[#e4e7ec] text-center bg-[#f2f4f7] z-20" rowSpan={2}>자동차등록번호</th>
        <th className="sticky left-[120px] w-[100px] min-w-[100px] px-4 py-3 text-xs font-medium text-[#344051] border-r border-[#e4e7ec] text-center bg-[#f2f4f7] z-20" rowSpan={2}>운수사명</th>
        <th className="sticky left-[220px] w-[110px] min-w-[110px] px-4 py-3 text-xs font-medium text-[#344051] border-r border-[#e4e7ec] text-center bg-[#f2f4f7] z-20" rowSpan={2}>차량등록일</th>
        <th className="sticky left-[330px] w-[80px] min-w-[80px] px-4 py-3 text-xs font-medium text-[#344051] border-r border-[#e4e7ec] text-center bg-[#f2f4f7] z-20" rowSpan={2}>연료</th>
        <th className="sticky left-[410px] bg-white z-20" style={{ width: '24px', minWidth: '24px' }} rowSpan={2}></th>
        {months.map(month => (
          <th key={month} className="px-4 py-3 text-xs font-medium text-[#344051] border-r border-[#e4e7ec] text-center" colSpan={3}>
            {month}
          </th>
        ))}
      </tr>
      {/* 두 번째 헤더 행 - 세부 항목 */}
      <tr className="bg-[#f2f4f7]">
        {months.map(month => (
          <React.Fragment key={month}>
            <th className="w-[70px] min-w-[70px] px-2 py-3 text-xs font-medium text-[#344051] border-r border-[#e4e7ec] text-center">운행일수</th>
            <th className="w-[80px] min-w-[80px] px-2 py-3 text-xs font-medium text-[#344051] border-r border-[#e4e7ec] text-center">운행거리</th>
            <th className="w-[70px] min-w-[70px] px-2 py-3 text-xs font-medium text-[#344051] border-r border-[#e4e7ec] text-center">주유량</th>
          </React.Fragment>
        ))}
      </tr>
    </>
  );

  return (
    <div className="w-full">
      <SectionHeader
        title="화석연료 차량 운행 정보"
        count={filteredData.length}
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
      
      <DataTable
        columns={columns}
        data={tableData}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        customHeader={customHeader}
        useCustomTable={true}
        stickyColumns={5}
        spacerWidth={0}
      />
    </div>
  );
}