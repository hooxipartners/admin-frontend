import { createFileRoute } from '@tanstack/react-router';
import {BaselinePage } from '@/features/baseline';

export const Route = createFileRoute('/_authenticated/baseline/')({
  component: BaselinePage,
}); 