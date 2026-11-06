import React from 'react';
import { DeviceMode } from '../types';

interface DeviceFrameProps {
  device: DeviceMode;
  children: React.ReactNode;
}

export function DeviceFrame({ device, children }: DeviceFrameProps) {
  if (device === 'laptop') {
    return (
      <div className="w-full h-full flex flex-col overflow-hidden relative">
        {children}
      </div>
    );
  }

  if (device === 'phone') {
    return (
      <div className="w-full h-full flex justify-center bg-slate-100/60 dark:bg-zinc-950/60 overflow-hidden">
        {/* Mobile viewport sizing without fake hardware frame */}
        <div className="w-full max-w-[420px] h-full flex flex-col bg-slate-50 dark:bg-zinc-900 border-x border-slate-200 dark:border-zinc-800/80 shadow-xs overflow-hidden relative">
          {children}
        </div>
      </div>
    );
  }

  // iPad / Tablet view: centered tablet sizing without fake hardware frame
  return (
    <div className="w-full h-full flex justify-center bg-slate-100/60 dark:bg-zinc-950/60 overflow-hidden">
      <div className="w-full max-w-[820px] h-full flex flex-col bg-slate-50 dark:bg-zinc-900 border-x border-slate-200 dark:border-zinc-800/80 shadow-xs overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
