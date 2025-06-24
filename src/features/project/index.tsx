import { createFileRoute } from '@tanstack/react-router'

const ProjectPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>프로젝트 관리</h1>
      <p>이곳은 프로젝트 관리 페이지입니다.</p>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/project/')({
  component: ProjectPage,
}) 