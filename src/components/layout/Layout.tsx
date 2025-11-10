import type { ReactNode } from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { useTelegramBackButton } from '../../hooks/useTelegram';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useTelegramBackButton();
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 sm:pb-24">
      <Header />
      <main className="container mx-auto px-4 py-4 max-w-screen-lg">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;

