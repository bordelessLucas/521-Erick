'use client';

import { useMemo, useState } from 'react';
import type { Order } from '@/domain/entities/Order';
import { cn } from '@/core/utils/cn';
import { formatCurrency, formatDate, formatWeight } from '@/core/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersListProps {
  orders: Order[];
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            ID do Pedido
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-primary-800">{order.id}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-neutral-500">Data</dt>
          <dd className="mt-0.5 font-medium text-neutral-800">{formatDate(order.orderDate)}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Peso Total</dt>
          <dd className="mt-0.5 font-medium text-neutral-800">{formatWeight(order.weightInKg)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-neutral-500">Valor Estimado</dt>
          <dd className="mt-0.5 font-semibold text-neutral-900">
            {formatCurrency(order.estimatedValue)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function OrdersList({ orders }: OrdersListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) => order.id.toLowerCase().includes(query));
  }, [orders, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-md">
        <label htmlFor="order-search" className="sr-only">
          Pesquisar por número do pedido
        </label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          id="order-search"
          type="search"
          placeholder="Pesquisar por número do pedido..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className={cn(
            'h-11 w-full rounded-lg border border-neutral-300 bg-white pr-4 pl-10 text-sm text-neutral-800',
            'placeholder:text-neutral-400',
            'focus:border-primary-800 focus:ring-2 focus:ring-primary-800/20 focus:outline-none',
          )}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-neutral-700">Nenhum pedido encontrado</p>
          <p className="mt-1 text-sm text-neutral-500">
            Tente pesquisar com outro número de pedido.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-3.5 font-semibold text-neutral-700">ID do Pedido</th>
                  <th className="px-5 py-3.5 font-semibold text-neutral-700">Data</th>
                  <th className="px-5 py-3.5 font-semibold text-neutral-700">Peso Total</th>
                  <th className="px-5 py-3.5 font-semibold text-neutral-700">Valor Estimado</th>
                  <th className="px-5 py-3.5 font-semibold text-neutral-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-neutral-50/80">
                    <td className="px-5 py-4 font-mono font-medium text-primary-800">{order.id}</td>
                    <td className="px-5 py-4 text-neutral-700">{formatDate(order.orderDate)}</td>
                    <td className="px-5 py-4 text-neutral-700">{formatWeight(order.weightInKg)}</td>
                    <td className="px-5 py-4 font-medium text-neutral-900">
                      {formatCurrency(order.estimatedValue)}
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
