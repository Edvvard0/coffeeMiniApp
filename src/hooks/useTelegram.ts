import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getTelegramWebApp, isTelegram } from '../services/telegram';

export const useTelegramBackButton = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isTelegram()) return;
    const webApp = getTelegramWebApp();
    if (!webApp) return;

    if (location.pathname !== '/' && location.pathname !== '/menu') {
      webApp.BackButton.show();
    } else {
      webApp.BackButton.hide();
    }
  }, [location.pathname]);
};

