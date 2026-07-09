import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { AppText } from '@/presentation/components/ui/Text';
import { colors, spacing } from '@/core/theme';
interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.text.tertiary}
        accessibilityLabel={label}
        {...props}
      />
      {error ? (
        <AppText variant="caption" color="#DC2626" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs + 2,
  },
  label: {
    color: colors.text.primary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: '#DC2626',
  },
});
