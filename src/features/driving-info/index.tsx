import { createFileRoute } from '@tanstack/react-router'

const DrivingInfoPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>운행 정보 관리</h1>
      <p>이곳은 운행 정보 관리 페이지입니다.</p>
    </div>
  )
}

// @ts-ignore
export const Route = createFileRoute('/_authenticated/driving-info')({
  component: DrivingInfoPage,
})

export { DrivingInfoPage };