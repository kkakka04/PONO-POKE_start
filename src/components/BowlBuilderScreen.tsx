import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BellRing,
  Check,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Utensils,
} from 'lucide-react';
import {
  AVOCADO_PRICE,
  calculateBowlMetrics,
  createDefaultBowl,
  DRESSINGS,
  formatKRW,
  INGREDIENT_MAP,
  INGREDIENTS,
  PROTEINS,
  SIGNATURE_PRESETS,
} from '../data/menu';
import { KioskCopy } from '../data/translations';
import {
  BowlConfig,
  BuilderStep,
  CartItem,
  DiningMode,
  IngredientKey,
  Lang,
  PortionLevel,
} from '../types/kiosk';
import { IngredientIllustration } from './IngredientIllustration';
import { KineticWheel } from './KineticWheel';
import { PonoLogo } from './PonoLogo';

interface BowlBuilderScreenProps {
  lang: Lang;
  copy: KioskCopy;
  diningMode: DiningMode;
  lowReachMode: boolean;
  magnifierMode: boolean;
  cart: CartItem[];
  onChangeLang: (lang: Lang) => void;
  onChangeDiningMode: (mode: DiningMode) => void;
  onToggleLowReach: () => void;
  onStaffCall: () => void;
  onAddToCart: (bowl: BowlConfig) => void;
  onUpdateCartQty: (id: string, delta: number) => void;
  onRemoveCartItem: (id: string) => void;
  onProceedCheckout: () => void;
  onBackToStart: () => void;
}

const PORTION_LEVELS: PortionLevel[] = [0, 1, 2, 3];

export const BowlBuilderScreen: React.FC<BowlBuilderScreenProps> = ({
  lang,
  copy,
  diningMode,
  lowReachMode,
  magnifierMode,
  cart,
  onChangeLang,
  onChangeDiningMode,
  onToggleLowReach,
  onStaffCall,
  onAddToCart,
  onUpdateCartQty,
  onRemoveCartItem,
  onProceedCheckout,
  onBackToStart,
}) => {
  const [bowl, setBowl] = useState<BowlConfig>(createDefaultBowl);
  const [step, setStep] = useState<BuilderStep>('base');
  const [highlightedKey, setHighlightedKey] = useState<IngredientKey | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const metrics = useMemo(() => calculateBowlMetrics(bowl), [bowl]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const setPortion = (key: IngredientKey, level: PortionLevel) => {
    setBowl((prev) => ({
      ...prev,
      portions: {
        ...prev.portions,
        [key]: level,
      },
    }));
    setHighlightedKey(key);
    window.setTimeout(() => setHighlightedKey(null), 950);
  };

  const applyPreset = (presetId: string) => {
    const preset = SIGNATURE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setBowl({
      id: 'preset-' + preset.id + '-' + Date.now(),
      name: preset.names[lang],
      proteinId: preset.proteinId,
      dressingId: preset.dressingId,
      avocadoExtra: false,
      portions: {
        mix: preset.baseMix,
        rice: preset.baseRice,
        redcabbage: preset.toppings.redcabbage ?? 0,
        corn: preset.toppings.corn ?? 0,
        seaweed: preset.toppings.seaweed ?? 0,
      },
    });
  };

  const handleSelectWheelIngredient = (key: IngredientKey) => {
    setHighlightedKey(key);
    const spec = INGREDIENT_MAP[key];
    if (spec.category === 'base') setStep('base');
    else setStep('toppings');
  };

  const handleAddBowl = () => {
    const selectedProtein = PROTEINS.find((p) => p.id === bowl.proteinId) || PROTEINS[0];
    const bowlToSave: BowlConfig = {
      ...bowl,
      id: 'bowl-' + Date.now(),
      name:
        bowl.name === 'custom'
          ? `${copy.customBowlName} (${selectedProtein.names[lang]})`
          : bowl.name,
    };
    onAddToCart(bowlToSave);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  const portionLabel = (lvl: PortionLevel) => {
    if (lvl === 0) return copy.portionNone;
    if (lvl === 1) return copy.portionLight;
    if (lvl === 2) return copy.portionRegular;
    return copy.portionExtra;
  };

  const steps: { id: BuilderStep; label: string }[] = [
    { id: 'preset', label: copy.stepSignature },
    { id: 'base', label: copy.stepBase },
    { id: 'protein', label: copy.stepProtein },
    { id: 'toppings', label: copy.stepToppings },
    { id: 'dressing', label: copy.stepDressing },
  ];

  const baseIngredients = INGREDIENTS.filter((i) => i.category === 'base');
  const toppingIngredients = INGREDIENTS.filter((i) => i.category === 'topping');

  const macroTotalG = Math.max(1, metrics.carbG + metrics.proteinG + metrics.fiberG);
  const carbPct = Math.round((metrics.carbG / macroTotalG) * 100);
  const proteinPct = Math.round((metrics.proteinG / macroTotalG) * 100);
  const fiberPct = Math.max(0, 100 - carbPct - proteinPct);

  return (
    <div className="relative w-[1080px] h-[1920px] bg-[#FAFBF9] flex flex-col overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="h-[116px] px-10 bg-white border-b border-[#E6ECE2] flex items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onBackToStart}
            className="h-[62px] px-5 rounded-full border-2 border-[#DCE7D6] bg-white text-[#1F4D2B] text-[23px] font-bold flex items-center gap-2.5 hover:bg-[#F3F8F1] active:scale-95 transition cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{copy.backToStart}</span>
          </button>
          <PonoLogo className="w-[180px]" />
        </div>

        {/* Dining mode segmented control */}
        <div className="flex items-center p-1.5 rounded-full bg-[#F2F6EE] border border-[#DCE7D6]">
          <button
            type="button"
            onClick={() => onChangeDiningMode('dine-in')}
            className={`px-7 h-[54px] rounded-full text-[23px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
              diningMode === 'dine-in'
                ? 'bg-[#1F4D2B] text-white shadow-xs'
                : 'text-[#4F6354] hover:text-[#1F4D2B]'
            }`}
          >
            {copy.dineIn}
          </button>
          <button
            type="button"
            onClick={() => onChangeDiningMode('takeout')}
            className={`px-7 h-[54px] rounded-full text-[23px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
              diningMode === 'takeout'
                ? 'bg-[#1F4D2B] text-white shadow-xs'
                : 'text-[#4F6354] hover:text-[#1F4D2B]'
            }`}
          >
            {copy.takeout}
          </button>
        </div>

        {/* Language & Accessibility triggers */}
        <div className="flex items-center gap-3">
          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => onChangeLang(e.target.value as Lang)}
            className="h-[58px] px-4 rounded-full border-2 border-[#DCE7D6] bg-white text-[21px] font-bold text-[#1F4D2B] cursor-pointer outline-none"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
          </select>
          <button
            type="button"
            onClick={onToggleLowReach}
            title={copy.a11yWheelchair}
            aria-pressed={lowReachMode}
            className={`h-[58px] w-[58px] rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
              lowReachMode
                ? 'bg-[#1F4D2B] border-[#1F4D2B] text-white'
                : 'bg-white border-[#DCE7D6] text-[#4C5E50]'
            }`}
          >
            <svg viewBox="0 0 32 32" className="w-7 h-7 fill-none stroke-current stroke-[2.4]" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="14" cy="6" r="2.6" />
              <path d="M14 11v8h7l3 7M14 15h7M10 15a7 7 0 1 0 9 9" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onStaffCall}
            title={copy.a11yStaffCall}
            className="h-[58px] w-[58px] rounded-full border-2 border-[#DCE7D6] bg-white text-[#4C5E50] flex items-center justify-center hover:bg-[#F3F8F1] cursor-pointer"
          >
            <BellRing className="w-6 h-6" />
          </button>
        </div>
      </header>

      {lowReachMode && (
        <div className="bg-[#F1FAE9] border-b border-[#C9E8B8] px-10 py-3 flex items-center justify-between text-[22px] font-bold text-[#1F4D2B]">
          <span>{copy.a11yWheelchairOn}</span>
          <button type="button" onClick={onToggleLowReach} className="underline cursor-pointer">
            OFF
          </button>
        </div>
      )}

      {/* Live Radial Bowl Visualizer + Nutritional Balance Panel */}
      <section className="px-10 py-7 bg-white border-b border-[#E6ECE2] shrink-0">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Live Radial Bowl Wheel */}
          <div className="col-span-6 relative flex flex-col items-center">
            <div className="relative w-[460px] h-[426px]">
              <KineticWheel
                mode="interactive"
                portions={bowl.portions}
                highlightedKey={highlightedKey}
                onSelectIngredient={handleSelectWheelIngredient}
                className="w-full h-full"
              />
              {/* Center Live Calorie & Price Readout in DIN font */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-[160px]">
                <span className="font-din text-[36px] font-bold text-[#1F4D2B] leading-none">
                  {metrics.kcal}
                </span>
                <span className="text-[17px] font-semibold text-[#5E7463] mt-1">
                  {copy.caloriesUnit}
                </span>
                <span className="font-din mt-1.5 text-[24px] font-bold text-[#33592E]">
                  {formatKRW(metrics.price)}
                </span>
              </div>
            </div>
            <p className="text-[20px] font-medium text-[#607365] mt-1">
              {copy.liveBowlCaption}
            </p>
          </div>

          {/* Real-time Balance Readout */}
          <div className="col-span-6 flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-[#1F4D2B] tracking-tight ${magnifierMode ? 'text-[34px]' : 'text-[28px]'}`}>
                {copy.balanceScoreTitle}
              </h2>
              <button
                type="button"
                onClick={() => setBowl(createDefaultBowl())}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[20px] font-bold text-[#526557] hover:bg-[#F2F6EE] cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{copy.resetBowl}</span>
              </button>
            </div>

            {/* 3 Macro Balance Bars with DIN numerals */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[22px] font-bold mb-1.5">
                  <span className="text-[#2E4634]">{copy.carbsLabel}</span>
                  <span className="font-din text-[#1F4D2B]">
                    {metrics.carbG}{copy.gramsUnit} · {carbPct}%
                  </span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-[#EFF3EC] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#FFD23F] transition-all duration-500"
                    style={{ width: `${Math.min(100, carbPct)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[22px] font-bold mb-1.5">
                  <span className="text-[#2E4634]">{copy.proteinLabel}</span>
                  <span className="font-din text-[#1F4D2B]">
                    {metrics.proteinG}{copy.gramsUnit} · {proteinPct}%
                  </span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-[#EFF3EC] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#F26B3A] transition-all duration-500"
                    style={{ width: `${Math.min(100, proteinPct)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[22px] font-bold mb-1.5">
                  <span className="text-[#2E4634]">{copy.veggieLabel}</span>
                  <span className="font-din text-[#1F4D2B]">
                    {metrics.fiberG}{copy.gramsUnit} · {fiberPct}%
                  </span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-[#EFF3EC] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#7BC043] transition-all duration-500"
                    style={{ width: `${Math.min(100, fiberPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Active Bowl Ingredient Swatch Strip with uploaded PNG textures */}
            <div className="grid grid-cols-5 gap-2 pt-3 border-t border-[#EDF2EA]">
              {INGREDIENTS.map((ing) => {
                const lvl = bowl.portions[ing.k];
                return (
                  <button
                    key={ing.k}
                    type="button"
                    onClick={() => handleSelectWheelIngredient(ing.k)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition cursor-pointer ${
                      lvl === 0
                        ? 'opacity-40 bg-[#F7F8F6]'
                        : 'bg-[#F5F9F2] hover:bg-[#EAF6E1]'
                    }`}
                  >
                    <IngredientIllustration ingredient={ing.k} className="w-7 h-7 shrink-0" />
                    <span className="text-[17px] font-bold text-[#1F4D2B] truncate">
                      {ing.names[lang].split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Step Navigation Tabs */}
      <nav className="px-10 py-4 bg-[#FAFBF9] border-b border-[#E6ECE2] flex items-center gap-3 shrink-0">
        {steps.map((s) => {
          const active = step === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex-1 h-[74px] rounded-2xl font-bold transition-all cursor-pointer whitespace-nowrap px-3 ${
                magnifierMode ? 'text-[25px]' : 'text-[23px]'
              } ${
                active
                  ? 'bg-[#1F4D2B] text-white shadow-sm'
                  : 'bg-white text-[#4E6052] border border-[#DCE7D6] hover:border-[#77E024]'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* Scrollable Builder Step Content */}
      <main className="flex-1 overflow-y-auto kiosk-scroll px-10 py-7 space-y-5">
        {step === 'preset' && (
          <div className="space-y-5">
            {SIGNATURE_PRESETS.map((preset) => {
              const protein = PROTEINS.find((p) => p.id === preset.proteinId);
              const dressing = DRESSINGS.find((d) => d.id === preset.dressingId);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className="w-full text-left bg-white rounded-[28px] border-2 border-[#E2ECE0] hover:border-[#77E024] p-7 flex items-center justify-between gap-6 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-[#F1FAE9] text-[#1F4D2B] flex items-center justify-center shrink-0">
                      <Utensils className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-[#1F4D2B] ${magnifierMode ? 'text-[34px]' : 'text-[30px]'}`}>
                        {preset.names[lang]}
                      </h3>
                      <p className={`mt-1 text-[#5A6D5E] font-medium ${magnifierMode ? 'text-[24px]' : 'text-[22px]'}`}>
                        {preset.descriptions[lang]}
                      </p>
                      <p className="mt-2 text-[20px] font-semibold text-[#718475]">
                        {protein?.names[lang]} · {dressing?.names[lang]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-din text-[34px] font-bold text-[#1F4D2B]">
                      {formatKRW(preset.price)}
                    </div>
                    <span className="inline-block mt-2 px-5 py-2 rounded-full bg-[#1F4D2B] text-white text-[20px] font-bold">
                      {copy.updateBowl}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 'base' && (
          <div className="space-y-5">
            {baseIngredients.map((ing) => {
              const lvl = bowl.portions[ing.k];
              return (
                <IngredientPortionCard
                  key={ing.k}
                  ingredientKey={ing.k}
                  name={ing.names[lang]}
                  subtitle={ing.subtitles[lang]}
                  kcal={Math.round(ing.kcalPerUnit * (lvl === 1 ? 0.6 : lvl === 2 ? 1 : lvl === 3 ? 1.5 : 0))}
                  extraPrice={ing.extraPrice}
                  level={lvl}
                  magnifierMode={magnifierMode}
                  portionLabel={portionLabel}
                  onSelect={(nextLvl) => setPortion(ing.k, nextLvl)}
                />
              );
            })}
          </div>
        )}

        {step === 'protein' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              {PROTEINS.map((p) => {
                const selected = bowl.proteinId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setBowl((prev) => ({
                        ...prev,
                        proteinId: p.id,
                        portions: {
                          ...prev.portions,
                          [p.visualKey]: Math.max(prev.portions[p.visualKey], 2) as PortionLevel,
                        },
                      }));
                    }}
                    className={`text-left rounded-[28px] p-6 border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[210px] ${
                      selected
                        ? 'bg-[#F4FBEF] border-[#1F4D2B] shadow-xs'
                        : 'bg-white border-[#E2ECE0] hover:border-[#77E024]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span
                          className="w-12 h-12 rounded-2xl shrink-0 border border-black/10"
                          style={{ backgroundColor: p.swatch }}
                        />
                        <div>
                          <h3 className={`font-bold text-[#1F4D2B] ${magnifierMode ? 'text-[30px]' : 'text-[27px]'}`}>
                            {p.names[lang]}
                          </h3>
                          <p className="text-[20px] font-medium text-[#5A6D5E] mt-1">
                            {p.descriptions[lang]}
                          </p>
                        </div>
                      </div>
                      {selected && (
                        <span className="w-9 h-9 rounded-full bg-[#1F4D2B] text-white flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#E6EEE2] flex items-center justify-between text-[22px] font-bold">
                      <span className="font-din text-[#5A6D5E]">
                        {p.kcal} {copy.caloriesUnit} · {copy.proteinLabel} {p.proteinG}{copy.gramsUnit}
                      </span>
                      <span className="font-din text-[#1F4D2B]">+{formatKRW(p.price)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 'toppings' && (
          <div className="space-y-4">
            {toppingIngredients.map((ing) => {
              const lvl = bowl.portions[ing.k];
              return (
                <IngredientPortionCard
                  key={ing.k}
                  ingredientKey={ing.k}
                  name={ing.names[lang]}
                  subtitle={ing.subtitles[lang]}
                  kcal={Math.round(ing.kcalPerUnit * (lvl === 1 ? 0.6 : lvl === 2 ? 1 : lvl === 3 ? 1.5 : 0))}
                  extraPrice={ing.extraPrice}
                  level={lvl}
                  magnifierMode={magnifierMode}
                  portionLabel={portionLabel}
                  onSelect={(nextLvl) => setPortion(ing.k, nextLvl)}
                />
              );
            })}
          </div>
        )}

        {step === 'dressing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              {DRESSINGS.map((d) => {
                const selected = bowl.dressingId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setBowl((prev) => ({ ...prev, dressingId: d.id }))}
                    className={`text-left rounded-[28px] p-6 border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[180px] ${
                      selected
                        ? 'bg-[#F4FBEF] border-[#1F4D2B] shadow-xs'
                        : 'bg-white border-[#E2ECE0] hover:border-[#77E024]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span
                          className="w-11 h-11 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: d.swatch }}
                        />
                        <div>
                          <h3 className={`font-bold text-[#1F4D2B] ${magnifierMode ? 'text-[30px]' : 'text-[27px]'}`}>
                            {d.names[lang]}
                          </h3>
                          <p className="text-[20px] font-medium text-[#5A6D5E] mt-1">
                            {d.descriptions[lang]}
                          </p>
                        </div>
                      </div>
                      {selected && (
                        <span className="w-9 h-9 rounded-full bg-[#1F4D2B] text-white flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E6EEE2] flex items-center justify-between text-[21px] font-bold text-[#5A6D5E]">
                      <span className="font-din">+{d.kcal} {copy.caloriesUnit}</span>
                      <span>{d.price === 0 ? 'Included' : `+${formatKRW(d.price)}`}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fresh Avocado Extra Toggle */}
            <button
              type="button"
              onClick={() => setBowl((prev) => ({ ...prev, avocadoExtra: !prev.avocadoExtra }))}
              className={`w-full rounded-[28px] p-7 border-2 flex items-center justify-between transition-all cursor-pointer ${
                bowl.avocadoExtra
                  ? 'bg-[#F4FBEF] border-[#1F4D2B]'
                  : 'bg-white border-[#E2ECE0] hover:border-[#77E024]'
              }`}
            >
              <div className="flex items-center gap-5 text-left">
                <span className="w-14 h-14 rounded-2xl bg-[#C8E25A] border border-[#96B82D] shrink-0" />
                <div>
                  <h3 className={`font-bold text-[#1F4D2B] ${magnifierMode ? 'text-[32px]' : 'text-[28px]'}`}>
                    {copy.avocadoTitle}
                  </h3>
                  <p className="text-[21px] font-medium text-[#5A6D5E] mt-0.5">{copy.avocadoDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <span className="font-din text-[30px] font-bold text-[#1F4D2B]">
                  +{formatKRW(AVOCADO_PRICE)}
                </span>
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 ${
                    bowl.avocadoExtra
                      ? 'bg-[#1F4D2B] border-[#1F4D2B] text-white'
                      : 'border-[#C7D5C4] text-transparent'
                  }`}
                >
                  <Check className="w-6 h-6" strokeWidth={3} />
                </span>
              </div>
            </button>
          </div>
        )}
      </main>

      {/* Bottom Sticky Order Tray & Checkout Footer */}
      <footer className="bg-white border-t-2 border-[#DCE7D6] px-10 pt-5 pb-7 shrink-0 shadow-[0_-10px_30px_rgba(31,77,43,0.06)]">
        <div className="flex items-center justify-between gap-5 pb-5 border-b border-[#EDF2EA]">
          <div>
            <div className="text-[20px] font-semibold text-[#607365]">
              {PROTEINS.find((p) => p.id === bowl.proteinId)?.names[lang]} ·{' '}
              {DRESSINGS.find((d) => d.id === bowl.dressingId)?.names[lang]}
            </div>
            <div className="font-din text-[36px] font-bold text-[#1F4D2B] mt-0.5">
              {formatKRW(metrics.price)}{' '}
              <span className="text-[22px] font-medium text-[#5E7463]">
                ({metrics.kcal} {copy.caloriesUnit})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBowl}
            className={`h-[86px] px-10 rounded-full font-bold text-[27px] flex items-center gap-3 transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
              justAdded
                ? 'bg-[#77E024] text-[#1F4D2B]'
                : 'bg-[#1F4D2B] text-white hover:bg-[#173D21]'
            }`}
          >
            {justAdded ? <Check className="w-8 h-8" strokeWidth={3} /> : <Plus className="w-8 h-8" />}
            <span>{copy.addToTray}</span>
          </button>
        </div>

        <div className="pt-4 flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            {cart.length === 0 ? (
              <div className="flex items-center gap-3 text-[22px] font-medium text-[#7B8C7F]">
                <ShoppingBag className="w-7 h-7 shrink-0" />
                <span className="truncate">{copy.trayEmpty}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-[#F5F9F2] border border-[#DCE7D6] rounded-2xl px-4 py-2.5 shrink-0"
                  >
                    <span className="text-[20px] font-bold text-[#1F4D2B] max-w-[200px] truncate">
                      {item.bowl.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateCartQty(item.id, -1)}
                        className="w-9 h-9 rounded-full bg-white border border-[#DCE7D6] flex items-center justify-center text-[#1F4D2B] cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-din w-7 text-center text-[21px] font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateCartQty(item.id, 1)}
                        className="w-9 h-9 rounded-full bg-white border border-[#DCE7D6] flex items-center justify-center text-[#1F4D2B] cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveCartItem(item.id)}
                      className="text-[#8B9B8E] hover:text-red-600 p-1 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onProceedCheckout}
            className={`h-[94px] px-11 rounded-full font-bold text-[29px] flex items-center gap-4 shrink-0 transition-all whitespace-nowrap ${
              cart.length === 0
                ? 'bg-[#E5ECE2] text-[#9AA89D] cursor-not-allowed'
                : 'bg-[#77E024] text-[#1F4D2B] shadow-md hover:bg-[#6DD41C] active:scale-95 cursor-pointer'
            }`}
          >
            <span>
              {copy.checkoutBtn} ({cartCount})
            </span>
            <span className="font-din">{formatKRW(cartTotal)}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

interface IngredientPortionCardProps {
  ingredientKey: IngredientKey;
  name: string;
  subtitle: string;
  kcal: number;
  extraPrice: number;
  level: PortionLevel;
  magnifierMode: boolean;
  portionLabel: (lvl: PortionLevel) => string;
  onSelect: (lvl: PortionLevel) => void;
}

const IngredientPortionCard: React.FC<IngredientPortionCardProps> = ({
  ingredientKey,
  name,
  subtitle,
  kcal,
  extraPrice,
  level,
  magnifierMode,
  portionLabel,
  onSelect,
}) => {
  return (
    <div className="bg-white rounded-[28px] border-2 border-[#E2ECE0] px-7 py-5 flex items-center justify-between gap-6 shadow-xs">
      <div className="flex items-center gap-5 min-w-0">
        <div className="w-20 h-20 rounded-2xl bg-[#F7FAF4] border border-[#E6EFE0] flex items-center justify-center shrink-0">
          <IngredientIllustration ingredient={ingredientKey} className="w-16 h-16" />
        </div>
        <div className="min-w-0">
          <h3 className={`font-bold text-[#1F4D2B] truncate ${magnifierMode ? 'text-[32px]' : 'text-[28px]'}`}>
            {name}
          </h3>
          <p className="text-[20px] font-medium text-[#5A6D5E] truncate">{subtitle}</p>
          <p className="font-din text-[20px] font-semibold text-[#718475] mt-0.5">
            {kcal} kcal {level === 3 ? `· +${formatKRW(extraPrice)}` : ''}
          </p>
        </div>
      </div>

      {/* 4-level tactile portion segmented control */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F2F6EE] border border-[#DCE7D6] shrink-0">
        {PORTION_LEVELS.map((lvl) => {
          const active = level === lvl;
          return (
            <button
              key={lvl}
              type="button"
              onClick={() => onSelect(lvl)}
              className={`h-[64px] min-w-[96px] px-4 rounded-xl font-bold text-[22px] transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? lvl === 0
                    ? 'bg-[#647468] text-white shadow-xs'
                    : 'bg-[#1F4D2B] text-white shadow-xs'
                  : 'text-[#4C5E50] hover:bg-white/80'
              }`}
            >
              {portionLabel(lvl)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
