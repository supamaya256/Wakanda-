import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-article';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'default',
  format = 'horizontal',
  className = '',
}) => {
  return (
    <div
      className={`w-full my-6 flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 shadow-inner ${className}`}
      data-ad-slot={slotId}
      aria-label="Advertisement"
    >
      <div className="flex items-center justify-between w-full max-w-4xl px-2 mb-2 text-[10px] uppercase font-mono tracking-widest text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600/70"></span>
          ADVERTISEMENT
        </span>
        <span className="text-[9px] text-zinc-600">Google AdSense Partner</span>
      </div>

      <div
        className={`w-full max-w-4xl bg-zinc-900/60 rounded-lg border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center text-zinc-500 transition-all duration-300 hover:border-zinc-700 ${
          format === 'rectangle'
            ? 'min-h-[250px] p-6'
            : format === 'in-article'
            ? 'min-h-[120px] p-4'
            : 'min-h-[90px] p-4'
        }`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        ></ins>
        <div className="text-xs text-zinc-500 font-medium">
          <p className="text-zinc-400 font-semibold mb-0.5">Sponsored Entertainment & Music Partners</p>
          <p className="text-[11px] text-zinc-600">
            Ad space reserved for Google AdSense verified responsive banners. Non-intrusive & high performance.
          </p>
        </div>
      </div>
    </div>
  );
};
