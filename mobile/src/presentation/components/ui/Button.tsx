import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors, borderRadius, spacing } from '@/core/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: string }> = {
  primary: {
    container: { backgroundColor: colors.primary.DEFAULT },
    text: colors.text.inverse,
  },
  secondary: {
    container: { backgroundColor: colors.secondary.DEFAULT },
    text: colors.text.inverse,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary.DEFAULT,
    },
    text: colors.primary.DEFAULT,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: colors.primary.DEFAULT,
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; fontSize: number }> = {
  sm: { container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md }, fontSize: 14 },
  md: { container: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg }, fontSize: 16 },
  lg: { container: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl }, fontSize: 18 },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyle.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: variantStyle.text, fontSize: sizeStyle.fontSize }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
});
