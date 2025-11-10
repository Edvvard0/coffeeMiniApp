import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, Heart, MessageCircle, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/menu', icon: Menu, label: 'Меню' },
    { path: '/loyalty', icon: Heart, label: 'Бонусы' },
    { path: '/chat', icon: MessageCircle, label: 'Чат' },
    { path: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-800 z-50 safe-area-bottom">
      <div className="container mx-auto max-w-screen-lg">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-2 sm:px-4 py-2 transition-colors min-w-[60px] ${
                  isActive
                    ? 'text-primary-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                aria-label={item.label}
              >
                <Icon size={20} className={isActive ? 'scale-110' : ''} />
                <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;

