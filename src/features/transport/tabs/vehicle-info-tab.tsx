interface VehicleInfoTabProps {
  data: any // TODO: 실제 타입 정의
}

export const VehicleInfoTab = ({ data }: VehicleInfoTabProps) => {
  return (
    <div className="bg-white">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-[#141c25] leading-6" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
          차량정보
        </h2>
      </div>

      {/* 차량정보 내용 */}
      <div className="text-center py-20">
        <p className="text-[#637083] text-lg" style={{ fontFamily: '"Inter-Regular", sans-serif' }}>
          차량정보 내용이 여기에 표시됩니다.
        </p>
        <p className="text-[#637083] text-sm mt-2" style={{ fontFamily: '"Inter-Regular", sans-serif' }}>
          차량 목록, 차량 상태, 운행 이력 등의 정보가 포함될 예정입니다.
        </p>
      </div>
    </div>
  )
}
