import { createFileRoute } from '@tanstack/react-router'

const FacilityPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>설비시설 관리</h1>
      <p>이곳은 설비시설 관리 페이지입니다.</p>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/facility')({
  component: FacilityPage,
}) 