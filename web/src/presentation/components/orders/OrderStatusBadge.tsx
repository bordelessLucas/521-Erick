import { OrderStatus } from '@/domain/entities/Order';
import { cn } from '@/core/utils/cn';
import { orderStatusConfig } from './orderStatusConfig';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        config.badgeClassName,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
