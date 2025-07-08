import { createFileRoute } from '@tanstack/react-router';
import { FacilityPage } from '@/features/facility';

export const Route = createFileRoute('/_authenticated/facility/')({
  component: FacilityPage,
}); 