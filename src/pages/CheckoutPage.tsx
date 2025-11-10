import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { useLoyaltyStore } from '../store/loyaltyStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { formatPrice } from '../utils/helpers';
import { validatePhone, normalizePhone } from '../utils/helpers';
import type { Order } from '../types';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    items,
    deliveryType,
    deliveryAddress,
    subtotal,
    deliveryPrice,
    total,
    setDeliveryAddress,
    clearCart,
  } = useCartStore();

  const addOrder = useUserStore((state) => state.addOrder);
  const addPoints = useLoyaltyStore((state) => state.addPoints);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('cash');
  const [address, setAddress] = useState(deliveryAddress || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!contactName.trim()) {
      newErrors.contactName = 'Введите ваше имя';
    }
    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'Введите номер телефона';
    } else if (!validatePhone(contactPhone)) {
      newErrors.contactPhone = 'Введите корректный номер телефона';
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create order
    const order: Order = {
      id: `order-${Date.now()}`,
      items,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? address : undefined,
      contactName: contactName.trim(),
      contactPhone: normalizePhone(contactPhone),
      paymentMethod,
      subtotal,
      deliveryPrice,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Calculate loyalty points
    const pointsEarned = Math.floor(subtotal);
    if (pointsEarned > 0) {
      addPoints(pointsEarned, `Заказ #${order.id}`, order.id);
      order.loyaltyPointsEarned = pointsEarned;
    }

    addOrder(order);
    clearCart();
    setIsSubmitting(false);

    navigate('/checkout/success', { state: { orderId: order.id } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 uppercase tracking-tight">Оформление заказа</h1>

      {/* Contact Information */}
      <Card className="p-4 space-y-4 border-dark-800">
        <h2 className="font-semibold text-lg text-gray-100">Контактная информация</h2>
        <Input
          label="Имя"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          error={errors.contactName}
          required
          placeholder="Введите ваше имя"
        />
        <Input
          label="Телефон"
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          error={errors.contactPhone}
          required
          placeholder="+7 (999) 123-45-67"
        />
      </Card>

      {/* Delivery Address */}
      {deliveryType === 'delivery' && (
        <Card className="p-4 space-y-4 border-dark-800">
          <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-100">
            <MapPin size={20} className="text-primary-500" />
            Адрес доставки
          </h2>
          <Input
            label="Адрес"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setDeliveryAddress(e.target.value);
            }}
            error={errors.address}
            required
            placeholder="Улица, дом, квартира"
          />
        </Card>
      )}

      {/* Payment Method */}
      <Card className="p-4 space-y-4 border-dark-800">
        <h2 className="font-semibold text-lg text-gray-100">Способ оплаты</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              paymentMethod === 'cash'
                ? 'border-primary-600 bg-primary-900'
                : 'border-dark-700 hover:border-dark-600 bg-dark-800'
            }`}
          >
            <Wallet size={24} className="mb-2 text-primary-500" />
            <div className="font-medium text-gray-100">Наличные</div>
            <div className="text-sm text-gray-400">При получении</div>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('online')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              paymentMethod === 'online'
                ? 'border-primary-600 bg-primary-900'
                : 'border-dark-700 hover:border-dark-600 bg-dark-800'
            }`}
          >
            <CreditCard size={24} className="mb-2 text-primary-500" />
            <div className="font-medium text-gray-100">Онлайн</div>
            <div className="text-sm text-gray-400">Картой</div>
          </button>
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="p-4 space-y-3 sticky bottom-24 bg-dark-900 sm:static border-dark-800">
        <h2 className="font-semibold text-lg text-gray-100">Итого</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>Товары ({items.length})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Доставка</span>
            <span>
              {deliveryType === 'pickup' || deliveryPrice === 0
                ? 'Бесплатно'
                : formatPrice(deliveryPrice)}
            </span>
          </div>
          <div className="border-t border-dark-800 pt-2 flex justify-between text-lg font-bold">
            <span className="text-gray-100">К оплате</span>
            <span className="text-primary-500">{formatPrice(total)}</span>
          </div>
        </div>
        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
        </Button>
      </Card>
    </form>
  );
};

export default CheckoutPage;
