import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';

const CLIENT_AUTH_EMAIL_DOMAIN = 'cnpj.trancatto.app';

/** E-mail sintético usado no Firebase Auth para login por CNPJ. */
export function buildClientAuthEmail(clientCnpj: string): string {
  const digits = normalizeCnpj(clientCnpj);

  if (digits.length !== 14) {
    throw new Error('CNPJ inválido para criar identidade de acesso.');
  }

  return `${digits}@${CLIENT_AUTH_EMAIL_DOMAIN}`;
}

/** Senha derivada do CNPJ — o cliente entra só informando o CNPJ. */
export function buildClientAuthPassword(clientCnpj: string): string {
  const digits = normalizeCnpj(clientCnpj);

  if (digits.length !== 14) {
    throw new Error('CNPJ inválido para criar identidade de acesso.');
  }

  return digits;
}

export function buildDefaultCompanyName(clientCnpj: string): string {
  return `Cliente ${formatCnpj(normalizeCnpj(clientCnpj))}`;
}

export function isClientAuthEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${CLIENT_AUTH_EMAIL_DOMAIN}`);
}
