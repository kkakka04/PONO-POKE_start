import { Lang } from '../types/kiosk';

export interface KioskCopy {
  touchToStart: string;
  sloganSub: string;
  a11yWheelchair: string;
  a11yMagnifier: string;
  a11yStaffCall: string;
  a11yWheelchairOn: string;
  a11yMagnifierOn: string;
  staffCallTitle: string;
  staffCallBody: string;
  staffCallConfirm: string;
  backToStart: string;
  dineIn: string;
  takeout: string;
  stepSignature: string;
  stepBase: string;
  stepProtein: string;
  stepToppings: string;
  stepDressing: string;
  portionNone: string;
  portionLight: string;
  portionRegular: string;
  portionExtra: string;
  avocadoTitle: string;
  avocadoDesc: string;
  balanceScoreTitle: string;
  carbsLabel: string;
  proteinLabel: string;
  veggieLabel: string;
  caloriesUnit: string;
  gramsUnit: string;
  addToTray: string;
  updateBowl: string;
  resetBowl: string;
  trayTitle: string;
  trayEmpty: string;
  checkoutBtn: string;
  totalLabel: string;
  itemsCount: string;
  paymentTitle: string;
  paymentSubtitle: string;
  payCard: string;
  payApp: string;
  payNaver: string;
  payKakao: string;
  payNow: string;
  backToBuilder: string;
  orderCompleteTitle: string;
  orderNumberLabel: string;
  orderCompleteDesc: string;
  newOrderBtn: string;
  customBowlName: string;
  liveBowlCaption: string;
  nextStep: string;
}

export const TRANSLATIONS: Record<Lang, KioskCopy> = {
  ko: {
    touchToStart: '화면을 터치해 주세요',
    sloganSub: '내가 직접 맞추고, 눈으로 확인하는 한 그릇',
    a11yWheelchair: '낮은 화면 모드',
    a11yMagnifier: '큰 글씨 모드',
    a11yStaffCall: '직원 호출',
    a11yWheelchairOn: '낮은 화면 (휠체어) 모드 활성화됨',
    a11yMagnifierOn: '큰 글씨 확대 모드 활성화됨',
    staffCallTitle: '직원을 호출했습니다',
    staffCallBody: '잠시만 기다려 주시면 담당 직원이 키오스크 앞으로 신속히 안내해 드리겠습니다.',
    staffCallConfirm: '확인',
    backToStart: '처음으로',
    dineIn: '매장 식사',
    takeout: '포장 주문',
    stepSignature: '추천 조합',
    stepBase: '1. 베이스',
    stepProtein: '2. 프로틴',
    stepToppings: '3. 밸런스 토핑',
    stepDressing: '4. 드레싱',
    portionNone: '제외',
    portionLight: '적게',
    portionRegular: '보통',
    portionExtra: '많이',
    avocadoTitle: '신선한 아보카도 추가',
    avocadoDesc: '크리미한 식감과 건강한 지방 밸런스 (+140 kcal)',
    balanceScoreTitle: '내 그릇 실시간 밸런스',
    carbsLabel: '탄수화물',
    proteinLabel: '단백질',
    veggieLabel: '식이섬유·채소',
    caloriesUnit: 'kcal',
    gramsUnit: 'g',
    addToTray: '장바구니 담기',
    updateBowl: '조합 반영하기',
    resetBowl: '초기화',
    trayTitle: '주문 내역',
    trayEmpty: '원하는 재료를 맞춰 장바구니에 담아보세요',
    checkoutBtn: '결제하기',
    totalLabel: '총 결제금액',
    itemsCount: '개',
    paymentTitle: '결제 수단을 선택해 주세요',
    paymentSubtitle: '선택하신 그릇의 영양 밸런스와 주문 내역을 확인 후 결제를 진행합니다.',
    payCard: '신용 / 체크카드',
    payApp: '애플페이 / 삼성페이',
    payNaver: '네이버페이',
    payKakao: '카카오페이',
    payNow: '결제 완료하기',
    backToBuilder: '메뉴 수정',
    orderCompleteTitle: '주문이 접수되었습니다',
    orderNumberLabel: '호출 번호',
    orderCompleteDesc: '신선한 재료로 정성껏 준비해 드리겠습니다. 모니터에서 호출 번호를 확인해 주세요.',
    newOrderBtn: '새 주문 시작하기',
    customBowlName: '나만의 커스텀 포케',
    liveBowlCaption: '선택량에 따라 실시간으로 변하는 그릇',
    nextStep: '다음 단계',
  },
  en: {
    touchToStart: 'Touch to start',
    sloganSub: 'Build your own balance, and see it',
    a11yWheelchair: 'Low-reach Mode',
    a11yMagnifier: 'Large Text',
    a11yStaffCall: 'Call Staff',
    a11yWheelchairOn: 'Low-reach accessibility mode active',
    a11yMagnifierOn: 'Large text magnification active',
    staffCallTitle: 'Staff has been notified',
    staffCallBody: 'A team member will be right with you at this kiosk to assist with your order.',
    staffCallConfirm: 'Got it',
    backToStart: 'Start Over',
    dineIn: 'Dine In',
    takeout: 'Takeout',
    stepSignature: 'Signatures',
    stepBase: '1. Base',
    stepProtein: '2. Protein',
    stepToppings: '3. Toppings',
    stepDressing: '4. Dressing',
    portionNone: 'None',
    portionLight: 'Light',
    portionRegular: 'Regular',
    portionExtra: 'Extra',
    avocadoTitle: 'Add Fresh Avocado',
    avocadoDesc: 'Creamy texture & healthy plant fats (+140 kcal)',
    balanceScoreTitle: 'Live Bowl Balance',
    carbsLabel: 'Carbs',
    proteinLabel: 'Protein',
    veggieLabel: 'Fiber & Greens',
    caloriesUnit: 'kcal',
    gramsUnit: 'g',
    addToTray: 'Add to Order',
    updateBowl: 'Update Bowl',
    resetBowl: 'Reset',
    trayTitle: 'Your Order',
    trayEmpty: 'Customize your bowl proportions and add to order',
    checkoutBtn: 'Checkout',
    totalLabel: 'Total',
    itemsCount: 'items',
    paymentTitle: 'Select Payment Method',
    paymentSubtitle: 'Review your customized nutritional balance and complete payment.',
    payCard: 'Credit / Debit Card',
    payApp: 'Apple Pay / Tap',
    payNaver: 'Naver Pay',
    payKakao: 'Kakao Pay',
    payNow: 'Complete Payment',
    backToBuilder: 'Edit Order',
    orderCompleteTitle: 'Order Confirmed',
    orderNumberLabel: 'Order Number',
    orderCompleteDesc: 'We are preparing your fresh bowl right now. Please watch the pickup screen.',
    newOrderBtn: 'Start New Order',
    customBowlName: 'Custom Balance Bowl',
    liveBowlCaption: 'Rings update live as you tune portions',
    nextStep: 'Next Step',
  },
  zh: {
    touchToStart: '请触摸屏幕',
    sloganSub: '亲手搭配，亲眼确认的一碗',
    a11yWheelchair: '低位模式',
    a11yMagnifier: '大字模式',
    a11yStaffCall: '呼叫店员',
    a11yWheelchairOn: '已开启低位无障碍模式',
    a11yMagnifierOn: '已开启大字体显示模式',
    staffCallTitle: '已为您呼叫店员',
    staffCallBody: '工作人员正在赶来，请稍候片刻。',
    staffCallConfirm: '确定',
    backToStart: '返回首页',
    dineIn: '堂食',
    takeout: '打包外带',
    stepSignature: '招牌推荐',
    stepBase: '1. 基底',
    stepProtein: '2. 蛋白质',
    stepToppings: '3. 均衡配菜',
    stepDressing: '4. 酱汁',
    portionNone: '不加',
    portionLight: '少放',
    portionRegular: '标准',
    portionExtra: '加量',
    avocadoTitle: '加鲜切牛油果',
    avocadoDesc: '绵密口感与优质植物脂肪 (+140 kcal)',
    balanceScoreTitle: '实时营养均衡',
    carbsLabel: '碳水化合物',
    proteinLabel: '蛋白质',
    veggieLabel: '膳食纤维',
    caloriesUnit: 'kcal',
    gramsUnit: 'g',
    addToTray: '加入订单',
    updateBowl: '更新碗装',
    resetBowl: '重置',
    trayTitle: '已选餐品',
    trayEmpty: '自由调整配料比例并加入订单',
    checkoutBtn: '去结算',
    totalLabel: '合计金额',
    itemsCount: '份',
    paymentTitle: '请选择支付方式',
    paymentSubtitle: '确认营养搭配与订单明细后完成支付。',
    payCard: '银行卡 / 信用卡',
    payApp: 'Apple Pay / 闪付',
    payNaver: 'Naver Pay',
    payKakao: 'Kakao Pay',
    payNow: '确认支付',
    backToBuilder: '返回修改',
    orderCompleteTitle: '下单成功',
    orderNumberLabel: '取餐号',
    orderCompleteDesc: '我们正在为您新鲜制作，请留意屏幕取餐叫号。',
    newOrderBtn: '开始新点餐',
    customBowlName: '自定义均衡波奇碗',
    liveBowlCaption: '圆环比例随配料份量实时变化',
    nextStep: '下一步',
  },
  ja: {
    touchToStart: '画面にタッチしてください',
    sloganSub: '自分で合わせて、目で確かめる一杯',
    a11yWheelchair: 'ローポジション',
    a11yMagnifier: '文字拡大',
    a11yStaffCall: 'スタッフ呼出',
    a11yWheelchairOn: '車椅子・ローポジションモード有効',
    a11yMagnifierOn: '文字拡大モード有効',
    staffCallTitle: 'スタッフをお呼びしました',
    staffCallBody: '担当スタッフがまもなくお伺いいたします。少々お待ちください。',
    staffCallConfirm: '確認',
    backToStart: '最初に戻る',
    dineIn: '店内飲食',
    takeout: 'お持ち帰り',
    stepSignature: 'おすすめ',
    stepBase: '1. ベース',
    stepProtein: '2. プロテイン',
    stepToppings: '3. トッピング',
    stepDressing: '4. ドレッシング',
    portionNone: 'なし',
    portionLight: '少なめ',
    portionRegular: '標準',
    portionExtra: '多め',
    avocadoTitle: 'フレッシュアボカド追加',
    avocadoDesc: 'クリーミーな食感と良質な脂質 (+140 kcal)',
    balanceScoreTitle: 'リアルタイム栄養バランス',
    carbsLabel: '炭水化物',
    proteinLabel: 'たんぱく質',
    veggieLabel: '食物繊維・野菜',
    caloriesUnit: 'kcal',
    gramsUnit: 'g',
    addToTray: '注文に追加',
    updateBowl: 'ボウルを更新',
    resetBowl: 'リセット',
    trayTitle: 'ご注文内容',
    trayEmpty: '具材のバランスを調整してカートに追加してください',
    checkoutBtn: 'お会計へ',
    totalLabel: '合計金額',
    itemsCount: '点',
    paymentTitle: 'お支払い方法を選択',
    paymentSubtitle: '栄養バランスと注文内容をご確認のうえお支払いください。',
    payCard: 'クレジットカード',
    payApp: 'Apple Pay / タッチ決済',
    payNaver: 'Naver Pay',
    payKakao: 'Kakao Pay',
    payNow: '支払いを完了する',
    backToBuilder: '注文を修正',
    orderCompleteTitle: 'ご注文を受け付けました',
    orderNumberLabel: '呼出番号',
    orderCompleteDesc: '新鮮な食材でお作りしています。モニターの番号をご確認ください。',
    newOrderBtn: '新しい注文を始める',
    customBowlName: 'マイバランス・ポキボウル',
    liveBowlCaption: '量に合わせてリングがリアルタイムに変化します',
    nextStep: '次へ',
  },
};
