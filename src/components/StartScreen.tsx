import React, { useState } from 'react';
import { KioskCopy } from '../data/translations';
import { Lang } from '../types/kiosk';
import { KineticWheel } from './KineticWheel';
import { PonoLogo } from './PonoLogo';

interface StartScreenProps {
  lang: Lang;
  copy: KioskCopy;
  lowReachMode: boolean;
  magnifierMode: boolean;
  onChangeLang: (lang: Lang) => void;
  onToggleLowReach: () => void;
  onToggleMagnifier: () => void;
  onStaffCall: () => void;
  onStart: () => void;
}

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

export const StartScreen: React.FC<StartScreenProps> = ({
  lang,
  copy,
  lowReachMode,
  magnifierMode,
  onChangeLang,
  onToggleLowReach,
  onToggleMagnifier,
  onStaffCall,
  onStart,
}) => {
  const [exiting, setExiting] = useState(false);

  const handleStageActivate = () => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('kiosk:start'));
      onStart();
    }, 620);
  };

  return (
    <div
      onClick={handleStageActivate}
      className="relative w-[1080px] h-[1920px] bg-white overflow-hidden cursor-pointer select-none"
    >
      {/* Active accessibility banner (only visible when enabled) */}
      {(lowReachMode || magnifierMode) && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 rounded-full bg-[#F1FAE9] border-2 border-[#77E024] px-8 py-2.5 text-[22px] font-bold text-[#1F4D2B]"
        >
          {lowReachMode && <span>{copy.a11yWheelchairOn}</span>}
          {lowReachMode && magnifierMode && <span aria-hidden="true">·</span>}
          {magnifierMode && <span>{copy.a11yMagnifierOn}</span>}
        </div>
      )}

      {/* Exact Uploaded Brand Logo (balanced 640px scale, half of 1280px) */}
      <div className="absolute left-1/2 top-[78px] -translate-x-1/2 pointer-events-none">
        <PonoLogo className="w-[640px]" />
      </div>

      {/* Signature Lime Divider Bar */}
      <div className="absolute left-1/2 top-[430px] -translate-x-1/2 w-[90px] h-[6px] rounded-full bg-[#77E024]" />

      {/* Bilingual Slogan (Deep Green #1F4D2B, well clear of graphic wheel) */}
      <div className="absolute left-0 right-0 top-[464px] text-center px-12">
        <b
          className={`block font-bold tracking-[-0.02em] text-[#1F4D2B] ${
            magnifierMode ? 'text-[50px]' : 'text-[42px]'
          }`}
        >
          Balance, Built by you
        </b>
        <span
          className={`block mt-[12px] font-medium text-[#33592E] ${
            magnifierMode ? 'text-[40px]' : 'text-[34px]'
          }`}
        >
          {copy.sloganSub}
        </span>
      </div>

      {/* Dynamic 4-Ring Kinetic Ingredient Wheel */}
      <div className="absolute left-0 top-[625px] w-[1080px] h-[960px]">
        <KineticWheel mode="attract" exiting={exiting} className="w-full h-full" />
      </div>

      {/* Center Pulsing CTA Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleStageActivate();
        }}
        className={`absolute left-1/2 top-[1105px] flex items-center gap-[22px] px-[54px] h-[136px] rounded-[68px] bg-white border-[2.5px] border-[#E4F2DA] text-[#1F4D2B] font-extrabold tracking-[-0.02em] shadow-[0_16px_40px_rgba(31,77,43,0.14)] whitespace-nowrap cursor-pointer transition-[opacity,transform] duration-500 ${
          magnifierMode ? 'text-[54px]' : 'text-[46px]'
        } ${
          exiting
            ? 'opacity-0 -translate-x-1/2 -translate-y-1/2 scale-90'
            : 'pono-btn-pulse'
        }`}
      >
        <span>{copy.touchToStart}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1F4D2B"
          strokeWidth={2.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[42px] h-[42px] shrink-0"
        >
          <path d="M9 4l8 8-8 8" />
        </svg>
      </button>

      {/* 4-Language Selector Pill */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1/2 top-[1648px] -translate-x-1/2 w-max whitespace-nowrap flex items-center h-[92px] px-[20px] rounded-[46px] border-[2.5px] border-[#DCE2DA] bg-white cursor-default"
      >
        {LANG_OPTIONS.map((item, idx) => {
          const active = lang === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeLang(item.code);
              }}
              className={`relative px-[36px] h-full flex items-center text-[30px] cursor-pointer transition-colors ${
                active
                  ? 'text-[#1F4D2B] font-bold'
                  : 'text-[#737E76] font-medium hover:text-[#1F4D2B]'
              }`}
            >
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[30%] bottom-[30%] w-[2px] bg-[#E2E6E0]"
                />
              )}
              <span>{item.label}</span>
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute left-[28px] right-[28px] bottom-[14px] h-[4px] rounded-full bg-[#1F4D2B]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Accessibility Utility Row */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1/2 top-[1782px] -translate-x-1/2 w-max flex items-center gap-[84px]"
      >
        <button
          type="button"
          title={copy.a11yWheelchair}
          aria-pressed={lowReachMode}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLowReach();
          }}
          className={`w-[68px] h-[68px] p-1.5 rounded-2xl flex items-center justify-center cursor-pointer transition-colors ${
            lowReachMode ? 'bg-[#F1FAE9] ring-2 ring-[#1F4D2B]' : 'hover:bg-[#F5F6F3]'
          }`}
        >
          <svg
            viewBox="0 0 32 32"
            className="w-[56px] h-[56px] fill-none stroke-[2.4]"
            stroke={lowReachMode ? '#1F4D2B' : '#556058'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="14" cy="6" r="2.6" />
            <path d="M14 11v8h7l3 7M14 15h7M10 15a7 7 0 1 0 9 9" />
          </svg>
        </button>

        <button
          type="button"
          title={copy.a11yMagnifier}
          aria-pressed={magnifierMode}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMagnifier();
          }}
          className={`w-[68px] h-[68px] p-1.5 rounded-2xl flex items-center justify-center cursor-pointer transition-colors ${
            magnifierMode ? 'bg-[#F1FAE9] ring-2 ring-[#1F4D2B]' : 'hover:bg-[#F5F6F3]'
          }`}
        >
          <svg
            viewBox="0 0 32 32"
            className="w-[56px] h-[56px] fill-none stroke-[2.4]"
            stroke={magnifierMode ? '#1F4D2B' : '#556058'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="14" cy="14" r="8" />
            <path d="M20 20l8 8M11 14h6M14 11v6" />
          </svg>
        </button>

        <button
          type="button"
          title={copy.a11yStaffCall}
          onClick={(e) => {
            e.stopPropagation();
            onStaffCall();
          }}
          className="w-[68px] h-[68px] p-1.5 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-[#F5F6F3] transition-colors"
        >
          <svg
            viewBox="0 0 32 32"
            className="w-[56px] h-[56px] fill-none stroke-[2.4]"
            stroke="#556058"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h5l7-6v20l-7-6H5zM22 11a7 7 0 0 1 0 10M25 8a11 11 0 0 1 0 16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
