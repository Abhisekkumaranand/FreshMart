import { Button } from '../ui/button';
import { ShoppingBag, Search, Package, FileX } from 'lucide-react';

const icons = {
  cart: ShoppingBag,
  search: Search,
  orders: Package,
  default: FileX,
};

export function EmptyState({
  icon = 'default',
  title,
  description,
  action,
  actionLabel,
}) {
  const IconComponent = icons[icon] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <IconComponent className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
      )}
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  );
}
