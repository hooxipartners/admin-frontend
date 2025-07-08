import { createFileRoute } from '@tanstack/react-router';
import { MobilityPage } from '@/features/mobility';

export const Route = createFileRoute('/_authenticated/mobility/')({
  component: MobilityPage,
})