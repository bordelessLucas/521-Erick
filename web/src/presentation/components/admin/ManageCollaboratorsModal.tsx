'use client';

import { useState, useEffect } from 'react';
import { container } from '@/infrastructure/di/container';
import type { CollaboratorSummary } from '@/domain/repositories/ICollaboratorRepository';

interface ManageCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageCollaboratorsModal({ isOpen, onClose }: ManageCollaboratorsModalProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen && !isAdding) {
      loadCollaborators();
    }
  }, [isOpen, isAdding]);

  const loadCollaborators = async () => {
    setIsLoading(true);
    try {
      const repo = container.getCollaboratorRepository();
      const list = await repo.getAll();
      setCollaborators(list);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar os colaboradores.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsMutating(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const repo = container.getCollaboratorRepository();
      await repo.provisionCollaborator({
        name,
        email,
        password: password || undefined,
      });

      setIsAdding(false);
      await loadCollaborators();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao criar o colaborador.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o acesso de ${name}?`)) {
      return;
    }
    setIsMutating(true);
    try {
      const repo = container.getCollaboratorRepository();
      await repo.deleteCollaborator(id);
      await loadCollaborators();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao excluir o colaborador.');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="kanban-modal" role="presentation">
      <div className="kanban-modal__dialog" role="dialog" aria-modal="true">
        <header className="kanban-modal__header">
          <h2 className="kanban-modal__title">Gerenciar Colaboradores (Equipe)</h2>
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
          {!isAdding ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-neutral-600">
                  Crie acessos para sua equipe. Eles usarão o e-mail e a senha criados aqui para entrar no painel.
                </p>
                <button
                  type="button"
                  className="kanban-modal__primary text-sm px-3 py-1.5"
                  onClick={() => setIsAdding(true)}
                >
                  + Novo Membro
                </button>
              </div>

              {isLoading ? (
                <p className="text-sm text-neutral-500">Carregando equipe...</p>
              ) : collaborators.length === 0 ? (
                <p className="text-sm text-neutral-500">Nenhum colaborador criado ainda.</p>
              ) : (
                <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-md">
                  {collaborators.map((member) => (
                    <li key={member.id} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">{member.name}</p>
                        <p className="text-xs text-neutral-500">{member.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          onClick={() => handleDelete(member.id, member.name)}
                          disabled={isMutating}
                        >
                          Remover Acesso
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Nome do Colaborador
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Ex: João Silva"
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  E-mail (usado para entrar)
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="joao@trancatto.com"
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                  Senha Temporária (Opcional)
                </label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Deixe em branco para gerar aleatória"
                  className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  A senha deve ter pelo menos 6 caracteres se você for informá-la manualmente.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="kanban-modal__secondary"
                  onClick={() => setIsAdding(false)}
                  disabled={isMutating}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="kanban-modal__primary"
                  disabled={isMutating}
                >
                  {isMutating ? 'Criando...' : 'Criar Acesso'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
