import { createFileRoute } from '@tanstack/react-router';
import { TransportPage } from '@/features/transport'

export const Route = createFileRoute('/_authenticated/transport/')({
  component: TransportPage,
}); 