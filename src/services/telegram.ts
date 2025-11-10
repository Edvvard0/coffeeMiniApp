import { useUserStore } from '../store/userStore';
import type { User } from '../types';

export const initTelegram = () => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      webApp.ready();
      webApp.expand();
      
      // Set theme colors
      const themeParams = webApp.themeParams;
      if (themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
      }
      if (themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
      }
      if (themeParams.hint_color) {
        document.documentElement.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
      }
      if (themeParams.link_color) {
        document.documentElement.style.setProperty('--tg-theme-link-color', themeParams.link_color);
      }
      if (themeParams.button_color) {
        document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color);
      }
      if (themeParams.button_text_color) {
        document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
      }

      // Sync user data
      const initData = webApp.initDataUnsafe;
      if (initData?.user) {
        const tgUser = initData.user;
        const user: User = {
          id: tgUser.id.toString(),
          name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          phone: '',
          email: undefined,
          avatar: tgUser.photo_url,
        };
        useUserStore.getState().setUser(user);
      }

      // Handle back button
      webApp.BackButton.onClick(() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          webApp.close();
        }
      });

      // Show back button when not on home
      const updateBackButton = () => {
        if (window.location.pathname !== '/' && window.location.pathname !== '/menu') {
          webApp.BackButton.show();
        } else {
          webApp.BackButton.hide();
        }
      };

      window.addEventListener('popstate', updateBackButton);
      updateBackButton();
    }
  } catch (error) {
    console.warn('Telegram WebApp not available:', error);
  }
};

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const isTelegram = (): boolean => {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
};

export const showTelegramMainButton = (text: string, onClick: () => void) => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.MainButton.setText(text);
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();
  }
};

export const hideTelegramMainButton = () => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.MainButton.hide();
  }
};

export const setTelegramMainButtonText = (text: string) => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.MainButton.setText(text);
  }
};

export const setTelegramMainButtonProgress = (show: boolean) => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    if (show) {
      webApp.MainButton.showProgress();
    } else {
      webApp.MainButton.hideProgress();
    }
  }
};

