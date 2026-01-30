import prisma from '@/lib/prisma';

export interface AuditLogData {
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent?: string;
  status: 'success' | 'failure';
  details?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        status: data.status,
        details: data.details,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

export async function getUserAuditLogs(userId: string, limit: number = 50) {
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}