import { z } from 'zod';
import { isValidCnpj } from '@/domain/utils/cnpj';

function isValidEmail(value: string): boolean {
  return z.string().email().safeParse(value).success;
}

export const loginSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(1, 'CNPJ ou e-mail é obrigatório')
      .refine(
        (value) => isValidEmail(value) || isValidCnpj(value),
        'Introduza um CNPJ ou e-mail válido',
      ),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isEmail = data.identifier.includes('@');

    if (isEmail) {
      if (!data.password || data.password.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A palavra-passe é obrigatória',
          path: ['password'],
        });
        return;
      }

      if (data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A palavra-passe deve ter no mínimo 6 caracteres',
          path: ['password'],
        });
      }
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, 'O nome da empresa deve ter pelo menos 2 caracteres'),
    cnpj: z
      .string()
      .trim()
      .min(1, 'O CNPJ é obrigatório')
      .refine(isValidCnpj, 'Introduza um CNPJ válido'),
    email: z
      .string()
      .trim()
      .min(1, 'O e-mail é obrigatório')
      .email('Introduza um e-mail válido'),
    password: z
      .string()
      .min(1, 'A palavra-passe é obrigatória')
      .min(6, 'A palavra-passe deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a palavra-passe'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As palavras-passe não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const signInSchema = loginSchema;
export type SignInInput = LoginInput;
