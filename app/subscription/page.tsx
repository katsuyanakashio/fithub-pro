'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Loader2, Crown, Zap, Shield } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const plans = [
  {
    id: 'free',
    name: 'フリー',
    price: '¥0',
    period: '/月',
    description: '基本的な機能を無料で',
    features: [
      'ワークアウト記録（月10回まで）',
      '基本的な栄養管理',
      '進捗グラフ',
      'モバイルアプリ',
    ],
    notIncluded: [
      'ウェアラブル連携',
      'カスタムトレーニングプラン',
      '詳細な分析レポート',
      '優先サポート',
    ],
    popular: false,
    priceId: null,
  },
  {
    id: 'premium',
    name: 'プレミアム',
    price: '¥980',
    period: '/月',
    description: 'すべての機能を無制限に',
    features: [
      '無制限のワークアウト記録',
      '詳細な栄養管理とレシピ',
      'ウェアラブルデバイス連携',
      'AIパーソナルトレーナー',
      'カスタムトレーニングプラン',
      '詳細な分析レポート',
      '広告なし',
      '優先サポート',
    ],
    notIncluded: [],
    popular: true,
    priceId: 'price_premium_monthly',
  },
  {
    id: 'pro',
    name: 'プロ',
    price: '¥1,980',
    period: '/月',
    description: 'プロアスリート向け',
    features: [
      'プレミアムの全機能',
      '専属トレーナーとの1on1セッション',
      '栄養士による食事指導',
      '競技別トレーニングプログラム',
      'チーム管理機能',
      'API アクセス',
      '24/7サポート',
    ],
    notIncluded: [],
    popular: false,
    priceId: 'price_pro_monthly',
  },
];

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubscribe = async (priceId: string | null, planId: string) => {
    if (!priceId) return;

    setIsLoading(planId);
    setError('');

    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'チェックアウトの作成に失敗しました');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        setError('Stripeの初期化に失敗しました');
        return;
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        setError(stripeError.message || '決済処理に失敗しました');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('予期しないエラーが発生しました');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            あなたに最適なプランを選択
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            いつでもキャンセル可能。14日間の返金保証付き
          </p>
          {error && (
            <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? 'border-2 border-blue-600 shadow-2xl scale-105'
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    <Crown className="h-3 w-3 mr-1 inline" />
                    人気No.1
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <div className="mb-4">
                  {plan.id === 'free' && (
                    <Zap className="h-12 w-12 mx-auto text-gray-600" />
                  )}
                  {plan.id === 'premium' && (
                    <Crown className="h-12 w-12 mx-auto text-blue-600" />
                  )}
                  {plan.id === 'pro' && (
                    <Shield className="h-12 w-12 mx-auto text-purple-600" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <Button
                  onClick={() => handleSubscribe(plan.priceId, plan.id)}
                  disabled={isLoading === plan.id || !plan.priceId}
                  className={`w-full mb-6 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {isLoading === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      処理中...
                    </>
                  ) : plan.id === 'free' ? (
                    '現在のプラン'
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      今すぐ始める
                    </>
                  )}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-start opacity-50">
                      <Check className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-500 line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">よくある質問</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">いつでもキャンセルできますか？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  はい、いつでもキャンセル可能です。解約後も期間終了まで全機能をご利用いただけます。
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">支払い方法は？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  クレジットカード（Visa、MasterCard、JCB、American Express）でのお支払いが可能です。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}