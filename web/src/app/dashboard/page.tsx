import Link from 'next/link';
import type { Metadata } from 'next';
import { OrdersListContainer } from '@/presentation/components/orders/OrdersListContainer';

export const metadata: Metadata = {
  title: 'Meus Pedidos — Portal B2B',
  description: 'Consulte o histórico completo de pedidos da sua empresa.',
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold text-primary-800">
            Cordas Industriais
          </Link>
          <span className="text-sm font-medium text-neutral-600">Portal B2B</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary-800">Meus Pedidos</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Acompanhe o histórico completo dos seus pedidos e o estado atual de cada um.
          </p>
        </div>

        <OrdersListContainer />
      </main>
    </div>
  );
}
