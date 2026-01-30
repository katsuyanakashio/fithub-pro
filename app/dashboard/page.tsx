import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/jwt';
import DashboardClient from './dashboard-client';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      weight: true,
      height: true,
      subscriptionStatus: true,
    },
  });

  const workoutsCount = await prisma.workout.count({
    where: { userId: session.userId },
  });

  const recentWorkouts = await prisma.workout.findMany({
    where: { userId: session.userId },
    orderBy: { date: 'desc' },
    take: 5,
  });

  const totalCalories = await prisma.workout.aggregate({
    where: {
      userId: session.userId,
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: {
      calories: true,
    },
  });

  return (
    <DashboardClient
      user={user!}
      stats={{
        workoutsCount,
        weeklyCalories: totalCalories._sum.calories || 0,
      }}
      recentWorkouts={recentWorkouts}
    />
  );
}