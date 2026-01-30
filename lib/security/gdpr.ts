import prisma from '@/lib/prisma';
import { encrypt } from './encryption';

export async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workouts: true,
      nutritionLogs: true,
      healthData: true,
      wearableDevices: true,
      auditLogs: {
        take: 100,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { password, twoFactorSecret, ...sanitizedUser } = user;

  return {
    userData: sanitizedUser,
    exportedAt: new Date().toISOString(),
    format: 'JSON',
  };
}

export async function deleteUserData(userId: string) {
  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.workout.deleteMany({ where: { userId } }),
    prisma.nutritionLog.deleteMany({ where: { userId } }),
    prisma.healthData.deleteMany({ where: { userId } }),
    prisma.wearableDevice.deleteMany({ where: { userId } }),
    prisma.auditLog.deleteMany({ where: { userId } }),
    prisma.payment.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
}

export async function anonymizeUserData(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      email: `deleted-${userId}@anonymized.com`,
      name: 'Deleted User',
      phone: null,
      dateOfBirth: null,
      stripeCustomerId: null,
    },
  });
}