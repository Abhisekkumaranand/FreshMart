import { cn, formatPrice, calculateDiscount } from '../../lib/utils';

export function PriceDisplay({ 
  price, 
  discountedPrice, 
  size = 'default',
  showDiscount = true,
  className 
}) {
  const hasDiscount = discountedPrice && discountedPrice < price;
  const discount = hasDiscount ? calculateDiscount(price, discountedPrice) : 0;

  const sizeClasses = {
    sm: {
      current: 'text-sm font-semibold',
      original: 'text-xs',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    default: {
      current: 'text-lg font-bold',
      original: 'text-sm',
      badge: 'text-xs px-2 py-0.5',
    },
    lg: {
      current: 'text-2xl font-bold',
      original: 'text-base',
      badge: 'text-sm px-2 py-1',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn(sizes.current, 'text-gray-900')}>
        {formatPrice(hasDiscount ? discountedPrice : price)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn(sizes.original, 'text-gray-400 line-through')}>
            {formatPrice(price)}
          </span>
          {showDiscount && (
            <span className={cn(
              sizes.badge,
              'bg-green-100 text-green-700 rounded-full font-medium'
            )}>
              {discount}% off
            </span>
          )}
        </>
      )}
    </div>
  );
}
