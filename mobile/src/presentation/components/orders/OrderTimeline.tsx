import { View, StyleSheet } from 'react-native';
import type { OrderStatus } from '@/domain/entities/Order';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import {
  ORDER_TIMELINE_STEPS,
  getActiveStepIndex,
  getStepState,
  type TimelineStepState,
} from './orderTimelineSteps';

interface OrderTimelineProps {
  status: OrderStatus;
}

function StepMarker({ state }: { state: TimelineStepState }) {
  return (
    <View
      style={[
        styles.marker,
        state === 'completed' && styles.markerCompleted,
        state === 'current' && styles.markerCurrent,
        state === 'pending' && styles.markerPending,
      ]}
    >
      {state === 'completed' ? (
        <AppText variant="caption" color={colors.white} style={styles.check}>
          ✓
        </AppText>
      ) : state === 'current' ? (
        <View style={styles.markerDot} />
      ) : null}
    </View>
  );
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const activeIndex = getActiveStepIndex(status);
  const isFullyComplete = status === ORDER_TIMELINE_STEPS.at(-1)?.status;

  return (
    <View style={styles.container} accessibilityLabel="Progresso do pedido">
      {ORDER_TIMELINE_STEPS.map((step, index) => {
        const state = getStepState(index, activeIndex, isFullyComplete);
        const isLast = index === ORDER_TIMELINE_STEPS.length - 1;

        return (
          <View key={step.status} style={styles.step}>
            <View style={styles.track}>
              <StepMarker state={state} />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    (state === 'completed' || state === 'current') && styles.lineActive,
                  ]}
                />
              )}
            </View>
            <View style={styles.content}>
              <AppText
                variant="label"
                color={state === 'pending' ? colors.label : colors.ink}
                style={styles.label}
              >
                {step.label}
              </AppText>
              <AppText variant="bodySmall" color={colors.muted} style={styles.description}>
                {step.description}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  track: {
    alignItems: 'center',
    width: 24,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  markerCompleted: {
    backgroundColor: colors.pine,
    borderColor: colors.pine,
  },
  markerCurrent: {
    backgroundColor: colors.terra,
    borderColor: colors.terra,
  },
  markerPending: {
    backgroundColor: colors.white,
    borderColor: colors.sand,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  check: {
    fontWeight: '700',
    fontSize: 12,
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: 28,
    backgroundColor: colors.sand,
    marginTop: 4,
  },
  lineActive: {
    backgroundColor: colors.pine,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  label: {
    marginBottom: 2,
  },
  description: {
    lineHeight: 20,
  },
});
