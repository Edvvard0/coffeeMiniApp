import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ChatPage = () => {
  const { messages, isOnline, addMessage } = useChatStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      addMessage(inputText.trim(), 'user');
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)]">
      {/* Status Bar */}
      <Card className="p-3 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-600">
            {isOnline ? 'Онлайн' : 'Офлайн'}
          </span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            Обычно отвечаем в течение минуты
          </span>
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[70%] ${
                  isUser
                    ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white border border-gray-200 rounded-2xl rounded-tl-sm'
                } p-3`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.text}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isUser ? 'text-primary-100' : 'text-gray-400'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card className="p-3 sticky bottom-24 sm:static">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={!isOnline}
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || !isOnline}
            className="px-4"
          >
            <Send size={20} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
