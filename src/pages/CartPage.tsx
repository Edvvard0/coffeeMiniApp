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
      <h1 className="text-2xl sm:text-3xl font-bold">Корзина</h1>

      {/* Delivery Type Selection */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Способ получения</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setDeliveryType('pickup')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              deliveryType === 'pickup'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Store size={24} className="mb-2 text-primary-600" />
            <div className="font-medium">Самовывоз</div>
            <div className="text-sm text-gray-600">Бесплатно</div>
          </button>
          <button
            onClick={() => setDeliveryType('delivery')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              deliveryType === 'delivery'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Truck size={24} className="mb-2 text-primary-600" />
            <div className="font-medium">Доставка</div>
            <div className="text-sm text-gray-600">
              {isFreeDelivery ? 'Бесплатно' : formatPrice(deliveryPrice)}
            </div>
          </button>
        </div>
        {deliveryType === 'delivery' && !isFreeDelivery && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
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
      <Card className="p-4 space-y-3 sticky bottom-24 bg-white sm:static">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Товары</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Доставка</span>
            <span>
              {deliveryType === 'pickup' || isFreeDelivery
                ? 'Бесплатно'
                : formatPrice(deliveryPrice)}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold">
            <span>Итого</span>
            <span className="text-primary-600">{formatPrice(total)}</span>
          </div>
        </div>
        <Link to="/checkout">
          <Button fullWidth size="lg" className="flex items-center justify-center gap-2">
            Оформить заказ
            <ArrowRight size={20} />
          </Button>
        </Link>
        <Link to="/menu" className="block text-center text-sm text-gray-600 hover:text-gray-900">
          Продолжить покупки
        </Link>
      </Card>
    </div>
  );
};

export default CartPage;
