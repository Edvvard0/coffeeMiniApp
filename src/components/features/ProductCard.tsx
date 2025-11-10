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
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
          {product.tags?.includes('популярное') && (
            <div className="absolute top-2 right-2">
              <Badge variant="warning" size="sm">
                Популярное
              </Badge>
            </div>
          )}
          {!product.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="danger" size="md">
                Недоступно
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.available && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Будет обработано на странице продукта
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
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

