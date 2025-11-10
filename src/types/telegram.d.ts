interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      photo_url?: string;
    };
  };
  BackButton: {
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
  };
  MainButton: {
    setText(text: string): void;
    onClick(callback: () => void): void;
    show(): void;
    hide(): void;
    showProgress(): void;
    hideProgress(): void;
  };
}

interface Telegram {
  WebApp: TelegramWebApp;
}

interface Window {
  Telegram?: Telegram;
}

