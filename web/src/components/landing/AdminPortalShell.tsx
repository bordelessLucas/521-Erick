'use client';

import { useState } from 'react';
import { AdminAuthGuard } from '@/components/landing/AdminAuthGuard';
import { TrancattoPortalHeader } from '@/components/landing/TrancattoPortalHeader';
import { AdminLandingEditor } from '@/presentation/components/admin/AdminLandingEditor';
import { OrdersKanbanContainer } from '@/presentation/components/admin/OrdersKanbanContainer';

type AdminTab = 'orders' | 'landing';

export function AdminPortalShell() {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  return (
    <div className="trancatto-portal">
      <TrancattoPortalHeader portalLabel="Painel interno" />

      <main className="trancatto-portal-main trancatto-portal-main--wide">
        <div className="trancatto-portal-intro">
          <p className="eyebrow dark">Operações</p>
          <h1>{activeTab === 'orders' ? 'Quadro de pedidos' : 'Landing page'}</h1>
          <p>
            {activeTab === 'orders'
              ? 'Cadastre novos pedidos e arraste os cards entre as etapas. O semáforo (verde, amarelo, vermelho) mostra o tempo médio definido em Gerenciar Etapas.'
              : 'Visualize e edite textos, produtos, cores e o carrossel da página pública sem precisar de desenvolvedor.'}
          </p>
        </div>

        <nav className="admin-portal-tabs" aria-label="Áreas do painel">
          <button
            type="button"
            className={`admin-portal-tabs__btn${activeTab === 'orders' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Quadro de pedidos
          </button>
          <button
            type="button"
            className={`admin-portal-tabs__btn${activeTab === 'landing' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('landing')}
          >
            Landing page
          </button>
        </nav>

        <AdminAuthGuard>
          {activeTab === 'orders' ? <OrdersKanbanContainer /> : <AdminLandingEditor />}
        </AdminAuthGuard>
      </main>
    </div>
  );
}
