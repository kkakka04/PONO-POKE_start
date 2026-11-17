import {
  BowlConfig,
  DressingOption,
  IngredientKey,
  IngredientSpec,
  PortionLevel,
  ProteinAddon,
  SignaturePreset,
} from '../types/kiosk';

// Strictly the 5 uploaded PONO POKE ingredient patterns
export const INGREDIENTS: IngredientSpec[] = [
  {
    k: 'mix',
    c: '#7BC043',
    textureUrl: '/assets/aistudio/green_mix_49ce766b.png',
    category: 'base',
    kcalPerUnit: 22,
    proteinGPerUnit: 1.8,
    carbGPerUnit: 3.5,
    fiberGPerUnit: 2.8,
    extraPrice: 500,
    names: { ko: '채소 믹스', en: 'Romaine Greens', zh: '鲜脆蔬菜沙拉', ja: '野菜ミックス' },
    subtitles: { ko: '로메인·치커리·어린잎', en: 'Romaine & baby leaves', zh: '罗马生菜·嫩叶菜', ja: 'ロメイン・ベビーリーフ' },
  },
  {
    k: 'redcabbage',
    c: '#8F4FB5',
    textureUrl: '/assets/aistudio/red_cabbage_76ce8172.png',
    category: 'topping',
    kcalPerUnit: 14,
    proteinGPerUnit: 0.7,
    carbGPerUnit: 3.1,
    fiberGPerUnit: 1.6,
    extraPrice: 400,
    names: { ko: '적채', en: 'Red Cabbage', zh: '紫甘蓝丝', ja: 'レッドキャベツ' },
    subtitles: { ko: '아삭한 식감과 안토시아닌', en: 'Crisp crunch & antioxidants', zh: '爽脆口感·花青素', ja: 'シャキッと食感' },
  },
  {
    k: 'corn',
    c: '#FFD23F',
    textureUrl: '/assets/aistudio/corn111_51b0455b.png',
    category: 'topping',
    kcalPerUnit: 48,
    proteinGPerUnit: 1.6,
    carbGPerUnit: 10.5,
    fiberGPerUnit: 1.4,
    extraPrice: 500,
    names: { ko: '옥수수', en: 'Sweet Corn', zh: '甜玉米粒', ja: 'スイートコーン' },
    subtitles: { ko: '톡톡 터지는 달콤한 옥수수', en: 'Golden juicy kernels', zh: '颗粒饱满香甜', ja: '甘みのあるコーン' },
  },
  {
    k: 'seaweed',
    c: '#2DB68A',
    textureUrl: '/assets/aistudio/seaweed_af5efb11.png',
    category: 'topping',
    kcalPerUnit: 24,
    proteinGPerUnit: 1.1,
    carbGPerUnit: 4.4,
    fiberGPerUnit: 2.2,
    extraPrice: 600,
    names: { ko: '해초샐러드', en: 'Wakame Seaweed', zh: '海藻沙拉', ja: '海藻サラダ' },
    subtitles: { ko: '바다 미네랄과 감칠맛', en: 'Savory ocean minerals', zh: '鲜美海洋风味', ja: '磯の香りとミネラル' },
  },
  {
    k: 'rice',
    c: '#D8C7AE',
    textureUrl: '/assets/aistudio/rice_af56d469.png',
    category: 'base',
    kcalPerUnit: 135,
    proteinGPerUnit: 2.9,
    carbGPerUnit: 29.0,
    fiberGPerUnit: 1.5,
    extraPrice: 700,
    names: { ko: '현미 라이스', en: 'Warm Brown Rice', zh: '糙米寿司饭', ja: '玄米すし飯' },
    subtitles: { ko: '고슬고슬한 귀리·현미 블렌드', en: 'Nutty oat & brown rice', zh: 'Q弹燕麦糙米', ja: 'ふっくら玄米ブレンド' },
  },
];

export const INGREDIENT_MAP: Record<IngredientKey, IngredientSpec> = INGREDIENTS.reduce(
  (acc, item) => {
    acc[item.k] = item;
    return acc;
  },
  {} as Record<IngredientKey, IngredientSpec>
);

export const BASE_BOWL_PRICE = 9900;
export const AVOCADO_PRICE = 2200;

export const PROTEINS: ProteinAddon[] = [
  {
    id: 'salmon-crab',
    visualKey: 'mix',
    swatch: '#F26B3A',
    price: 2900,
    kcal: 165,
    proteinG: 22,
    carbG: 3,
    fiberG: 0,
    names: { ko: '생연어 & 스노우크랩', en: 'Fresh Salmon & Crab', zh: '鲜三文鱼蟹肉双拼', ja: '生サーモン＆クラブ' },
    descriptions: { ko: '노르웨이 생연어 큐브와 크랩 믹스', en: 'Norwegian salmon cubes & snow crab', zh: '挪威鲜切三文鱼与蟹肉', ja: 'ノルウェー産サーモンとカニカマ' },
  },
  {
    id: 'raw-salmon',
    visualKey: 'mix',
    swatch: '#FA8961',
    price: 3400,
    kcal: 185,
    proteinG: 24,
    carbG: 0,
    fiberG: 0,
    names: { ko: '노르웨이 생연어', en: 'Norwegian Salmon', zh: '挪威厚切三文鱼', ja: 'ノルウェー産生サーモン' },
    descriptions: { ko: '오메가3가 풍부한 신선한 큐브 연어', en: 'Omega-3 rich sashimi-grade cubes', zh: '富含Omega-3的刺身级三文鱼', ja: 'オメガ3豊富な新鮮キューブ' },
  },
  {
    id: 'sous-vide-chicken',
    visualKey: 'rice',
    swatch: '#EADBC8',
    price: 1900,
    kcal: 130,
    proteinG: 26,
    carbG: 1,
    fiberG: 0,
    names: { ko: '수비드 닭가슴살', en: 'Sous-vide Chicken', zh: '低温慢煮鸡胸肉', ja: '低温調理チキン' },
    descriptions: { ko: '촉촉하고 담백한 고단백 닭가슴살', en: 'Tender lean protein boost', zh: '嫩滑低脂高蛋白', ja: 'しっとり高たんぱく鶏むね肉' },
  },
  {
    id: 'grilled-tofu',
    visualKey: 'seaweed',
    swatch: '#C8E25A',
    price: 1500,
    kcal: 120,
    proteinG: 14,
    carbG: 4,
    fiberG: 2,
    names: { ko: '유자 간장 구운 두부', en: 'Yuzu Glazed Tofu', zh: '柚子酱油烤豆腐', ja: '柚子醤油焼き豆腐' },
    descriptions: { ko: '고소한 비건 식물성 프로틴', en: 'Savory plant-based protein', zh: '香嫩植物蛋白', ja: '香ばしいヴィーガン豆腐' },
  },
];

export const DRESSINGS: DressingOption[] = [
  {
    id: 'oriental-yuzu',
    swatch: '#D99B26',
    price: 0,
    kcal: 55,
    names: { ko: '오리엔탈 유자 폰즈', en: 'Yuzu Ponzu Soy', zh: '柚子日式油醋汁', ja: 'ゆずポン酢' },
    descriptions: { ko: '상큼한 유자향의 깔끔한 기본 소스', en: 'Light citrus-soy classic', zh: '清爽微酸柚子风味', ja: 'さっぱり柑橘ベース' },
  },
  {
    id: 'sriracha-mayo',
    swatch: '#E86C4A',
    price: 0,
    kcal: 115,
    names: { ko: '스리라차 마요', en: 'Sriracha Mayo', zh: '是拉差辣蛋黄酱', ja: 'シラチャーマヨ' },
    descriptions: { ko: '매콤하고 크리미한 인기 드레싱', en: 'Creamy chili kick', zh: '香浓微辣经典风味', ja: 'ピリ辛クリーミー' },
  },
  {
    id: 'roasted-sesame',
    swatch: '#C5A06D',
    price: 0,
    kcal: 95,
    names: { ko: '고소한 참깨 와사비', en: 'Roasted Sesame', zh: '焙煎芝麻芥末酱', ja: '焙煎ごま＆わさび' },
    descriptions: { ko: '고소한 볶음 참깨와 은은한 와사비', en: 'Nutty sesame with subtle heat', zh: '浓郁芝麻搭配微辛山葵', ja: '香ばしい胡麻の風味' },
  },
  {
    id: 'lime-herb',
    swatch: '#6BBF59',
    price: 0,
    kcal: 65,
    names: { ko: '라임 바질 비네거', en: 'Lime Herb Vinaigrette', zh: '青柠罗勒油醋汁', ja: 'ライムハーブ' },
    descriptions: { ko: '가장 가볍고 산뜻한 저칼로리 소스', en: 'Fresh & low-calorie citrus herb', zh: '轻盈低卡草本风味', ja: '低カロリーで爽やか' },
  },
];

export const SIGNATURE_PRESETS: SignaturePreset[] = [
  {
    id: 'pono-signature',
    price: 12800,
    names: { ko: '포노 밸런스 시그니처', en: 'Pono Balance Signature', zh: 'PONO 均衡招牌碗', ja: 'ポノ・バランスシグネチャー' },
    descriptions: { ko: '현미밥·채소믹스 반반, 연어·크랩, 적채·옥수수·해초', en: 'Half greens & brown rice, salmon & crab, 3 toppings', zh: '双拼基底、三文鱼蟹肉、三色配菜', ja: '玄米＆グリーン半々、サーモン＆クラブ、3種トッピング' },
    baseMix: 2,
    baseRice: 2,
    proteinId: 'salmon-crab',
    toppings: { redcabbage: 2, corn: 2, seaweed: 2 },
    dressingId: 'oriental-yuzu',
  },
  {
    id: 'high-protein-fit',
    price: 12400,
    names: { ko: '하이 프로틴 핏 볼', en: 'High-Protein Fit Bowl', zh: '高蛋白轻健身碗', ja: 'ハイプロテイン・フィット' },
    descriptions: { ko: '채소 믹스 위주 베이스에 닭가슴살과 해초·적채', en: 'Greens-forward base, chicken, seaweed & red cabbage', zh: '大量蔬菜基底搭配鸡胸肉与海藻', ja: 'サラダ中心にチキンと海藻・レッドキャベツ' },
    baseMix: 3,
    baseRice: 1,
    proteinId: 'sous-vide-chicken',
    toppings: { redcabbage: 2, corn: 1, seaweed: 3 },
    dressingId: 'lime-herb',
  },
  {
    id: 'spicy-salmon-lover',
    price: 13900,
    names: { ko: '스파이시 생연어 러버', en: 'Spicy Salmon Lover', zh: '辣味三文鱼人气碗', ja: 'スパイシー生サーモン' },
    descriptions: { ko: '생연어에 스리라차 마요, 스위트콘과 해초의 조화', en: 'Fresh salmon, corn, seaweed & sriracha mayo', zh: '鲜三文鱼配玉米、海藻与辣蛋黄酱', ja: '生サーモンとコーンにシラチャーマヨ' },
    baseMix: 1,
    baseRice: 2,
    proteinId: 'raw-salmon',
    toppings: { redcabbage: 2, corn: 3, seaweed: 2 },
    dressingId: 'sriracha-mayo',
  },
];

export function createDefaultBowl(): BowlConfig {
  return {
    id: 'custom-' + Date.now(),
    name: 'custom',
    portions: {
      mix: 2,
      redcabbage: 2,
      corn: 2,
      seaweed: 2,
      rice: 2,
    },
    proteinId: 'salmon-crab',
    dressingId: 'oriental-yuzu',
    avocadoExtra: false,
  };
}

export function calculateBowlMetrics(bowl: BowlConfig) {
  const protein = PROTEINS.find((p) => p.id === bowl.proteinId) || PROTEINS[0];
  const dressing = DRESSINGS.find((d) => d.id === bowl.dressingId) || DRESSINGS[0];

  let price = BASE_BOWL_PRICE + protein.price + dressing.price;
  let kcal = protein.kcal + dressing.kcal;
  let proteinG = protein.proteinG;
  let carbG = protein.carbG;
  let fiberG = protein.fiberG;

  if (bowl.avocadoExtra) {
    price += AVOCADO_PRICE;
    kcal += 140;
    proteinG += 2;
    carbG += 4;
    fiberG += 6;
  }

  INGREDIENTS.forEach((ing) => {
    const lvl: PortionLevel = bowl.portions[ing.k] ?? 0;
    if (lvl > 0) {
      const mult = lvl === 1 ? 0.6 : lvl === 2 ? 1 : 1.5;
      kcal += ing.kcalPerUnit * mult;
      proteinG += ing.proteinGPerUnit * mult;
      carbG += ing.carbGPerUnit * mult;
      fiberG += ing.fiberGPerUnit * mult;
      if (lvl === 3) {
        price += ing.extraPrice;
      }
    }
  });

  return {
    price: Math.round(price / 100) * 100,
    kcal: Math.round(kcal),
    proteinG: Math.round(proteinG),
    carbG: Math.round(carbG),
    fiberG: Math.round(fiberG),
  };
}

export function formatKRW(amount: number): string {
  return '₩' + amount.toLocaleString('ko-KR');
}
