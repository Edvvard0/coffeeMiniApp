import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatPrice } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.id}`}>
      <Card hover className="h-full flex flex-col overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-dark-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Используем data URI для placeholder
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%231f2937" width="400" height="400"/%3E%3Ctext fill="%2322c55e" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';
              target.style.opacity = '1';
            }}
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = '1';
            }}
            style={{ opacity: 0, transition: 'opacity 0.3s' }}
          />
          {product.tags?.includes('популярное') && (
            <div className="absolute top-2 right-2">
              <Badge variant="warning" size="sm">
                Популярное
              </Badge>
            </div>
          )}
          {!product.available && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <Badge variant="danger" size="md">
                Недоступно
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-100">{product.name}</h3>
          <p className="text-sm text-gray-400 mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-primary-500">
              {formatPrice(product.price)}
            </span>
            {product.available && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Будет обработано на странице продукта
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium border border-primary-500"
              >
                Выбрать
              </button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;

