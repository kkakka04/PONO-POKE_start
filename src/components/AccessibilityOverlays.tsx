import React from 'react';
import { BellRing, CheckCircle2 } from 'lucide-react';
import { KioskCopy } from '../data/translations';

interface StaffCallModalProps {
  open: boolean;
  copy: KioskCopy;
  onClose: () => void;
}

export const StaffCallModal: React.FC<StaffCallModalProps> = ({ open, copy, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm px-12"
      onPointerDown={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="w-full max-w-[760px] rounded-[44px] bg-white p-14 shadow-2xl border-2 border-[#E4F2DA] text-center"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-[#F1FAE9] text-[#1F4D2B]">
          <BellRing className="h-14 w-14" strokeWidth={2.2} />
        </div>
        <h2 className="text-[46px] font-bold tracking-tight text-[#1F4D2B] leading-tight">
          {copy.staffCallTitle}
        </h2>
        <p className="mt-5 text-[29px] font-medium leading-relaxed text-[#4A5D50]">
          {copy.staffCallBody}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-10 inline-flex h-[104px] min-w-[320px] items-center justify-center gap-3 rounded-full bg-[#1F4D2B] px-14 text-[34px] font-bold text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <CheckCircle2 className="h-9 w-9" />
          <span>{copy.staffCallConfirm}</span>
        </button>
      </div>
    </div>
  );
};
