import { Link } from 'react-router-dom';
import { Coffee, Cake, Sunrise, GlassWater, Sandwich, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage = () => {
  const categories = [
    { id: 'coffee', name: 'Кофе', icon: Coffee, color: 'bg-dark-800 text-primary-400 hover:bg-dark-700 border border-dark-700 hover:border-primary-600' },
    { id: 'desserts', name: 'Десерты', icon: Cake, color: 'bg-dark-800 text-primary-400 hover:bg-dark-700 border border-dark-700 hover:border-primary-600' },
    { id: 'breakfast', name: 'Завтраки', icon: Sunrise, color: 'bg-dark-800 text-primary-400 hover:bg-dark-700 border border-dark-700 hover:border-primary-600' },
    { id: 'drinks', name: 'Напитки', icon: GlassWater, color: 'bg-dark-800 text-primary-400 hover:bg-dark-700 border border-dark-700 hover:border-primary-600' },
    { id: 'sandwiches', name: 'Сэндвичи', icon: Sandwich, color: 'bg-dark-800 text-primary-400 hover:bg-dark-700 border border-dark-700 hover:border-primary-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <Card className="bg-dark-900 border-primary-600 border-2 overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-100 uppercase tracking-tight">COFFEE HOUSE</h1>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Лучший кофе и свежая выпечка каждый день
          </p>
          <Link to="/menu">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Открыть меню
              <ArrowRight className="ml-2 inline" size={20} />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Categories */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-100 uppercase tracking-tight">Быстрые категории</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
                className={`${category.color} p-4 rounded-lg flex flex-col items-center gap-2 transition-all`}
              >
                <Icon size={28} className="sm:w-8 sm:h-8" />
                <span className="font-medium text-xs sm:text-sm text-center">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Promo Banner */}
      <Card className="bg-dark-900 border-primary-600 border-2">
        <div className="p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-primary-500 uppercase tracking-tight">Специальное предложение</h2>
          <p className="mb-4 text-sm sm:text-base text-gray-300">Закажите от 1500₽ и получите бесплатную доставку</p>
          <Link to="/menu">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              Смотреть меню
            </Button>
          </Link>
        </div>
      </Card>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center border-dark-800">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold mb-1 text-gray-100">Быстрая доставка</h3>
          <p className="text-sm text-gray-400">Доставляем за 30-45 минут</p>
        </Card>
        <Card className="p-4 text-center border-dark-800">
          <div className="text-2xl mb-2">🎁</div>
          <h3 className="font-semibold mb-1 text-gray-100">Программа лояльности</h3>
          <p className="text-sm text-gray-400">Копите баллы за каждый заказ</p>
        </Card>
        <Card className="p-4 text-center border-dark-800">
          <div className="text-2xl mb-2">☕</div>
          <h3 className="font-semibold mb-1 text-gray-100">Свежий кофе</h3>
          <p className="text-sm text-gray-400">Обжарка каждую неделю</p>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;

