import { ADMIN_GATE_CNPJ } from '@/core/config/firebaseConstants';
import { normalizeCnpj } from '@/domain/utils/cnpj';

export function isAdminGateCnpj(value: string): boolean {
  const digits = normalizeCnpj(value);
  return digits.length === 14 && digits === normalizeCnpj(ADMIN_GATE_CNPJ);
}
