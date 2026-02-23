import { ThreeDottedLoader } from '@/components/ThreeDottedLoader';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-6">
        <ThreeDottedLoader />
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/60">Loading Content</p>
      </div>
    </div>
  );
}
