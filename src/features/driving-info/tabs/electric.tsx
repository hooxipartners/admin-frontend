import  { useState } from 'react';
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
    }
  },
];

export default function ElectricTab() {
  // 상태 및 동적 변수는 모두 함수 내부에서 선언
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // months를 TABLE_DATA에서 동적으로 추출
  const months = TABLE_DATA.length > 0 ? Object.keys(TABLE_DATA[0].monthly) : [];
  const totalPages = Math.max(1, Math.ceil(TABLE_DATA.length / rowsPerPage));

  // columns 정의 (mobility 스타일 참고)
  const columns = [
    {
      key: 'carNo',
      label: '자동차등록번호',
      className: 'flex-[1.2] min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (v: string) => <span className="text-[#141c25] text-sm font-medium">{v}</span>,
    },
    {
      key: 'company',
      label: '운수사명',
      className: 'flex-[1] min-w-[100px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (v: string) => <span className="text-[#344051] text-sm font-medium">{v}</span>,
    },
    {
      key: 'regDate',
      label: '차량등록일',
      className: 'w-[110px] min-w-[110px] max-w-[110px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (v: string) => <span className="text-[#344051] text-sm font-medium whitespace-nowrap">{v}</span>,
    },
    {
      key: 'fuel',
      label: '연료',
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (v: string) => <span className="text-[#344051] text-sm font-medium">{v}</span>,
    },
    ...months.flatMap(month => ([
      {
        key: `${month}-days`,
        label: '운행일수',
        className: 'w-[77px] min-w-[77px] px-0 py-0 flex items-center justify-center text-center border-r border-[#e4e7ec] text-xs font-medium',
        render: (v: any) => <span className="text-[#141c25] text-base flex items-center justify-center w-full h-full">{v}</span>,
      },
      {
        key: `${month}-distance`,
        label: '운행거리',
        className: 'w-[77px] min-w-[77px] px-0 py-0 flex items-center justify-center text-center border-r border-[#e4e7ec] text-xs font-medium',
        render: (v: any) => <span className="text-[#141c25] text-base flex items-center justify-center w-full h-full">{v}</span>,
      },
      {
        key: `${month}-charge`,
        label: '충전량',
        className: 'w-[68px] min-w-[68px] px-0 py-0 flex items-center justify-center text-center border-r border-[#e4e7ec] text-xs font-medium',
        render: (v: any) => <span className="text-[#141c25] text-base flex items-center justify-center w-full h-full">{v}</span>,
      },
    ])),
  ];

  // tableData 생성 (columns key와 정확히 매칭, 데이터 밀림 방지)
  const tableData = TABLE_DATA.slice((page - 1) * rowsPerPage, page * rowsPerPage).map(row => {
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

  // 필터 상태
  const [company, setCompany] = useState('');
  const [fuel, setFuel] = useState('');
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  // rowsPerPage는 DataTable에서 관리

  // 필터링된 데이터 (DataTable에서 처리)
  const filtered = mockData.filter(row =>
    (company === '' || row.company === company) &&
    (fuel === '' || row.fuel === fuel) &&
    (year === '' || row.regDate.startsWith(year)) &&
    (search === '' || row.carNo.includes(search))
  );

  // DataTable에 전달할 총 데이터 수
  const totalDataCount = filtered.length;

  // customHeader도 months 기준으로 정확히 생성 (mobility 스타일 참고)
  const customHeader = (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1200px] border-separate border-0" style={{ borderSpacing: 0 }}>
        <thead>
          <tr>
            <th rowSpan={2} className="bg-[#f2f4f7] px-4 py-2.5 text-left align-middle border-b border-[#e4e7ec] text-xs font-medium">자동차등록번호</th>
            <th rowSpan={2} className="bg-[#f2f4f7] px-4 py-2.5 text-left align-middle border-b border-[#e4e7ec] text-xs font-medium">운수사명</th>
            <th rowSpan={2} className="bg-[#f2f4f7] px-4 py-2.5 text-left align-middle border-b border-[#e4e7ec] text-xs font-medium">차량등록일</th>
            <th rowSpan={2} className="bg-[#f2f4f7] px-4 py-2.5 text-left align-middle border-b border-[#e4e7ec] text-xs font-medium">연료</th>
            {months.map(month => (
              <th key={month} colSpan={3} className="bg-[#f2f4f7] px-4 py-2.5 text-center align-middle border-b border-l border-[#e4e7ec] text-xs font-medium">{month}</th>
            ))}
          </tr>
          <tr>
            {months.flatMap(month => (
              [
                <th key={month + '-days'} className="bg-[#f2f4f7] px-2 py-2.5 text-center align-middle border-b border-l border-[#e4e7ec] text-xs font-medium">운행일수</th>,
                <th key={month + '-distance'} className="bg-[#f2f4f7] px-2 py-2.5 text-center align-middle border-b border-l border-[#e4e7ec] text-xs font-medium">운행거리</th>,
                <th key={month + '-charge'} className="bg-[#f2f4f7] px-2 py-2.5 text-center align-middle border-b border-l border-[#e4e7ec] text-xs font-medium">충전량</th>
              ]
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );

  return (
    <div className="w-full">
      <SectionHeader
        title="전기 차량 운행 정보"
        count={totalDataCount}
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
      />
    </div>
  );
} 