import { Modal, Pressable, Share, StyleSheet, View } from 'react-native';
import type { ClientAccessCredentials } from '@/domain/entities/Client';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';

interface ClientCredentialsModalProps {
  credentials: ClientAccessCredentials | null;
  visible: boolean;
  onClose: () => void;
}

function buildCredentialsMessage(credentials: ClientAccessCredentials): string {
  return [
    'Acesso ao portal Trançatto',
    `Empresa: ${credentials.companyName}`,
    `CNPJ: ${credentials.clientCnpj}`,
    `E-mail: ${credentials.email}`,
    `Senha temporária: ${credentials.password}`,
    '',
    'O cliente pode entrar no web e no mobile com estas credenciais.',
  ].join('\n');
}

export function ClientCredentialsModal({
  credentials,
  visible,
  onClose,
}: ClientCredentialsModalProps) {
  if (!credentials) {
    return null;
  }

  const handleShare = async () => {
    await Share.share({
      message: buildCredentialsMessage(credentials),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <View>
              <AppText variant="eyebrow" color={colors.label}>
                Novo cliente
              </AppText>
              <AppText variant="h3" color={colors.ink}>
                Acesso criado
              </AppText>
            </View>
            <Pressable onPress={onClose} accessibilityLabel="Fechar">
              <AppText variant="h3" color={colors.muted}>
                ×
              </AppText>
            </Pressable>
          </View>

          <View style={styles.content}>
            <AppText variant="bodySmall" color={colors.muted}>
              Envie estas credenciais para o cliente. Ele poderá acessar o portal no web e no
              mobile e acompanhar os pedidos pela timeline.
            </AppText>

            <View style={styles.list}>
              <CredentialItem label="Empresa" value={credentials.companyName} />
              <CredentialItem label="CNPJ" value={credentials.clientCnpj} />
              <CredentialItem label="E-mail" value={credentials.email} />
              <CredentialItem label="Senha temporária" value={credentials.password} mono />
            </View>
          </View>

          <View style={styles.footer}>
            <Button title="Compartilhar" variant="outline" onPress={() => void handleShare()} />
            <Button title="Entendi" variant="primary" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function CredentialItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View>
      <AppText variant="eyebrow" color={colors.label}>
        {label}
      </AppText>
      <AppText
        variant="bodySmall"
        color={colors.ink}
        style={[styles.value, mono && styles.mono]}
      >
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 20, 18, 0.45)',
    justifyContent: 'flex-end',
  },
  dialog: {
    maxHeight: '92%',
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderColor: colors.line,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  value: {
    fontWeight: '600',
    marginTop: 2,
  },
  mono: {
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
