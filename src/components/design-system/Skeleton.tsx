import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'circle' | 'rect' | 'text';
}

export function Skeleton({
  variant = 'rect',
  className = '',
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-slate-100 dark:bg-slate-900 animate-pulse duration-1000';
  
  const variants = {
    circle: 'rounded-full shrink-0',
    rect: 'rounded-xl',
    text: 'rounded-md h-3 w-3/4'
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-4">
        <Skeleton variant="rect" className="h-10 w-1/4" />
        <Skeleton variant="rect" className="h-10 w-1/6" />
        <Skeleton variant="rect" className="h-10 w-1/6" />
        <Skeleton variant="rect" className="h-10 w-1/3" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4 items-center py-2 border-b border-slate-100 dark:border-slate-850">
            <Skeleton variant="circle" className="h-8 w-8" />
            <Skeleton variant="text" className="w-1/4 h-3.5" />
            <Skeleton variant="text" className="w-1/6 h-3.5" />
            <Skeleton variant="text" className="w-1/6 h-3.5" />
            <Skeleton variant="text" className="w-1/3 h-3.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-slate-100 dark:border-slate-850 p-6 rounded-3xl space-y-4 bg-white dark:bg-slate-950">
      <div className="flex gap-3 items-center">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="text" className="w-1/2 h-3" />
          <Skeleton variant="text" className="w-1/3 h-2" />
        </div>
      </div>
      <Skeleton variant="rect" className="h-32 w-full" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" className="w-1/4 h-3.5" />
        <Skeleton variant="rect" className="h-8 w-20" />
      </div>
    </div>
  );
}
