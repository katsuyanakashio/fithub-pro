'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { UserPlus, Loader2, Shield, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const passwordRequirements = [
    { label: '8文字以上', met: password.length >= 8 },
    { label: '大文字を含む', met: /[A-Z]/.test(password) },
    { label: '小文字を含む', met: /[a-z]/.test(password) },
    { label: '数字を含む', met: /[0-9]/.test(password) },
    { label: '特殊文字を含む', met: /[!@#$%^&*]/.test(password) },
  ];

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || '登録に失敗しました');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('登録中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            新規登録
          </CardTitle>
          <CardDescription className="text-center text-base">
            アカウントを作成してフィットネスを始めましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md p-4 text-sm">
                <p className="font-semibold">エラー</p>
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  名前 *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="山田太郎"
                  {...register('name')}
                  disabled={isLoading}
                  className="h-11"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 font-medium">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  メールアドレス *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  {...register('email')}
                  disabled={isLoading}
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  電話番号（任意）
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="090-1234-5678"
                  {...register('phone')}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-semibold">
                  生年月日（任意）
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-semibold">
                性別（任意）
              </Label>
              <select
                id="gender"
                {...register('gender')}
                disabled={isLoading}
                className="flex h-11 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm"
              >
                <option value="">選択してください</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
                <option value="prefer_not_to_say">回答しない</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                パスワード *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
                className="h-11"
              />
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <Check
                        className={`h-4 w-4 mr-2 ${
                          req.met ? 'text-green-600' : 'text-gray-300'
                        }`}
                      />
                      <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                パスワード（確認）*
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                disabled={isLoading}
                className="h-11"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consentGiven"
                  {...register('consentGiven')}
                  disabled={isLoading}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="consentGiven" className="ml-2 text-sm text-gray-700">
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    利用規約
                  </Link>
                  、
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    プライバシーポリシー
                  </Link>
                  、および
                  <Link href="/hipaa" className="text-blue-600 hover:underline">
                    HIPAA通知
                  </Link>
                  に同意します *
                </label>
              </div>
              {errors.consentGiven && (
                <p className="text-sm text-red-600 font-medium">{errors.consentGiven.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  登録中...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  登録
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center text-sm">
              <span className="text-gray-600">既にアカウントをお持ちですか？ </span>
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-semibold"
              >
                ログイン
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="h-4 w-4" />
              <span>256bit SSL暗号化 | HIPAA準拠 | GDPR準拠</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}