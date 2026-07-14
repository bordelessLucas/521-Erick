import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { OrderStatus } from '@/domain/entities/Order';
import { DefaultOrderStatuses } from '@/domain/entities/Order';
import type { ClientSummary } from '@/domain/entities/Client';
import { createOrderSchema, type CreateOrderInput } from '@/domain/schemas/order.schema';
import type { CreateOrderWithClientInput } from '@/application/orders/AdminOrderService';
import { formatCnpj, isValidCnpj } from '@/domain/utils/cnpj';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { usePipelineStages } from '@/presentation/context/PipelineStagesContext';

interface CreateOrderModalProps {
  visible: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onLookupClient: (clientCnpj: string) => Promise<ClientSummary | null>;
  onSubmit: (data: CreateOrderWithClientInput) => Promise<boolean>;
}

function getDefaultFormValues(): CreateOrderInput {
  return {
    clientCnpj: '',
    companyName: '',
    clientEmail: '',
    orderDate: new Date().toISOString().slice(0, 10),
    estimatedValue: 0,
    weightInKg: 0,
    status: DefaultOrderStatuses.AGUARDANDO_APROVACAO,
  };
}

export function CreateOrderModal({
  visible,
  isSubmitting,
  onClose,
  onLookupClient,
  onSubmit,
}: CreateOrderModalProps) {
  const { stages } = usePipelineStages();
  const [formValues, setFormValues] = useState<CreateOrderInput>(getDefaultFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateOrderInput, string>>>({});
  const [existingClient, setExistingClient] = useState<ClientSummary | null>(null);
  const [isLookingUpClient, setIsLookingUpClient] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (!isValidCnpj(formValues.clientCnpj)) {
      setExistingClient(null);
      return;
    }

    let isCancelled = false;
    const timeoutId = setTimeout(() => {
      void (async () => {
        setIsLookingUpClient(true);

        try {
          const client = await onLookupClient(formValues.clientCnpj);

          if (!isCancelled) {
            setExistingClient(client);
          }
        } finally {
          if (!isCancelled) {
            setIsLookingUpClient(false);
          }
        }
      })();
    }, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [formValues.clientCnpj, visible, onLookupClient]);

  const isNewClient = isValidCnpj(formValues.clientCnpj) && !isLookingUpClient && !existingClient;

  const handleClose = () => {
    if (isSubmitting) return;
    setFormValues(getDefaultFormValues());
    setErrors({});
    setExistingClient(null);
    onClose();
  };

  const handleSubmit = async () => {
    const parsed = createOrderSchema.safeParse(formValues);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CreateOrderInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !fieldErrors[field as keyof CreateOrderInput]) {
          fieldErrors[field as keyof CreateOrderInput] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    if (isNewClient) {
      const fieldErrors: Partial<Record<keyof CreateOrderInput, string>> = {};

      if (parsed.data.companyName && parsed.data.companyName.trim().length < 2) {
        fieldErrors.companyName = 'Informe um nome com pelo menos 2 caracteres';
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }
    }

    const success = await onSubmit({
      clientCnpj: formatCnpj(parsed.data.clientCnpj),
      companyName: parsed.data.companyName,
      clientEmail: parsed.data.clientEmail,
      orderDate: new Date(`${parsed.data.orderDate}T12:00:00`).toISOString(),
      estimatedValue: parsed.data.estimatedValue,
      weightInKg: parsed.data.weightInKg,
      status: parsed.data.status,
    });

    if (success) {
      setFormValues(getDefaultFormValues());
      setErrors({});
      setExistingClient(null);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <View>
              <AppText variant="eyebrow" color={colors.label}>
                Novo pedido
              </AppText>
              <AppText variant="h3" color={colors.ink}>
                Cadastrar pedido
              </AppText>
            </View>
            <Pressable onPress={handleClose} disabled={isSubmitting} accessibilityLabel="Fechar">
              <AppText variant="h3" color={colors.muted}>
                ×
              </AppText>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.form}>
            <Input
              label="CNPJ do cliente"
              placeholder="00.000.000/0000-00"
              value={formValues.clientCnpj}
              onChangeText={(value) =>
                setFormValues((current) => ({ ...current, clientCnpj: formatCnpj(value) }))
              }
              error={errors.clientCnpj}
              editable={!isSubmitting}
            />

            {isLookingUpClient && (
              <AppText variant="bodySmall" color={colors.muted}>
                Verificando cadastro do cliente...
              </AppText>
            )}

            {existingClient && (
              <View style={[styles.banner, styles.bannerExisting]}>
                <AppText variant="label" color={colors.pine}>
                  Cliente já cadastrado
                </AppText>
                <AppText variant="bodySmall" color={colors.pine}>
                  {existingClient.companyName} · {existingClient.clientCnpj}
                </AppText>
              </View>
            )}

            {isNewClient && (
              <>
                <View style={[styles.banner, styles.bannerNew]}>
                  <AppText variant="label" color={colors.terra}>
                    Novo cliente
                  </AppText>
                  <AppText variant="bodySmall" color={colors.terra}>
                    Será criado um acesso ao portal. O cliente entra só com o CNPJ para acompanhar a
                    timeline do pedido.
                  </AppText>
                </View>

                <Input
                  label="Nome da empresa (opcional)"
                  placeholder="Empresa Lda."
                  value={formValues.companyName ?? ''}
                  onChangeText={(value) =>
                    setFormValues((current) => ({ ...current, companyName: value }))
                  }
                  error={errors.companyName}
                  editable={!isSubmitting}
                />
              </>
            )}

            <Input
              label="Data do pedido"
              placeholder="AAAA-MM-DD"
              value={formValues.orderDate}
              onChangeText={(value) =>
                setFormValues((current) => ({ ...current, orderDate: value }))
              }
              error={errors.orderDate}
              editable={!isSubmitting}
            />

            <Input
              label="Valor estimado (R$)"
              placeholder="0,00"
              keyboardType="decimal-pad"
              value={formValues.estimatedValue ? String(formValues.estimatedValue) : ''}
              onChangeText={(value) =>
                setFormValues((current) => ({
                  ...current,
                  estimatedValue: Number(value.replace(',', '.')) || 0,
                }))
              }
              error={errors.estimatedValue}
              editable={!isSubmitting}
            />

            <Input
              label="Peso (kg)"
              placeholder="0,0"
              keyboardType="decimal-pad"
              value={formValues.weightInKg ? String(formValues.weightInKg) : ''}
              onChangeText={(value) =>
                setFormValues((current) => ({
                  ...current,
                  weightInKg: Number(value.replace(',', '.')) || 0,
                }))
              }
              error={errors.weightInKg}
              editable={!isSubmitting}
            />

            <AppText variant="label" color={colors.text.primary}>
              Etapa inicial
            </AppText>
            <View style={styles.statusList}>
              {stages.map((step) => {
                const isSelected = formValues.status === step.id;
                return (
                  <Pressable
                    key={step.id}
                    onPress={() =>
                      setFormValues((current) => ({ ...current, status: step.id }))
                    }
                    style={[styles.statusOption, isSelected && styles.statusOptionActive]}
                  >
                    <AppText
                      variant="bodySmall"
                      color={isSelected ? colors.white : colors.ink}
                    >
                      {step.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.footer}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={handleClose}
                disabled={isSubmitting}
                style={styles.footerButton}
              />
              <Button
                title={isSubmitting ? 'Salvando...' : 'Criar pedido'}
                variant="primary"
                onPress={() => void handleSubmit()}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                style={styles.footerButton}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  form: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  banner: {
    borderWidth: 1,
    padding: spacing.sm + 4,
    gap: spacing.xs,
  },
  bannerExisting: {
    backgroundColor: '#eef4f0',
    borderColor: colors.line,
  },
  bannerNew: {
    backgroundColor: 'rgba(198, 94, 52, 0.08)',
    borderColor: 'rgba(198, 94, 52, 0.2)',
  },
  statusList: {
    gap: spacing.xs,
  },
  statusOption: {
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.sm,
    backgroundColor: colors.cream,
  },
  statusOptionActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  footerButton: {
    flex: 1,
  },
});
