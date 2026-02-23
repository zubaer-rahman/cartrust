import { ThreeDottedLoader } from '@/components/ThreeDottedLoader';

export default function DashboardLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ThreeDottedLoader />
    </div>
  );
}
