import { createFileRoute } from '@tanstack/react-router'

const BaselinePage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>베이스라인 관리</h1>
      <p>이곳은 베이스라인 관리 페이지입니다.</p>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/facility/')({
  component: BaselinePage,
})

export { BaselinePage };