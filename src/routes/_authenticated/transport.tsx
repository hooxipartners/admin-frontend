import { createFileRoute } from '@tanstack/react-router'

const TransportPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>운수사 관리</h1>
      <p>이곳은 운수사 관리 페이지입니다.</p>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/transport')({
  component: TransportPage,
}) 