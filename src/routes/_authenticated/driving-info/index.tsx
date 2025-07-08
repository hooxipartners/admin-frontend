import { createFileRoute } from '@tanstack/react-router';
import { DrivingInfoPage } from '@/features/driving-info'

// @ts-ignore
export const Route = createFileRoute('/_authenticated/driving-info/')({
  component: DrivingInfoPage,
});