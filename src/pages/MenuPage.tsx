import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import menuData from '../data/menu.json';
import type { Product, Category } from '../types';
import ProductCard from '../components/features/ProductCard';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { Coffee } from 'lucide-react';

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = menuData.categories;
  const products: Product[] = menuData.products as Product[];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    // Поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryChange = (categoryId: string) => {
    setSearchParams({ category: categoryId });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-100 uppercase tracking-tight">Меню</h1>
        <p className="text-gray-400">Выберите блюдо по душе</p>
      </div>

      {/* Поиск */}
      <div className="sticky top-16 z-40 bg-dark-950 -mx-4 px-4 py-3 -mt-4">
        <Input
          type="text"
          placeholder="Поиск блюд..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={20} />}
        />
      </div>

      {/* Категории */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors border ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white border-primary-500'
              : 'bg-dark-900 text-gray-300 hover:bg-dark-800 border-dark-700'
          }`}
        >
          Все
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors border ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white border-primary-500'
                : 'bg-dark-900 text-gray-300 hover:bg-dark-800 border-dark-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Список товаров */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Coffee size={48} />}
          title="Ничего не найдено"
          description={
            searchQuery
              ? 'Попробуйте изменить поисковый запрос'
              : 'В этой категории пока нет товаров'
          }
        />
      )}

      {/* Информация о количестве */}
      {filteredProducts.length > 0 && (
        <div className="text-center text-sm text-gray-400">
          Найдено товаров: {filteredProducts.length}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
