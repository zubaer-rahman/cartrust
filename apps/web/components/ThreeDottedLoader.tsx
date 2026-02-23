import React from 'react';

export function ThreeDottedLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-dot-1" />
      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-dot-2" />
      <div className="w-4 h-4 rounded-full bg-primary animate-dot-3" />
    </div>
  );
}
