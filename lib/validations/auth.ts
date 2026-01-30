import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
  twoFactorCode: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, '名前は2文字以上である必要があります'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(/[A-Z]/, '大文字を1文字以上含める必要があります')
    .regex(/[a-z]/, '小文字を1文字以上含める必要があります')
    .regex(/[0-9]/, '数字を1文字以上含める必要があります')
    .regex(/[!@#$%^&*]/, '特殊文字を1文字以上含める必要があります'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: '利用規約とプライバシーポリシーに同意する必要があります',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;