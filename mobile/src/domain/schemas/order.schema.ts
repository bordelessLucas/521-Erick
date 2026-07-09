import { z } from 'zod';
import { OrderStatus } from '@/domain/entities/Order';
import { isValidCnpj } from '@/domain/utils/cnpj';

export const createOrderSchema = z.object({
  clientCnpj: z
    .string()
    .trim()
    .min(1, 'O CNPJ é obrigatório')
    .refine(isValidCnpj, 'Introduza um CNPJ válido'),
  companyName: z.string().trim().optional(),
  clientEmail: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: 'Introduza um e-mail válido',
    }),
  orderDate: z.string().min(1, 'A data é obrigatória'),
  estimatedValue: z.coerce
    .number({ error: 'Informe um valor válido' })
    .positive('O valor deve ser maior que zero'),
  weightInKg: z.coerce
    .number({ error: 'Informe um peso válido' })
    .positive('O peso deve ser maior que zero'),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.AGUARDANDO_APROVACAO),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
