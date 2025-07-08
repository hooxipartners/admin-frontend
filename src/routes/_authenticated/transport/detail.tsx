import { createFileRoute } from '@tanstack/react-router';
import { TransportDetailPage } from '@/features/transport/detail'

export const Route = createFileRoute('/_authenticated/transport/detail')({
  component: TransportDetailPage,
}); 