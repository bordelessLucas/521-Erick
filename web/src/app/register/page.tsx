import Link from 'next/link';
import type { Metadata } from 'next';
import { RegisterForm } from '@/presentation/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Criar conta — Portal B2B',
  description: 'Registe a sua empresa no portal B2B da fábrica de cordas industriais.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <header className="px-6 py-6">
        <Link href="/" className="text-lg font-bold text-primary-800">
          Cordas Industriais
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-primary-800">
              Criar conta
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Registe a sua empresa para aceder ao portal de pedidos e produção.
            </p>
          </div>

          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
