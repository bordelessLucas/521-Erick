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
      `E-mail: ${credentials.email}`,
      `Senha temporária: ${credentials.password}`,
      '',
      'O cliente pode entrar no web e no mobile com estas credenciais.',
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
            Envie estas credenciais para o cliente. Ele poderá acessar o portal no web e no mobile
            e acompanhar os pedidos pela timeline.
          </p>

          <dl className="kanban-credentials__list">
            <div>
              <dt>Empresa</dt>
              <dd>{credentials.companyName}</dd>
            </div>
            <div>
              <dt>CNPJ</dt>
              <dd>{credentials.clientCnpj}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{credentials.email}</dd>
            </div>
            <div>
              <dt>Senha temporária</dt>
              <dd className="kanban-credentials__password">{credentials.password}</dd>
            </div>
          </dl>

          <footer className="kanban-modal__footer">
            <button type="button" className="kanban-modal__secondary" onClick={() => void handleCopy()}>
              Copiar credenciais
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
