'use client';

import { useState } from 'react';
import { usePipelineStages } from '@/presentation/contexts/PipelineStagesContext';
import type { PipelineStage } from '@/domain/entities/Order';
import { container } from '@/infrastructure/di/container';

interface ManageStagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageStagesModal({ isOpen, onClose }: ManageStagesModalProps) {
  const { stages, refresh } = usePipelineStages();
  const [isMutating, setIsMutating] = useState(false);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsMutating(true);
    try {
      const formData = new FormData(e.currentTarget);
      const stageId = formData.get('id') as string;
      const isNew = formData.get('isNew') === 'true';
      const averageMinutes = Math.max(0, Number(formData.get('averageMinutes') || 0));

      const newStage: PipelineStage = {
        id: stageId,
        label: formData.get('label') as string,
        shortLabel: formData.get('shortLabel') as string,
        description: formData.get('description') as string,
        orderIndex: isNew ? stages.length : Number(formData.get('orderIndex')),
        averageMinutes,
      };

      const repo = container.getPipelineStageRepository();
      await repo.save(newStage);
      await refresh();
      setEditingStageId(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar a etapa.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta etapa? Isso pode afetar pedidos nela.')) {
      return;
    }
    setIsMutating(true);
    try {
      const repo = container.getPipelineStageRepository();
      await repo.delete(id);
      await refresh();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir a etapa.');
    } finally {
      setIsMutating(false);
    }
  };

  const startNewStage = () => {
    setEditingStageId('NEW');
  };

  return (
    <div className="kanban-modal" role="presentation">
      <div className="kanban-modal__dialog" role="dialog" aria-modal="true">
        <header className="kanban-modal__header">
          <h2 className="kanban-modal__title">Gerenciar Funil / Etapas</h2>
          <button
            type="button"
            className="kanban-modal__close"
            onClick={onClose}
            disabled={isMutating}
          >
            ×
          </button>
        </header>

        <div className="kanban-modal__body">
          {!editingStageId ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-neutral-600">
                  Defina o tempo médio de cada etapa. No quadro, os cards ficam verdes, amarelos ou
                  vermelhos conforme o tempo decorrido (1/3 · 2/3 · acima do médio).
                </p>
                <button
                  type="button"
                  className="kanban-modal__primary text-sm px-3 py-1.5"
                  onClick={startNewStage}
                >
                  + Nova Etapa
                </button>
              </div>

              <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-md">
                {stages.map((stage) => (
                  <li key={stage.id} className="p-3 flex justify-between items-center bg-white">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">{stage.label}</p>
                      <p className="text-xs text-neutral-500">
                        {stage.id}
                        {stage.averageMinutes > 0
                          ? ` · médio ${stage.averageMinutes} min`
                          : ' · sem tempo médio'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        onClick={() => setEditingStageId(stage.id)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        onClick={() => handleDelete(stage.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {(() => {
                const isNew = editingStageId === 'NEW';
                const stage = isNew ? null : stages.find((s) => s.id === editingStageId);
                return (
                  <>
                    <input type="hidden" name="isNew" value={isNew ? 'true' : 'false'} />
                    <input type="hidden" name="orderIndex" value={stage?.orderIndex ?? ''} />

                    <div>
                      <label htmlFor="id" className="block text-sm font-medium text-neutral-700">
                        ID / Código
                      </label>
                      <input
                        type="text"
                        name="id"
                        id="id"
                        required
                        readOnly={!isNew}
                        defaultValue={stage?.id ?? ''}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        O identificador não pode ser alterado depois. Ex: PRODUCAO, NOVO_STATUS
                      </p>
                    </div>

                    <div>
                      <label htmlFor="label" className="block text-sm font-medium text-neutral-700">
                        Nome da Etapa
                      </label>
                      <input
                        type="text"
                        name="label"
                        id="label"
                        required
                        defaultValue={stage?.label ?? ''}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="shortLabel"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Nome Curto (ex: Kanban)
                      </label>
                      <input
                        type="text"
                        name="shortLabel"
                        id="shortLabel"
                        required
                        defaultValue={stage?.shortLabel ?? ''}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Descrição (p/ Cliente)
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={2}
                        required
                        defaultValue={stage?.description ?? ''}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="averageMinutes"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Tempo médio (minutos)
                      </label>
                      <input
                        type="number"
                        name="averageMinutes"
                        id="averageMinutes"
                        min={0}
                        step={1}
                        required
                        defaultValue={stage?.averageMinutes ?? 5}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        Ex.: 5 → verde até ~1m40s, amarelo até ~3m20s, vermelho depois. Use 0 para
                        desativar o semáforo nesta etapa.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        className="kanban-modal__secondary"
                        onClick={() => setEditingStageId(null)}
                        disabled={isMutating}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="kanban-modal__primary"
                        disabled={isMutating}
                      >
                        {isMutating ? 'Salvando...' : 'Salvar Etapa'}
                      </button>
                    </div>
                  </>
                );
              })()}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
