const mockData = [
  {
    id: 1,
    vehicleNo: '56다7890',
    driver: '이순신',
    company: '현대운수',
    distance: '150km',
    date: '2024-05-01',
  },
  {
    id: 2,
    vehicleNo: '78라1234',
    driver: '박영희',
    company: '기아운수',
    distance: '110km',
    date: '2024-05-02',
  },
];

export default function HydrogenTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-3">차량번호</th>
            <th className="py-3">운전자</th>
            <th className="py-3">운수사</th>
            <th className="py-3">운행거리</th>
            <th className="py-3">운행일</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((row) => (
            <tr key={row.id} className="border-b last:border-b-0">
              <td className="py-4 align-middle">{row.vehicleNo}</td>
              <td className="py-4 align-middle">{row.driver}</td>
              <td className="py-4 align-middle">{row.company}</td>
              <td className="py-4 align-middle">{row.distance}</td>
              <td className="py-4 align-middle">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 