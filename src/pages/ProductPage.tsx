import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import menuData from '../data/menu.json';
import type { Product, ProductOption } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatPrice } from '../utils/helpers';
import { useCartStore } from '../store/cartStore';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  
  const products: Product[] = menuData.products as Product[];
  const product = products.find((p) => p.id === id);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2 text-gray-100 uppercase tracking-tight">Товар не найден</h2>
        <Button onClick={() => navigate('/menu')} className="mt-4">
          Вернуться в меню
        </Button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleOptionChange = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));
  };

  const calculatePrice = () => {
    let totalPrice = product.price;
    
    // Add options prices
    Object.entries(selectedOptions).forEach(([optionId, valueId]) => {
      const option = product.options?.find((opt) => opt.id === optionId);
      const value = option?.values.find((v) => v.id === valueId);
      if (value) {
        totalPrice += value.price;
      }
    });
    
    return totalPrice * quantity;
  };

  const handleAddToCart = () => {
    // Validate required options
    const requiredOptions = product.options?.filter((opt) => opt.required) || [];
    const missingOptions = requiredOptions.filter(
      (opt) => !selectedOptions[opt.id]
    );

    if (missingOptions.length > 0) {
      alert(`Пожалуйста, выберите: ${missingOptions.map((opt) => opt.name).join(', ')}`);
      return;
    }

    addItem(product, quantity, selectedOptions);
    navigate('/cart');
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Назад</span>
      </button>

      {/* Image Gallery */}
      <Card className="overflow-hidden p-0 border-dark-800">
        <div className="relative aspect-square bg-dark-800">
          <img
            src={images[currentImageIndex] || product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Используем data URI для placeholder
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%231f2937" width="400" height="400"/%3E%3Ctext fill="%2322c55e" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';
              target.style.opacity = '1';
            }}
            onLoad={(e) => {
              // Изображение загрузилось успешно
              const target = e.target as HTMLImageElement;
              target.style.opacity = '1';
            }}
            style={{ opacity: 0, transition: 'opacity 0.3s' }}
          />
          {product.tags?.includes('популярное') && (
            <div className="absolute top-4 right-4">
              <Badge variant="warning" size="md">
                Популярное
              </Badge>
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-primary-500 w-8'
                      : 'bg-dark-700 w-2'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Product Info */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-100 uppercase tracking-tight">{product.name}</h1>
          <p className="text-gray-400 text-base">{product.description}</p>
        </div>

        {/* Options */}
        {product.options && product.options.length > 0 && (
          <div className="space-y-4">
            {product.options.map((option: ProductOption) => (
              <div key={option.id}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {option.name}
                  {option.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isSelected = selectedOptions[option.id] === value.id;
                    return (
                      <button
                        key={value.id}
                        onClick={() => handleOptionChange(option.id, value.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary-600 bg-primary-900 text-primary-300'
                            : 'border-dark-700 hover:border-dark-600 bg-dark-800 text-gray-300'
                        }`}
                      >
                        <span>{value.name}</span>
                        {value.price > 0 && (
                          <span className="ml-2 text-sm text-primary-400">
                            +{formatPrice(value.price)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between py-4 border-t border-b border-dark-800">
          <span className="font-medium text-gray-300">Количество</span>
          <div className="flex items-center gap-4">
            <button
              onClick={decrementQuantity}
              className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors border border-dark-700 text-gray-300 disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus size={20} />
            </button>
            <span className="text-lg font-semibold w-8 text-center text-gray-100">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors border border-dark-700 text-gray-300"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="sticky bottom-24 bg-dark-950 p-4 -mx-4 border-t border-dark-800 sm:static sm:border-0 sm:p-0 sm:bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-400">Итого</div>
              <div className="text-2xl font-bold text-primary-500">
                {formatPrice(calculatePrice())}
              </div>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!product.available}
            fullWidth
            size="lg"
            className="flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Добавить в корзину
          </Button>
          {!product.available && (
            <p className="text-sm text-red-500 mt-2 text-center">
              Товар временно недоступен
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
