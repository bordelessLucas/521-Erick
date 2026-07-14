import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TextInput, View, Alert } from 'react-native';
import { usePipelineStages } from '@/presentation/context/PipelineStagesContext';
import type { PipelineStage } from '@/domain/entities/Order';
import { container } from '@/infrastructure/di/container';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';

interface ManageStagesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ManageStagesModal({ visible, onClose }: ManageStagesModalProps) {
  const { stages, refresh } = usePipelineStages();
  const [isMutating, setIsMutating] = useState(false);
  const [editingStage, setEditingStage] = useState<Partial<PipelineStage> | 'NEW' | null>(null);

  const isEditing = editingStage !== null;
  const isNew = editingStage === 'NEW';
  
  const currentFormStage = isNew 
    ? { id: '', label: '', shortLabel: '', description: '', orderIndex: stages.length } 
    : (typeof editingStage === 'object' && editingStage !== null ? editingStage : null);

  const [formId, setFormId] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formShortLabel, setFormShortLabel] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOrderIndex, setFormOrderIndex] = useState(0);

  const startEdit = (stage: PipelineStage) => {
    setFormId(stage.id);
    setFormLabel(stage.label);
    setFormShortLabel(stage.shortLabel);
    setFormDescription(stage.description);
    setFormOrderIndex(stage.orderIndex);
    setEditingStage(stage);
  };

  const startNew = () => {
    setFormId('');
    setFormLabel('');
    setFormShortLabel('');
    setFormDescription('');
    setFormOrderIndex(stages.length);
    setEditingStage('NEW');
  };

  const cancelEdit = () => {
    setEditingStage(null);
  };

  const handleSave = async () => {
    if (!formId || !formLabel || !formShortLabel || !formDescription) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    setIsMutating(true);
    try {
      const newStage: PipelineStage = {
        id: formId,
        label: formLabel,
        shortLabel: formShortLabel,
        description: formDescription,
        orderIndex: formOrderIndex,
      };

      const repo = container.getPipelineStageRepository();
      await repo.save(newStage);
      await refresh();
      setEditingStage(null);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao salvar a etapa.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta etapa? Isso pode afetar pedidos nela.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsMutating(true);
            try {
              const repo = container.getPipelineStageRepository();
              await repo.delete(id);
              await refresh();
            } catch (err) {
              console.error(err);
              Alert.alert('Erro', 'Erro ao excluir a etapa.');
            } finally {
              setIsMutating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText variant="h3" color={colors.ink}>
            Gerenciar Etapas
          </AppText>
          <Button title="Fechar" variant="secondary" size="sm" onPress={onClose} disabled={isMutating} />
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {!isEditing ? (
            <View style={styles.listContainer}>
              <View style={styles.listHeader}>
                <AppText variant="bodySmall" color={colors.muted} style={styles.flex1}>
                  Gerencie as etapas que aparecem no seu kanban e timeline.
                </AppText>
                <Button title="+ Nova Etapa" variant="primary" size="sm" onPress={startNew} />
              </View>

              <View style={styles.list}>
                {stages.map((stage) => (
                  <View key={stage.id} style={styles.listItem}>
                    <View style={styles.flex1}>
                      <AppText variant="label" color={colors.ink}>
                        {stage.label}
                      </AppText>
                      <AppText variant="caption" color={colors.muted}>
                        {stage.id}
                      </AppText>
                    </View>
                    <View style={styles.actions}>
                      <Button title="Editar" variant="secondary" size="sm" onPress={() => startEdit(stage)} />
                      <Button title="X" variant="secondary" size="sm" onPress={() => handleDelete(stage.id)} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.field}>
                <AppText variant="label" color={colors.ink}>
                  ID / Código
                </AppText>
                <TextInput
                  style={[styles.input, !isNew && styles.inputDisabled]}
                  value={formId}
                  onChangeText={setFormId}
                  editable={isNew}
                  placeholder="Ex: PRODUCAO"
                  placeholderTextColor={colors.muted}
                />
                <AppText variant="caption" color={colors.muted}>
                  O identificador não pode ser alterado depois.
                </AppText>
              </View>

              <View style={styles.field}>
                <AppText variant="label" color={colors.ink}>
                  Nome da Etapa
                </AppText>
                <TextInput
                  style={styles.input}
                  value={formLabel}
                  onChangeText={setFormLabel}
                />
              </View>

              <View style={styles.field}>
                <AppText variant="label" color={colors.ink}>
                  Nome Curto (ex: Kanban)
                </AppText>
                <TextInput
                  style={styles.input}
                  value={formShortLabel}
                  onChangeText={setFormShortLabel}
                />
              </View>

              <View style={styles.field}>
                <AppText variant="label" color={colors.ink}>
                  Descrição (p/ Cliente)
                </AppText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formDescription}
                  onChangeText={setFormDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formActions}>
                <Button title="Cancelar" variant="secondary" onPress={cancelEdit} disabled={isMutating} />
                <Button
                  title={isMutating ? 'Salvando...' : 'Salvar Etapa'}
                  variant="primary"
                  onPress={handleSave}
                  disabled={isMutating}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: spacing.lg,
  },
  flex1: {
    flex: 1,
  },
  listContainer: {
    gap: spacing.lg,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  list: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  form: {
    gap: spacing.lg,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  field: {
    gap: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    backgroundColor: colors.white,
    color: colors.ink,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: colors.cream,
    color: colors.muted,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
