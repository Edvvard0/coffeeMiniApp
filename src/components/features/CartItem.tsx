import { Plus, Minus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import Card from '../ui/Card';
import { formatPrice } from '../../utils/helpers';
import { useCartStore } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const calculateItemPrice = () => {
    let price = item.product.price;
    
    // Add options prices
    if (item.selectedOptions) {
      Object.entries(item.selectedOptions).forEach(([optionId, valueId]) => {
        const option = item.product.options?.find((opt) => opt.id === optionId);
        const value = option?.values.find((v) => v.id === valueId);
        if (value) {
          price += value.price;
        }
      });
    }
    
    return price * item.quantity;
  };

  const getSelectedOptionsText = () => {
    if (!item.selectedOptions || Object.keys(item.selectedOptions).length === 0) {
      return null;
    }

    const options: string[] = [];
    Object.entries(item.selectedOptions).forEach(([optionId, valueId]) => {
      const option = item.product.options?.find((opt) => opt.id === optionId);
      const value = option?.values.find((v) => v.id === valueId);
      if (option && value) {
        options.push(`${option.name}: ${value.name}`);
      }
    });

    return options.join(', ');
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%231f2937" width="80" height="80"/%3E%3Ctext fill="%2322c55e" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 text-gray-100">{item.product.name}</h3>
          {getSelectedOptionsText() && (
            <p className="text-sm text-gray-400 mb-2">{getSelectedOptionsText()}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="text-lg font-bold text-primary-500">
              {formatPrice(calculateItemPrice())}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-lg">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1.5 hover:bg-dark-700 transition-colors rounded-l-lg text-gray-300"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 font-medium min-w-[2rem] text-center text-gray-100">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1.5 hover:bg-dark-700 transition-colors rounded-r-lg text-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-500 hover:bg-red-900 rounded-lg transition-colors border border-red-800"
                aria-label="Удалить"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;

