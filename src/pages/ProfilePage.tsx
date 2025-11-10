import { useState } from 'react';
import { User, Package, Settings, LogOut, Phone, Mail } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { formatPrice, formatDate } from '../utils/helpers';
import type { Order } from '../types';

const ProfilePage = () => {
  const { user, orders, setUser } = useUserStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Mock user if not set
  const currentUser = user || {
    id: 'user-1',
    name: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusMap = {
      pending: { variant: 'warning' as const, label: 'Ожидает' },
      confirmed: { variant: 'primary' as const, label: 'Подтвержден' },
      preparing: { variant: 'primary' as const, label: 'Готовится' },
      ready: { variant: 'success' as const, label: 'Готов' },
      delivered: { variant: 'success' as const, label: 'Доставлен' },
      cancelled: { variant: 'danger' as const, label: 'Отменен' },
    };
    const statusInfo = statusMap[status];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      setUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Профиль</h1>

      {/* User Info */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <p className="text-gray-600 text-sm">{currentUser.phone}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {currentUser.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} />
              <span>{currentUser.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={16} />
            <span>{currentUser.phone}</span>
          </div>
        </div>
      </Card>

      {/* Orders History */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Package size={20} />
          История заказов
        </h2>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                hover
                onClick={() => handleOrderClick(order)}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">Заказ #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'товар' : 'товаров'}
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Package size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">У вас пока нет заказов</p>
          </Card>
        )}
      </div>

      {/* Settings */}
      <Card className="p-4">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Settings size={20} />
          Настройки
        </h2>
        <div className="space-y-2">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            Уведомления
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            Адреса доставки
          </button>
        </div>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        fullWidth
        onClick={handleLogout}
        className="text-red-600 border-red-300 hover:bg-red-50"
      >
        <LogOut size={20} className="mr-2 inline" />
        Выйти
      </Button>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={selectedOrder ? `Заказ #${selectedOrder.id.slice(-6)}` : ''}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Статус</span>
              {getStatusBadge(selectedOrder.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Дата</span>
              <span>{formatDate(selectedOrder.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Способ получения</span>
              <span>
                {selectedOrder.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
              </span>
            </div>
            {selectedOrder.deliveryAddress && (
              <div>
                <span className="text-gray-600">Адрес доставки</span>
                <p className="mt-1">{selectedOrder.deliveryAddress}</p>
              </div>
            )}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-3">Товары</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Товары</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span>
                  {selectedOrder.deliveryPrice === 0
                    ? 'Бесплатно'
                    : formatPrice(selectedOrder.deliveryPrice)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Итого</span>
                <span className="text-primary-600">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
              {selectedOrder.loyaltyPointsEarned && (
                <div className="pt-2 text-sm text-primary-600">
                  Начислено баллов: +{selectedOrder.loyaltyPointsEarned}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProfilePage;
