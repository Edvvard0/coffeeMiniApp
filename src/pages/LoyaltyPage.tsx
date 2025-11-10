import { Gift, TrendingUp, History } from 'lucide-react';
import { useLoyaltyStore } from '../store/loyaltyStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/helpers';
import loyaltyRules from '../data/loyaltyRules.json';

const LoyaltyPage = () => {
  const { balance, transactions, rules } = useLoyaltyStore();

  const currentLevel = loyaltyRules.levels
    .slice()
    .reverse()
    .find((level) => balance >= level.minPoints) || loyaltyRules.levels[0];

  const nextLevel = loyaltyRules.levels.find((level) => level.minPoints > balance);
  const progressToNextLevel = nextLevel
    ? ((balance - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Программа лояльности</h1>

      {/* Balance Card */}
      <Card className="p-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-100 text-sm mb-1">Ваш баланс</p>
            <p className="text-4xl font-bold">{balance}</p>
            <p className="text-primary-100 text-sm mt-1">баллов</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <Gift size={32} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-primary-400">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-100">Текущий уровень</span>
            <Badge variant="default" className="bg-white text-primary-700">
              {currentLevel.name}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Progress to Next Level */}
      {nextLevel && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              До уровня "{nextLevel.name}"
            </span>
            <span className="text-sm text-gray-600">
              {nextLevel.minPoints - balance} баллов
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
            />
          </div>
        </Card>
      )}

      {/* Rules */}
      <Card className="p-4">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <TrendingUp size={20} />
          Как накопить баллы
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• {rules.pointsPerRub} балл за каждый рубль покупки</p>
          <p>• Минимальная сумма заказа: {rules.minOrderForPoints} ₽</p>
          <p>• Баллы начисляются после подтверждения заказа</p>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-4">
        <h2 className="font-semibold text-lg mb-3">Ваши преимущества</h2>
        <div className="space-y-2">
          {currentLevel.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="p-4">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <History size={20} />
          История операций
        </h2>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.type === 'earned'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'earned' ? '+' : '-'}
                  {transaction.points}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Пока нет операций
          </p>
        )}
      </Card>
    </div>
  );
};

export default LoyaltyPage;
