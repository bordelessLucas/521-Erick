'use client';

import type { ClientAccessCredentials } from '@/domain/entities/Client';

interface ClientCredentialsModalProps {
  credentials: ClientAccessCredentials | null;
  onClose: () => void;
}

export function ClientCredentialsModal({ credentials, onClose }: ClientCredentialsModalProps) {
  if (!credentials) {
    return null;
  }

  const handleCopy = async () => {
    const message = [
      'Acesso ao portal Trançatto',
      `Empresa: ${credentials.companyName}`,
      `CNPJ: ${credentials.clientCnpj}`,
      '',
      'O cliente entra no portal somente com o CNPJ para acompanhar a timeline dos pedidos.',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // clipboard may be unavailable
    }
  };

  return (
    <div className="kanban-modal" role="presentation" onClick={onClose}>
      <div
        className="kanban-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-credentials-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="kanban-modal__header">
          <div>
            <p className="eyebrow dark">Novo cliente</p>
            <h2 id="client-credentials-title">Acesso criado com sucesso</h2>
          </div>
          <button
            type="button"
            className="kanban-modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="kanban-modal__form">
          <p className="kanban-credentials__intro">
            O cliente já pode acessar o portal no web e no mobile usando apenas o CNPJ para
            acompanhar a timeline dos pedidos.
          </p>

          <dl className="kanban-credentials__list">
            <div>
              <dt>Empresa</dt>
              <dd>{credentials.companyName}</dd>
            </div>
            <div>
              <dt>CNPJ de acesso</dt>
              <dd className="kanban-credentials__password">{credentials.clientCnpj}</dd>
            </div>
          </dl>

          <footer className="kanban-modal__footer">
            <button type="button" className="kanban-modal__secondary" onClick={() => void handleCopy()}>
              Copiar acesso
            </button>
            <button type="button" className="kanban-modal__primary" onClick={onClose}>
              Entendi
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
