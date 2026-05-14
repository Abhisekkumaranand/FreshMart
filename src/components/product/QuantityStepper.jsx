import { Minus, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export default function QuantityStepper({ 
  value, 
  onChange, 
  min = 1, 
  max = 99,
  size = 'default',
  className 
}) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const sizes = {
    sm: {
      button: 'h-7 w-7',
      icon: 'w-3 h-3',
      text: 'w-8 text-sm',
    },
    default: {
      button: 'h-9 w-9',
      icon: 'w-4 h-4',
      text: 'w-12 text-base',
    },
    lg: {
      button: 'h-11 w-11',
      icon: 'w-5 h-5',
      text: 'w-14 text-lg',
    },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(s.button, 'rounded-full')}
      >
        <Minus className={s.icon} />
      </Button>
      <span className={cn(s.text, 'text-center font-semibold')}>
        {value}
      </span>
      <Button
        type="button"
        variant="default"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(s.button, 'rounded-full')}
      >
        <Plus className={s.icon} />
      </Button>
    </div>
  );
}
