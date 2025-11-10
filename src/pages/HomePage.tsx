import { Link } from 'react-router-dom';
import { Coffee, Cake, Sunrise, GlassWater, Sandwich, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage = () => {
  const categories = [
    { id: 'coffee', name: 'Кофе', icon: Coffee, color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
    { id: 'desserts', name: 'Десерты', icon: Cake, color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
    { id: 'breakfast', name: 'Завтраки', icon: Sunrise, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { id: 'drinks', name: 'Напитки', icon: GlassWater, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { id: 'sandwiches', name: 'Сэндвичи', icon: Sandwich, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-700 border-0 text-white overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Добро пожаловать в Coffee House!</h1>
          <p className="text-primary-100 mb-6 text-sm sm:text-base">
            Лучший кофе и свежая выпечка каждый день
          </p>
          <Link to="/menu">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Открыть меню
              <ArrowRight className="ml-2 inline" size={20} />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Categories */}
      <section>
        <h2 className="text-xl font-bold mb-4">Быстрые категории</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
                className={`${category.color} p-4 rounded-xl flex flex-col items-center gap-2 transition-all transform hover:scale-105 active:scale-95`}
              >
                <Icon size={28} className="sm:w-8 sm:h-8" />
                <span className="font-medium text-xs sm:text-sm text-center">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Promo Banner */}
      <Card className="bg-gradient-to-r from-amber-400 to-orange-500 border-0 text-white">
        <div className="p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">🎉 Специальное предложение!</h2>
          <p className="mb-4 text-sm sm:text-base">Закажите от 1500₽ и получите бесплатную доставку</p>
          <Link to="/menu">
            <Button variant="secondary" size="md" className="w-full sm:w-auto">
              Смотреть меню
            </Button>
          </Link>
        </div>
      </Card>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold mb-1">Быстрая доставка</h3>
          <p className="text-sm text-gray-600">Доставляем за 30-45 минут</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">🎁</div>
          <h3 className="font-semibold mb-1">Программа лояльности</h3>
          <p className="text-sm text-gray-600">Копите баллы за каждый заказ</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">☕</div>
          <h3 className="font-semibold mb-1">Свежий кофе</h3>
          <p className="text-sm text-gray-600">Обжарка каждую неделю</p>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;

