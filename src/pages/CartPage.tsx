import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Store, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/features/CartItem';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { formatPrice } from '../utils/helpers';
import { FREE_DELIVERY_THRESHOLD } from '../utils/constants';

const CartPage = () => {
  const {
    items,
    deliveryType,
    subtotal,
    deliveryPrice,
    total,
    setDeliveryType,
  } = useCartStore();

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={48} />}
        title="Корзина пуста"
        description="Добавьте товары из меню, чтобы оформить заказ"
        action={
          <Link to="/menu">
            <Button>Перейти в меню</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 uppercase tracking-tight">Корзина</h1>

      {/* Delivery Type Selection */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3 text-gray-100">Способ получения</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setDeliveryType('pickup')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              deliveryType === 'pickup'
                ? 'border-primary-600 bg-primary-900'
                : 'border-dark-700 hover:border-dark-600'
            }`}
          >
            <Store size={24} className="mb-2 text-primary-500" />
            <div className="font-medium text-gray-100">Самовывоз</div>
            <div className="text-sm text-gray-400">Бесплатно</div>
          </button>
          <button
            onClick={() => setDeliveryType('delivery')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              deliveryType === 'delivery'
                ? 'border-primary-600 bg-primary-900'
                : 'border-dark-700 hover:border-dark-600'
            }`}
          >
            <Truck size={24} className="mb-2 text-primary-500" />
            <div className="font-medium text-gray-100">Доставка</div>
            <div className="text-sm text-gray-400">
              {isFreeDelivery ? 'Бесплатно' : formatPrice(deliveryPrice)}
            </div>
          </button>
        </div>
        {deliveryType === 'delivery' && !isFreeDelivery && (
          <div className="mt-3 p-3 bg-primary-900 border border-primary-700 rounded-lg text-sm text-primary-300">
            Добавьте товаров на {formatPrice(remainingForFreeDelivery)} для бесплатной доставки
          </div>
        )}
      </Card>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Order Summary */}
      <Card className="p-4 space-y-3 sticky bottom-24 bg-dark-900 sm:static">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>Товары</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Доставка</span>
            <span>
              {deliveryType === 'pickup' || isFreeDelivery
                ? 'Бесплатно'
                : formatPrice(deliveryPrice)}
            </span>
          </div>
          <div className="border-t border-dark-800 pt-2 flex justify-between text-lg font-bold">
            <span className="text-gray-100">Итого</span>
            <span className="text-primary-500">{formatPrice(total)}</span>
          </div>
        </div>
        <Link to="/checkout">
          <Button fullWidth size="lg" className="flex items-center justify-center gap-2">
            Оформить заказ
            <ArrowRight size={20} />
          </Button>
        </Link>
        <Link to="/menu" className="block text-center text-sm text-gray-400 hover:text-gray-300">
          Продолжить покупки
        </Link>
      </Card>
    </div>
  );
};

export default CartPage;
