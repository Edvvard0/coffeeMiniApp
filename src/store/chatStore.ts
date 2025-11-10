import { create } from 'zustand';
import type { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isOnline: boolean;
  addMessage: (text: string, sender: 'user' | 'cafe') => void;
  setOnlineStatus: (isOnline: boolean) => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    text: 'Добро пожаловать в Coffee House! Чем могу помочь?',
    sender: 'cafe',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const useChatStore = create<ChatState>((set) => ({
  messages: initialMessages,
  isOnline: true,

  addMessage: (text, sender) => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));

    // Auto-reply from cafe (mock)
    if (sender === 'user') {
      setTimeout(() => {
        const replies = [
          'Спасибо за сообщение! Мы обязательно ответим в ближайшее время.',
          'Понял, передам информацию нашим сотрудникам.',
          'Отлично! Будем рады помочь.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: `msg-${Date.now()}`,
              text: randomReply,
              sender: 'cafe',
              timestamp: new Date().toISOString(),
            },
          ],
        }));
      }, 1000);
    }
  },

  setOnlineStatus: (isOnline) => set({ isOnline }),
}));

