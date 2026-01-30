import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Heart, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  Users,
  Zap,
  Lock,
  CreditCard
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-8">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            あなたのフィットネスを
            <br />
            次のレベルへ
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            AI搭載のパーソナルトレーナー、栄養管理、ウェアラブル連携で
            <br />
            理想の体を手に入れよう
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg">
                無料で始める
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              すべての機能を一つのアプリで
            </h2>
            <p className="text-lg text-gray-600">
              フィットネスに必要なすべてがここに
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>ワークアウト追跡</CardTitle>
                <CardDescription>
                  詳細なトレーニング記録と進捗管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  すべてのワークアウトを記録し、パフォーマンスの向上を可視化。
                  カスタマイズ可能なトレーニングプランで目標達成をサポート。
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>栄養管理</CardTitle>
                <CardDescription>
                  カロリーと栄養素を簡単に記録
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  食事を記録し、マクロ栄養素を追跡。
                  AIが最適な食事プランを提案し、健康的な食生活をサポート。
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>ウェアラブル連携</CardTitle>
                <CardDescription>
                  スマートウォッチと自動同期
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Apple Watch、Fitbit、Garminなどのデバイスと連携。
                  心拍数、歩数、睡眠データを自動で記録。
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>進捗分析</CardTitle>
                <CardDescription>
                  詳細なレポートとグラフ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  体重、体脂肪率、筋肉量の変化を可視化。
                  週次・月次レポートで成果を確認し、モチベーション維持。
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>セキュアな環境</CardTitle>
                <CardDescription>
                  HIPAA/GDPR準拠のセキュリティ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  医療レベルのセキュリティで健康データを保護。
                  暗号化、2段階認証で安心してご利用いただけます。
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>コミュニティ</CardTitle>
                <CardDescription>
                  仲間と一緒に目標達成
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  同じ目標を持つ仲間と繋がり、励まし合い。
                  チャレンジに参加して楽しくフィットネスを継続。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                企業レベルのセキュリティ
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                あなたの健康データは最高レベルのセキュリティで保護されています
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">HIPAA準拠</h3>
                    <p className="text-gray-600">医療情報保護法に完全準拠した安全な環境</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-fullbg-blue-100 flex items-center justify-center">
<Lock className="h-5 w-5 text-blue-600" />
</div>
<div className="ml-4">
<h3 className="text-lg font-semibold text-gray-900">エンドツーエンド暗号化</h3>
<p className="text-gray-600">すべての健康データは256bit暗号化で保護</p>
</div>
</div>
<div className="flex items-start">
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
<Zap className="h-5 w-5 text-purple-600" />
</div>
<div className="ml-4">
<h3 className="text-lg font-semibold text-gray-900">2段階認証</h3>
<p className="text-gray-600">不正アクセスを防ぐ追加のセキュリティ層</p>
</div>
</div>
</div>
</div>
<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
<div className="bg-white rounded-xl shadow-xl p-6">
<div className="flex items-center justify-between mb-4">
<span className="text-sm font-semibold text-gray-600">セキュリティスコア</span>
<span className="text-2xl font-bold text-green-600">A+</span>
</div>
<div className="space-y-3">
<div>
<div className="flex justify-between text-sm mb-1">
<span className="text-gray-600">データ暗号化</span>
<span className="font-semibold">100%</span>
</div>
<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-green-600" style={{ width: '100%' }} />
</div>
</div>
<div>
<div className="flex justify-between text-sm mb-1">
<span className="text-gray-600">アクセス制御</span>
<span className="font-semibold">100%</span>
</div>
<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-green-600" style={{ width: '100%' }} />
</div>
</div>
<div>
<div className="flex justify-between text-sm mb-1">
<span className="text-gray-600">監査ログ</span>
<span className="font-semibold">100%</span>
</div>
<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
<div className="h-full bg-green-600" style={{ width: '100%' }} />
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl font-bold text-white mb-6">
        今すぐフィットネスを始めよう
      </h2>
      <p className="text-xl text-white/90 mb-10">
        無料トライアルで全機能をお試しください
      </p>
      <Link href="/register">
        <Button size="lg" variant="secondary" className="text-lg">
          無料で始める →
        </Button>
      </Link>
    </div>
  </div>
</div>
);
}

