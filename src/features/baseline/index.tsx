import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/baseline/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/baseline/"!</div>
}
