'use client';

import type { OrderStatus } from '@/domain/entities/Order';
import { cn } from '@/core/utils/cn';
import {
  getStepState,
  type TimelineStepState,
} from './orderTimelineSteps';
import { usePipelineStages } from '@/presentation/contexts/PipelineStagesContext';

interface OrderTimelineProps {
  status: OrderStatus;
  variant?: 'horizontal' | 'vertical';
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        fill="currentColor"
        d="M6.2 11.6 3.4 8.8l-.9.9 3.7 3.7 7.4-7.4-.9-.9-6.5 6.5Z"
      />
    </svg>
  );
}

function StepMarker({ state }: { state: TimelineStepState }) {
  return (
    <span
      className={cn(
        'timeline-marker',
        state === 'completed' && 'timeline-marker--completed',
        state === 'current' && 'timeline-marker--current',
        state === 'pending' && 'timeline-marker--pending',
      )}
      aria-hidden="true"
    >
      {state === 'completed' ? <CheckIcon /> : state === 'current' ? <span /> : null}
    </span>
  );
}

export function OrderTimeline({ status, variant = 'horizontal' }: OrderTimelineProps) {
  const { stages } = usePipelineStages();
  
  const activeIndex = stages.findIndex((step) => step.id === status);
  const normalizedActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const isFullyComplete = status === stages.at(-1)?.id;

  return (
    <ol
      className={cn('order-timeline', variant === 'vertical' && 'order-timeline--vertical')}
      aria-label="Progresso do pedido"
    >
      {stages.map((step, index) => {
        const state = getStepState(index, normalizedActiveIndex, isFullyComplete);
        const isLast = index === stages.length - 1;

        return (
          <li
            key={step.id}
            className={cn(
              'order-timeline__step',
              `order-timeline__step--${state}`,
              isLast && 'order-timeline__step--last',
            )}
          >
            <div className="order-timeline__track">
              <StepMarker state={state} />
              {!isLast && <span className="order-timeline__line" aria-hidden="true" />}
            </div>
            <div className="order-timeline__content">
              <p className="order-timeline__label">
                {variant === 'horizontal' ? step.shortLabel : step.label}
              </p>
              {variant === 'vertical' && (
                <p className="order-timeline__description">{step.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
