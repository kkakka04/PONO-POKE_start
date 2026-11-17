export type Lang = 'ko' | 'en' | 'zh' | 'ja';

export type IngredientKey =
  | 'mix'
  | 'redcabbage'
  | 'corn'
  | 'seaweed'
  | 'rice';

export type PortionLevel = 0 | 1 | 2 | 3; // 0 = none, 1 = light, 2 = regular, 3 = extra

export type DiningMode = 'dine-in' | 'takeout';

export type BuilderStep = 'preset' | 'base' | 'protein' | 'toppings' | 'dressing';

export type KioskScreen = 'start' | 'builder' | 'checkout' | 'complete';

export interface IngredientSpec {
  k: IngredientKey;
  c: string;
  textureUrl: string;
  category: 'base' | 'topping';
  kcalPerUnit: number;
  proteinGPerUnit: number;
  carbGPerUnit: number;
  fiberGPerUnit: number;
  extraPrice: number; // KRW per extra scoop above regular
  names: Record<Lang, string>;
  subtitles: Record<Lang, string>;
}

export interface ProteinAddon {
  id: string;
  visualKey: IngredientKey;
  swatch: string;
  price: number;
  kcal: number;
  proteinG: number;
  carbG: number;
  fiberG: number;
  names: Record<Lang, string>;
  descriptions: Record<Lang, string>;
}

export interface DressingOption {
  id: string;
  swatch: string;
  price: number;
  kcal: number;
  names: Record<Lang, string>;
  descriptions: Record<Lang, string>;
}

export interface SignaturePreset {
  id: string;
  price: number;
  names: Record<Lang, string>;
  descriptions: Record<Lang, string>;
  baseMix: PortionLevel;
  baseRice: PortionLevel;
  proteinId: string;
  toppings: Partial<Record<IngredientKey, PortionLevel>>;
  dressingId: string;
}

export interface BowlConfig {
  id: string;
  name: string;
  portions: Record<IngredientKey, PortionLevel>;
  proteinId: string;
  dressingId: string;
  avocadoExtra: boolean;
}

export interface CartItem {
  id: string;
  bowl: BowlConfig;
  quantity: number;
  unitPrice: number;
  kcal: number;
  proteinG: number;
  carbG: number;
  fiberG: number;
}
