import { useEffect, useState } from 'react';
import { StaffCallModal } from './components/AccessibilityOverlays';
import { BowlBuilderScreen } from './components/BowlBuilderScreen';
import { CheckoutScreen, OrderCompleteScreen } from './components/CheckoutScreen';
import { StartScreen } from './components/StartScreen';
import { calculateBowlMetrics } from './data/menu';
import { TRANSLATIONS } from './data/translations';
import { BowlConfig, CartItem, DiningMode, KioskScreen, Lang } from './types/kiosk';

export default function App() {
  const [scale, setScale] = useState(1);
  const [screen, setScreen] = useState<KioskScreen>('start');
  const [lang, setLang] = useState<Lang>('ko');
  const [diningMode, setDiningMode] = useState<DiningMode>('dine-in');
  const [lowReachMode, setLowReachMode] = useState(false);
  const [magnifierMode, setMagnifierMode] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState('104');

  const copy = TRANSLATIONS[lang];

  // Responsive 1080x1920 kiosk stage scaling matching the reference prototype
  useEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const handleAddToCart = (bowl: BowlConfig) => {
    const metrics = calculateBowlMetrics(bowl);
    setCart((prev) => [
      ...prev,
      {
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        bowl,
        quantity: 1,
        unitPrice: metrics.price,
        kcal: metrics.kcal,
        proteinG: metrics.proteinG,
        carbG: metrics.carbG,
        fiberG: metrics.fiberG,
      },
    ]);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetAll = () => {
    setCart([]);
    setScreen('start');
  };

  return (
    <div className="relative w-full h-full bg-[#F4F5F2] overflow-hidden">
      <div
        id="stage"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1080,
          height: 1920,
          transformOrigin: 'center',
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
        className="bg-white overflow-hidden shadow-[0_24px_80px_rgba(31,107,69,0.12)]"
      >
        {screen === 'start' && (
          <StartScreen
            lang={lang}
            copy={copy}
            lowReachMode={lowReachMode}
            magnifierMode={magnifierMode}
            onChangeLang={setLang}
            onToggleLowReach={() => setLowReachMode((v) => !v)}
            onToggleMagnifier={() => setMagnifierMode((v) => !v)}
            onStaffCall={() => setStaffModalOpen(true)}
            onStart={() => setScreen('builder')}
          />
        )}

        {screen === 'builder' && (
          <BowlBuilderScreen
            lang={lang}
            copy={copy}
            diningMode={diningMode}
            lowReachMode={lowReachMode}
            magnifierMode={magnifierMode}
            cart={cart}
            onChangeLang={setLang}
            onChangeDiningMode={setDiningMode}
            onToggleLowReach={() => setLowReachMode((v) => !v)}
            onStaffCall={() => setStaffModalOpen(true)}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            onProceedCheckout={() => setScreen('checkout')}
            onBackToStart={() => setScreen('start')}
          />
        )}

        {screen === 'checkout' && (
          <CheckoutScreen
            copy={copy}
            diningMode={diningMode}
            cart={cart}
            onBack={() => setScreen('builder')}
            onCompletePayment={(num) => {
              setOrderNumber(num);
              setScreen('complete');
            }}
          />
        )}

        {screen === 'complete' && (
          <OrderCompleteScreen
            copy={copy}
            orderNumber={orderNumber}
            onResetAll={handleResetAll}
          />
        )}

        <StaffCallModal
          open={staffModalOpen}
          copy={copy}
          onClose={() => setStaffModalOpen(false)}
        />
      </div>
    </div>
  );
}
