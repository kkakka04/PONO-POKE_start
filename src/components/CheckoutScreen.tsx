import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { formatKRW } from '../data/menu';
import { KioskCopy } from '../data/translations';
import { CartItem, DiningMode } from '../types/kiosk';
import { PonoLogo } from './PonoLogo';

interface CheckoutScreenProps {
  copy: KioskCopy;
  diningMode: DiningMode;
  cart: CartItem[];
  onBack: () => void;
  onCompletePayment: (orderNumber: string) => void;
}

type PayMethod = 'card' | 'app' | 'naver' | 'kakao';

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  copy,
  diningMode,
  cart,
  onBack,
  onCompletePayment,
}) => {
  const [method, setMethod] = useState<PayMethod>('card');

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const paymentOptions: { id: PayMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'card', label: copy.payCard, icon: <CreditCard className="w-11 h-11" /> },
    { id: 'app', label: copy.payApp, icon: <Smartphone className="w-11 h-11" /> },
    { id: 'naver', label: copy.payNaver, icon: <Wallet className="w-11 h-11" /> },
    { id: 'kakao', label: copy.payKakao, icon: <Wallet className="w-11 h-11" /> },
  ];

  const handlePay = () => {
    const num = String(Math.floor(100 + Math.random() * 899));
    onCompletePayment(num);
  };

  return (
    <div className="relative w-[1080px] h-[1920px] bg-[#FAFBF9] flex flex-col overflow-hidden select-none">
      <header className="h-[116px] px-10 bg-white border-b border-[#E6ECE2] flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="h-[62px] px-6 rounded-full border-2 border-[#DCE7D6] bg-white text-[#1F4D2B] text-[23px] font-bold flex items-center gap-3 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>{copy.backToBuilder}</span>
        </button>
        <PonoLogo className="w-[180px]" />
        <span className="text-[24px] font-bold text-[#1F4D2B]">
          {diningMode === 'dine-in' ? copy.dineIn : copy.takeout}
        </span>
      </header>

      <main className="flex-1 px-12 py-12 flex flex-col justify-between overflow-y-auto kiosk-scroll">
        <div>
          <h1 className="text-[50px] font-bold text-[#1F4D2B] tracking-tight">
            {copy.paymentTitle}
          </h1>
          <p className="mt-3 text-[25px] font-medium text-[#5A6D5E]">
            {copy.paymentSubtitle}
          </p>

          <div className="mt-10 bg-white rounded-[32px] border-2 border-[#E2ECE0] divide-y divide-[#EDF2EA]">
            {cart.map((item) => (
              <div key={item.id} className="px-8 py-6 flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-[28px] font-bold text-[#1F4D2B]">
                    {item.bowl.name} × <span className="font-din">{item.quantity}</span>
                  </h3>
                  <p className="font-din mt-1 text-[21px] font-medium text-[#607365]">
                    {item.kcal} {copy.caloriesUnit} · {copy.proteinLabel} {item.proteinG}{copy.gramsUnit} ·{' '}
                    {copy.carbsLabel} {item.carbG}{copy.gramsUnit} · {copy.veggieLabel} {item.fiberG}{copy.gramsUnit}
                  </p>
                </div>
                <div className="font-din text-[32px] font-bold text-[#1F4D2B] shrink-0">
                  {formatKRW(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
            <div className="px-8 py-7 bg-[#F5F9F2] rounded-b-[30px] flex items-center justify-between">
              <span className="text-[30px] font-bold text-[#1F4D2B]">{copy.totalLabel}</span>
              <span className="font-din text-[46px] font-bold text-[#1F4D2B]">
                {formatKRW(total)}
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6">
            {paymentOptions.map((opt) => {
              const active = method === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMethod(opt.id)}
                  className={`h-[176px] rounded-[32px] border-2 px-8 flex items-center gap-6 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#F1FAE9] border-[#1F4D2B] text-[#1F4D2B] shadow-xs'
                      : 'bg-white border-[#E2ECE0] text-[#4A5D50] hover:border-[#77E024]'
                  }`}
                >
                  {opt.icon}
                  <span className="text-[29px] font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePay}
          className="mt-10 w-full h-[116px] rounded-full bg-[#1F4D2B] text-white text-[36px] font-bold shadow-xl hover:bg-[#173D21] active:scale-[0.99] transition-all cursor-pointer"
        >
          {copy.payNow} · <span className="font-din">{formatKRW(total)}</span>
        </button>
      </main>
    </div>
  );
};

interface OrderCompleteScreenProps {
  copy: KioskCopy;
  orderNumber: string;
  onResetAll: () => void;
}

export const OrderCompleteScreen: React.FC<OrderCompleteScreenProps> = ({
  copy,
  orderNumber,
  onResetAll,
}) => {
  return (
    <div className="relative w-[1080px] h-[1920px] bg-white flex flex-col items-center justify-center px-16 text-center select-none">
      <div className="mb-10">
        <PonoLogo className="w-[480px]" />
      </div>

      <div className="w-36 h-36 rounded-full bg-[#F1FAE9] text-[#1F4D2B] flex items-center justify-center mb-8">
        <CheckCircle2 className="w-20 h-20" strokeWidth={2.2} />
      </div>

      <h1 className="text-[54px] font-bold text-[#1F4D2B] tracking-tight">
        {copy.orderCompleteTitle}
      </h1>

      <div className="mt-10 px-16 py-10 rounded-[40px] bg-[#F5F9F2] border-2 border-[#D4E8C6]">
        <div className="text-[28px] font-bold text-[#5A6D5E]">{copy.orderNumberLabel}</div>
        <div className="font-din mt-2 text-[132px] font-bold text-[#1F4D2B] leading-none">
          #{orderNumber}
        </div>
      </div>

      <p className="mt-10 max-w-[780px] text-[30px] font-medium leading-relaxed text-[#526557]">
        {copy.orderCompleteDesc}
      </p>

      <button
        type="button"
        onClick={onResetAll}
        className="mt-14 h-[112px] px-16 rounded-full bg-[#1F4D2B] text-white text-[34px] font-bold shadow-lg hover:bg-[#173D21] active:scale-95 transition-all cursor-pointer"
      >
        {copy.newOrderBtn}
      </button>
    </div>
  );
};
