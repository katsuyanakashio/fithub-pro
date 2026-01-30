'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LogOut,
  Activity,
  Flame,
  TrendingUp,
  Calendar,
  Heart,
  Dumbbell,
  Apple,
  Watch,
  CreditCard,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    weight: number | null;
    height: number | null;
    subscriptionStatus: string | null;
  };
  stats: {
    workoutsCount: number;
    weeklyCalories: number;
  };
  recentWorkouts: Array<{
    id: string;
    title: string;
    type: string;
    duration: number;
    calories: number;
    date: Date;
  }>;
}

export default function DashboardClient({ user, stats, recentWorkouts }: DashboardClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const weeklyGoal = 2000;
  const caloriesProgress = (stats.weeklyCalories / weeklyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FitHub Pro
              </h1>
              <nav className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="text-blue-600 font-semibold px-3 py-2 rounded-lg bg-blue-50">
                  ダッシュボード
                </Link>
                <Link href="/workouts" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                  ワークアウト
                </Link>
                <Link href="/nutrition" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                  栄養管理
                </Link>
                <Link href="/wearables" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                  デバイス
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user.subscriptionStatus !== 'active' && (
                <Link href="/subscription">
                  <Button size="sm" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    プレミアム
                  </Button>
                </Link>
              )}
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            おかえりなさい、{user.name}さん 👋
          </h2>
          <p className="text-gray-600">今日も素晴らしい一日にしましょう！</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                総ワークアウト
              </CardTitle>
              <Dumbbell className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.workoutsCount}</div>
              <p className="text-xs text-gray-500 mt-1">累計セッション数</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                今週の消費カロリー
              </CardTitle>
              <Flame className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.weeklyCalories.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">kcal</p>
              <Progress value={caloriesProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                BMI
              </CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {user.weight && user.height
                  ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
                  : '--'}
              </div>
              <p className="text-xs text-gray-500 mt-1">標準範囲</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                連続日数
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">7</div>
              <p className="text-xs text-gray-500 mt-1">日連続トレーニング中 🔥</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                最近のワークアウト
              </CardTitle>
              <CardDescription>直近5件のトレーニング履歴</CardDescription>
            </CardHeader>
            <CardContent>
              {recentWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {recentWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/workouts/${workout.id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Dumbbell className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{workout.title}</h4>
                          <p className="text-sm text-gray-500">
                            {workout.duration}分 • {workout.calories} kcal
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">{workout.type}</Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(workout.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">まだワークアウトがありません</p>
                  <Link href="/workouts">
                    <Button>
                      最初のワークアウトを記録
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  今日の目標
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">運動時間</span>
                    <span className="font-semibold">30 / 60分</span>
                  </div>
                  <Progress value={50} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">歩数</span>
                    <span className="font-semibold">5,234 / 10,000歩</span>
                  </div>
                  <Progress value={52} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
<span className="text-gray-600">水分摂取</span>
<span className="font-semibold">1.5 / 2.0L</span>
</div>
<Progress value={75} />
</div>
</CardContent>
</Card>
<Card>
          <CardHeader>
            <CardTitle className="text-base">クイックアクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/workouts" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Dumbbell className="h-4 w-4 mr-2" />
                ワークアウトを記録
              </Button>
            </Link>
            <Link href="/nutrition" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Apple className="h-4 w-4 mr-2" />
                食事を記録
              </Button>
            </Link>
            <Link href="/wearables" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Watch className="h-4 w-4 mr-2" />
                デバイス同期
              </Button>
            </Link>
            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                設定
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</div>
);
}