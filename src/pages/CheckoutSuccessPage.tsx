import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUserStore } from '../store/userStore';

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const orders = useUserStore((state) => state.orders);
  const order = orderId ? orders.find((o) => o.id === orderId) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle size={48} className="text-green-600" />
      </div>
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Заказ оформлен!</h1>
        <p className="text-gray-600">
          {order
            ? `Ваш заказ #${order.id.slice(-6)} принят в обработку`
            : 'Спасибо за ваш заказ!'}
        </p>
      </div>

      {order && (
        <Card className="p-6 w-full max-w-md">
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Номер заказа</span>
              <span className="font-semibold">#{order.id.slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Сумма</span>
              <span className="font-semibold">{order.total} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Способ получения</span>
              <span className="font-semibold">
                {order.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
              </span>
            </div>
            {order.loyaltyPointsEarned && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-primary-600">
                  <span>Начислено баллов</span>
                  <span className="font-semibold">+{order.loyaltyPointsEarned}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link to="/" className="flex-1">
          <Button variant="outline" fullWidth>
            <Home size={20} className="mr-2 inline" />
            На главную
          </Button>
        </Link>
        <Link to="/profile" className="flex-1">
          <Button fullWidth>
            <ShoppingBag size={20} className="mr-2 inline" />
            Мои заказы
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;

