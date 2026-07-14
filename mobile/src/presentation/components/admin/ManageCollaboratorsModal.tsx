import { useState, useEffect } from 'react';
import { Modal, ScrollView, StyleSheet, TextInput, View, Alert } from 'react-native';
import { container } from '@/infrastructure/di/container';
import type { CollaboratorSummary } from '@/domain/repositories/ICollaboratorRepository';
import { colors, spacing } from '@/core/theme';
import { AppText } from '@/presentation/components/ui/Text';
import { Button } from '@/presentation/components/ui/Button';

interface ManageCollaboratorsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ManageCollaboratorsModal({ visible, onClose }: ManageCollaboratorsModalProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  useEffect(() => {
    if (visible && !isAdding) {
      loadCollaborators();
    }
  }, [visible, isAdding]);

  const loadCollaborators = async () => {
    setIsLoading(true);
    try {
      const repo = container.getCollaboratorRepository();
      const list = await repo.getAll();
      setCollaborators(list);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err.message || 'Erro ao carregar os colaboradores.');
    } finally {
      setIsLoading(false);
    }
  };

  const startNew = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!formName || !formEmail) {
      Alert.alert('Erro', 'Preencha o nome e o e-mail.');
      return;
    }
    
    setIsMutating(true);
    try {
      const repo = container.getCollaboratorRepository();
      await repo.provisionCollaborator({
        name: formName,
        email: formEmail,
        password: formPassword || undefined,
      });

      setIsAdding(false);
      await loadCollaborators();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', err.message || 'Erro ao criar o colaborador.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir o acesso de ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsMutating(true);
            try {
              const repo = container.getCollaboratorRepository();
              await repo.deleteCollaborator(id);
              await loadCollaborators();
            } catch (err: any) {
              console.error(err);
              Alert.alert('Erro', err.message || 'Erro ao excluir o colaborador.');
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
            Equipe (Colaboradores)
          </AppText>
          <Button title="Fechar" variant="secondary" size="sm" onPress={onClose} disabled={isMutating} />
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {!isAdding ? (
            <View style={styles.listContainer}>
              <View style={styles.listHeader}>
                <AppText variant="bodySmall" color={colors.muted} style={styles.flex1}>
                  Crie acessos para sua equipe. Eles usarão o e-mail e a senha criados aqui para entrar no painel.
                </AppText>
                <Button title="+ Novo" variant="primary" size="sm" onPress={startNew} />
              </View>

              <View style={styles.list}>
                {isLoading && collaborators.length === 0 ? (
                  <View style={styles.listItem}>
                    <AppText variant="bodySmall" color={colors.muted}>Carregando...</AppText>
                  </View>
                ) : collaborators.length === 0 ? (
                  <View style={styles.listItem}>
                    <AppText variant="bodySmall" color={colors.muted}>Nenhum colaborador criado.</AppText>
                  </View>
                ) : (
                  collaborators.map((member) => (
                    <View key={member.id} style={styles.listItem}>
                      <View style={styles.flex1}>
                        <AppText variant="label" color={colors.ink}>
                          {member.name}
                        </AppText>
                        <AppText variant="caption" color={colors.muted}>
                          {member.email}
                        </AppText>
                      </View>
                      <View style={styles.actions}>
                        <Button
                          title="Remover"
                          variant="secondary"
                          size="sm"
                          onPress={() => handleDelete(member.id, member.name)}
                          disabled={isMutating}
                        />
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.field}>
                <AppText variant="label" color={colors.ink}>
                  Nome do Colaborador
                </AppText>
                <TextInput
                  style={styles.input}
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="Ex: João Silva"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View style={styles.field}>
                <AppText variant="label" color={colors.ink}>
                  E-mail (usado para entrar)
                </AppText>
                <TextInput
                  style={styles.input}
                  value={formEmail}
                  onChangeText={setFormEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="joao@trancatto.com"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View style={styles.field}>
                <AppText variant="label" color={colors.ink}>
                  Senha Temporária (Opcional)
                </AppText>
                <TextInput
                  style={styles.input}
                  value={formPassword}
                  onChangeText={setFormPassword}
                  placeholder="Em branco para gerar aleatória"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                />
                <AppText variant="caption" color={colors.muted}>
                  A senha deve ter pelo menos 6 caracteres se você for informá-la manualmente.
                </AppText>
              </View>

              <View style={styles.formActions}>
                <Button title="Cancelar" variant="secondary" onPress={() => setIsAdding(false)} disabled={isMutating} />
                <Button
                  title={isMutating ? 'Criando...' : 'Criar Acesso'}
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
