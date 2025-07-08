import { createFileRoute } from '@tanstack/react-router'

const MobilityPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>차량 관리</h1>
      <p>이곳은 차량 관리 페이지입니다.</p>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/mobility/')({
  component: MobilityPage,
})

export { MobilityPage };