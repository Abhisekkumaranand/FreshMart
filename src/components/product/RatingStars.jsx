import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = 'default',
  showValue = true,
  className 
}) {
  const sizes = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(maxRating)].map((_, index) => {
        const filled = index < Math.floor(rating);
        const partial = index === Math.floor(rating) && rating % 1 > 0;
        
        return (
          <Star
            key={index}
            className={cn(
              sizes[size],
              filled || partial ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        );
      })}
      {showValue && (
        <span className={cn('font-medium text-gray-700 ml-1', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function RatingInput({ value, onChange, size = 'lg' }) {
  const sizes = {
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              sizes[size],
              star <= value 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}
