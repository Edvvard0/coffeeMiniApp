import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import Badge from '../ui/Badge';

const Header = () => {
  const itemCount = useCartStore((state) => 
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="bg-dark-900 border-b border-dark-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-primary-500 hover:text-primary-400 transition-colors tracking-tight">
            COFFEE HOUSE
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-300 hover:text-primary-500 transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <Badge
                  variant="primary"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-primary-600"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
            </Link>
            <Link
              to="/profile"
              className="p-2 text-gray-300 hover:text-primary-500 transition-colors"
              aria-label="Профиль"
            >
              <User size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

