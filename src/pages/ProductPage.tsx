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
        <h2 className="text-2xl font-bold mb-2">Товар не найден</h2>
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
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Назад</span>
      </button>

      {/* Image Gallery */}
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-square bg-gray-100">
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
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
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white bg-opacity-50'
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 text-base">{product.description}</p>
        </div>

        {/* Options */}
        {product.options && product.options.length > 0 && (
          <div className="space-y-4">
            {product.options.map((option: ProductOption) => (
              <div key={option.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <span>{value.name}</span>
                        {value.price > 0 && (
                          <span className="ml-2 text-sm">
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
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
          <span className="font-medium">Количество</span>
          <div className="flex items-center gap-4">
            <button
              onClick={decrementQuantity}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus size={20} />
            </button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="sticky bottom-24 bg-white p-4 -mx-4 border-t border-gray-200 sm:static sm:border-0 sm:p-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600">Итого</div>
              <div className="text-2xl font-bold text-primary-600">
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
            <p className="text-sm text-red-600 mt-2 text-center">
              Товар временно недоступен
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
