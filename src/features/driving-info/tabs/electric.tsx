import React, { useState } from 'react';
import SectionHeader from '@/components/ui/section-header';
import FilterBar from '@/components/ui/filter-bar';
import { RefreshIcon } from '@/components/ui/icons/refresh-icon';
import DataTable from '@/components/ui/data-table';

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

const TABLE_DATA = [
  {
    id: 1,
    carNo: "서울71사2208",
    company: "서울버스조합",
    regDate: "2020-04-20",
    fuel: "CNG",
    monthly: {
      "2019-01": { days: 20, distance: 5950, charge: 1200 },
      "2019-02": { days: 18, distance: 5700, charge: 1100 },
      "2019-03": { days: 22, distance: 6100, charge: 1300 },
      "2019-04": { days: 20, distance: 5950, charge: 1200 },
      "2019-05": { days: 18, distance: 5700, charge: 1100 },
      "2019-06": { days: 22, distance: 6100, charge: 1300 },
      "2019-07": { days: 20, distance: 5950, charge: 1200 },
      "2019-08": { days: 18, distance: 5700, charge: 1100 },
      "2019-09": { days: 22, distance: 6100, charge: 1300 },
      "2019-10": { days: 20, distance: 5950, charge: 1200 },
      "2019-11": { days: 18, distance: 5700, charge: 1100 },
      "2019-12": { days: 22, distance: 6100, charge: 1300 },
    }
  },
  {
    id: 2,
    carNo: "서울71사2209",
    company: "서울버스조합",
    regDate: "2020-05-10",
    fuel: "CNG",
    monthly: {
      "2019-01": { days: 19, distance: 5800, charge: 1150 },
      "2019-02": { days: 20, distance: 6000, charge: 1250 },
      "2019-03": { days: 21, distance: 6050, charge: 1280 },
      "2019-04": { days: 19, distance: 5800, charge: 1150 },
      "2019-05": { days: 20, distance: 6000, charge: 1250 },
      "2019-06": { days: 21, distance: 6050, charge: 1280 },
      "2019-07": { days: 19, distance: 5800, charge: 1150 },
      "2019-08": { days: 20, distance: 6000, charge: 1250 },
      "2019-09": { days: 21, distance: 6050, charge: 1280 },
      "2019-10": { days: 19, distance: 5800, charge: 1150 },
      "2019-11": { days: 20, distance: 6000, charge: 1250 },
      "2019-12": { days: 21, distance: 6050, charge: 1280 },
    }
  },
  {
    id: 3,
    carNo: "성남71사3301",
    company: "성남버스조합",
    regDate: "2021-01-15",
    fuel: "경유",
    monthly: {
      "2019-01": { days: 21, distance: 5900, charge: 1100 },
      "2019-02": { days: 19, distance: 5750, charge: 1120 },
      "2019-03": { days: 20, distance: 6000, charge: 1200 },
      "2019-04": { days: 21, distance: 5900, charge: 1100 },
      "2019-05": { days: 19, distance: 5750, charge: 1120 },
      "2019-06": { days: 20, distance: 6000, charge: 1200 },
      "2019-07": { days: 21, distance: 5900, charge: 1100 },
      "2019-08": { days: 19, distance: 5750, charge: 1120 },
      "2019-09": { days: 20, distance: 6000, charge: 1200 },
      "2019-10": { days: 21, distance: 5900, charge: 1100 },
      "2019-11": { days: 19, distance: 5750, charge: 1120 },
      "2019-12": { days: 20, distance: 6000, charge: 1200 },
    }
  },
  {
    id: 4,
    carNo: "성남71사3302",
    company: "성남버스조합",
    regDate: "2021-02-20",
    fuel: "경유",
    monthly: {
      "2019-01": { days: 18, distance: 5600, charge: 1050 },
      "2019-02": { days: 20, distance: 5900, charge: 1180 },
      "2019-03": { days: 22, distance: 6200, charge: 1350 },
      "2019-04": { days: 18, distance: 5600, charge: 1050 },
      "2019-05": { days: 20, distance: 5900, charge: 1180 },
      "2019-06": { days: 22, distance: 6200, charge: 1350 },
      "2019-07": { days: 18, distance: 5600, charge: 1050 },
      "2019-08": { days: 20, distance: 5900, charge: 1180 },
      "2019-09": { days: 22, distance: 6200, charge: 1350 },
      "2019-10": { days: 18, distance: 5600, charge: 1050 },
      "2019-11": { days: 20, distance: 5900, charge: 1180 },
      "2019-12": { days: 22, distance: 6200, charge: 1350 },
    }
  },
  {
    id: 5,
    carNo: "서울71사2210",
    company: "서울버스조합",
    regDate: "2020-06-11",
    fuel: "CNG",
    monthly: {
      "2019-01": { days: 20, distance: 6000, charge: 1220 },
      "2019-02": { days: 21, distance: 6100, charge: 1250 },
      "2019-03": { days: 19, distance: 5800, charge: 1190 },
      "2019-04": { days: 20, distance: 6000, charge: 1220 },
      "2019-05": { days: 21, distance: 6100, charge: 1250 },
      "2019-06": { days: 19, distance: 5800, charge: 1190 },
      "2019-07": { days: 20, distance: 6000, charge: 1220 },
      "2019-08": { days: 21, distance: 6100, charge: 1250 },
      "2019-09": { days: 19, distance: 5800, charge: 1190 },
      "2019-10": { days: 20, distance: 6000, charge: 1220 },
      "2019-11": { days: 21, distance: 6100, charge: 1250 },
      "2019-12": { days: 19, distance: 5800, charge: 1190 },
    }
  },
  {
    id: 6,
    carNo: "서울71사2211",
    company: "서울버스조합",
    regDate: "2020-07-01",
    fuel: "CNG",
    monthly: {
      "2019-01": { days: 22, distance: 6200, charge: 1350 },
      "2019-02": { days: 20, distance: 6000, charge: 1200 },
      "2019-03": { days: 21, distance: 6100, charge: 1280 },
      "2019-04": { days: 22, distance: 6200, charge: 1350 },
      "2019-05": { days: 20, distance: 6000, charge: 1200 },
      "2019-06": { days: 21, distance: 6100, charge: 1280 },
      "2019-07": { days: 22, distance: 6200, charge: 1350 },
      "2019-08": { days: 20, distance: 6000, charge: 1200 },
      "2019-09": { days: 21, distance: 6100, charge: 1280 },
      "2019-10": { days: 22, distance: 6200, charge: 1350 },
      "2019-11": { days: 20, distance: 6000, charge: 1200 },
      "2019-12": { days: 21, distance: 6100, charge: 1280 },
    }
  },
  {
    id: 7,
    carNo: "성남71사3303",
    company: "성남버스조합",
    regDate: "2021-03-10",
    fuel: "경유",
    monthly: {
      "2019-01": { days: 20, distance: 6000, charge: 1200 },
      "2019-02": { days: 18, distance: 5700, charge: 1100 },
      "2019-03": { days: 22, distance: 6300, charge: 1400 },
      "2019-04": { days: 20, distance: 6000, charge: 1200 },
      "2019-05": { days: 18, distance: 5700, charge: 1100 },
      "2019-06": { days: 22, distance: 6300, charge: 1400 },
      "2019-07": { days: 20, distance: 6000, charge: 1200 },
      "2019-08": { days: 18, distance: 5700, charge: 1100 },
      "2019-09": { days: 22, distance: 6300, charge: 1400 },
      "2019-10": { days: 20, distance: 6000, charge: 1200 },
      "2019-11": { days: 18, distance: 5700, charge: 1100 },
      "2019-12": { days: 22, distance: 6300, charge: 1400 },
    }
  },
  {
    id: 8,
    carNo: "성남71사3304",
    company: "성남버스조합",
    regDate: "2021-04-05",
    fuel: "경유",
    monthly: {
      "2019-01": { days: 19, distance: 5800, charge: 1150 },
      "2019-02": { days: 20, distance: 6000, charge: 1250 },
      "2019-03": { days: 21, distance: 6050, charge: 1280 },
      "2019-04": { days: 19, distance: 5800, charge: 1150 },
      "2019-05": { days: 20, distance: 6000, charge: 1250 },
      "2019-06": { days: 21, distance: 6050, charge: 1280 },
      "2019-07": { days: 19, distance: 5800, charge: 1150 },
      "2019-08": { days: 20, distance: 6000, charge: 1250 },
      "2019-09": { days: 21, distance: 6050, charge: 1280 },
      "2019-10": { days: 19, distance: 5800, charge: 1150 },
      "2019-11": { days: 20, distance: 6000, charge: 1250 },
      "2019-12": { days: 21, distance: 6050, charge: 1280 },
    }
  },
];

export default function ElectricTab() {
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

  // columns 정의
  const columns = [
    {
      key: 'carNo',
      label: '자동차등록번호',
      className: 'sticky left-0 min-w-[150px] px-4 py-2.5 bg-white z-40',
      sortable: false,
      render: (value: string) => (
        <div className="flex items-center justify-center h-full">
          <span className="text-[#141c25] text-sm font-medium font-['Inter'] leading-5">{value}</span>
        </div>
      )
    },
    {
      key: 'company',
      label: '운수사명',
      className: 'sticky left-[150px] min-w-[140px] px-4 py-2.5 bg-white z-40',
      sortable: false,
      render: (value: string) => (
        <div className="flex items-center justify-center h-full">
          <span className="text-[#141c25] text-sm font-medium font-['Inter'] leading-5">{value}</span>
        </div>
      )
    },
    {
      key: 'regDate',
      label: '차량등록일',
      className: 'sticky left-[290px] min-w-[130px] px-4 py-2.5 bg-white z-40',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center justify-start h-full">
          <span className="text-[#141c25] text-sm font-medium font-['Inter'] leading-5">{value}</span>
        </div>
      )
    },
    {
      key: 'fuel',
      label: '연료',
      className: 'sticky left-[420px] w-[80px] min-w-[80px] max-w-[80px] px-4 py-2.5 bg-white z-40',
      sortable: false,
      render: (value: string) => (
        <div className="flex items-center justify-start h-full">
          <span className="text-[#141c25] text-sm font-medium font-['Inter'] leading-5">{value}</span>
        </div>
      )
    },
    {
      key: 'spacer',
      label: '',
      className: 'sticky left-[500px] bg-white z-50',
      render: () => <div style={{ width: '24px', minWidth: '24px' }}></div>
    },
    // 월별 데이터 컬럼들
    ...months.flatMap((month, index) => ([
      {
        key: `${month}-days`,
        label: '운행일수',
        className: `min-w-[70px] px-4 py-2.5 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`,
        sortable: false,
        render: (value: any) => (
          <div className="flex items-center justify-center h-full">
            <span className="text-[#141c25] text-sm font-medium font-['Inter'] leading-5">{value}</span>
          </div>
        )
      },
      {
        key: `${month}-distance`,
        label: '운행거리',
        className: `min-w-[80px] px-4 py-2.5 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`,
        sortable: false,
        render: (value: any) => (
          <div className="flex items-center justify-center h-full">
            <span className="text-[#141c25] text-sm font-medium font-['Inter'] leading-5">{value}</span>
          </div>
        )
      },
      {
        key: `${month}-charge`,
        label: '충전량',
        className: `min-w-[70px] px-4 py-2.5 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`,
        sortable: false,
        render: (value: any) =>(
          <div className="flex items-center justify-center h-full">
            <span className="text-[#141c25] text-sm font-medium font-['Inter'] leading-5">{value}</span>
          </div>
        )
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
      monthData[`${month}-charge`] = m.charge?.toLocaleString?.() ?? '-';
    });
    return {
      carNo: row.carNo,
      company: row.company,
      regDate: row.regDate,
      fuel: row.fuel,
      ...monthData,
    };
  });

  // customHeader 정의 (2단 헤더)
  const customHeader = (
    <>
      <tr className="bg-[var(--Background-Colors-bg-100,#f2f4f7)] h-5">
        <th 
          className="sticky left-0 min-w-[150px] px-4 text-[#344051] text-sm font-medium font-['Inter'] leading-5 text-center bg-[var(--Background-Colors-bg-100,#f2f4f7)] z-40 h-10 align-middle box-border" 
          rowSpan={2}
        >
          자동차등록번호
        </th>
        <th 
          className="sticky left-[150px] min-w-[140px] px-4 text-[#344051] text-sm font-medium font-['Inter'] leading-5 text-center bg-[var(--Background-Colors-bg-100,#f2f4f7)] z-40 h-10 align-middle box-border" 
          rowSpan={2}
        >
          운수사명
        </th>
        <th 
          className="sticky left-[290px] min-w-[130px] px-4 text-[#344051] text-sm font-medium font-['Inter'] leading-5 text-left bg-[var(--Background-Colors-bg-100,#f2f4f7)] z-40 h-10 align-middle box-border" 
          rowSpan={2}
        >
          차량등록일
        </th>
        <th 
          className="sticky left-[420px] w-[80px] min-w-[80px] max-w-[80px] px-4 text-[#344051] text-sm font-medium font-['Inter'] leading-5 text-left bg-[var(--Background-Colors-bg-100,#f2f4f7)] z-40 h-10 align-middle box-border" 
          rowSpan={2}
        >
          연료
        </th>
        <th 
          className="sticky left-[500px] bg-white z-50 w-6 min-w-[24px] h-10 box-border" 
          rowSpan={2}
        >
        </th>
        {months.map((month, index) => (
          <th 
            key={month} 
            className={`px-4 text-[#344051] text-xs font-medium font-['Inter'] leading-4 text-center h-5 align-middle box-border ${index % 2 === 0 ? 'bg-[#F2F4F7]' : 'bg-[#E4E7EC]'}`}
            colSpan={3}
          >
            {month}
          </th>
        ))}
      </tr>
      <tr className="bg-[var(--Background-Colors-bg-100,#f2f4f7)] h-5">
        {months.map((month, index) => (
          <React.Fragment key={month}>
            <th 
              className={`min-w-[70px] px-4 text-[#344051] text-[10px] font-medium font-['Inter'] leading-[10px] text-center whitespace-nowrap h-5 align-middle box-border ${index % 2 === 0 ? 'bg-[#F2F4F7]' : 'bg-[#E4E7EC]'}`}
            >
              운행일수
            </th>
            <th 
              className={`min-w-[80px] px-4 text-[#344051] text-[10px] font-medium font-['Inter'] leading-[10px] text-center whitespace-nowrap h-5 align-middle box-border ${index % 2 === 0 ? 'bg-[#F2F4F7]' : 'bg-[#E4E7EC]'}`}
            >
              운행거리
            </th>
            <th 
              className={`min-w-[70px] px-4 text-[#344051] text-[10px] font-medium font-['Inter'] leading-[10px] text-center whitespace-nowrap h-5 align-middle box-border ${index % 2 === 0 ? 'bg-[#F2F4F7]' : 'bg-[#E4E7EC]'}`}
            >
              충전량
            </th>
          </React.Fragment>
        ))}
      </tr>
    </>
  );


  return (
    <div className="w-full">
      <SectionHeader
        title="전기 차량 운행 정보"
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
        sort={null}
        onSort={() => {}}
        customHeader={customHeader}
      />
    </div>
  );
}