import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/jwt';
import { createAuditLog } from '@/lib/security/audit-log';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!session) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { deviceType, deviceName, deviceId } = body;

    if (!deviceType || !deviceName || !deviceId) {
      return NextResponse.json(
        { error: 'デバイス情報が不足しています' },
        { status: 400 }
      );
    }

    const existingDevice = await prisma.wearableDevice.findUnique({
      where: { deviceId },
    });

    if (existingDevice && existingDevice.userId !== session.userId) {
      return NextResponse.json(
        { error: 'このデバイスは既に別のユーザーに接続されています' },
        { status: 400 }
      );
    }

    const device = await prisma.wearableDevice.upsert({
      where: { deviceId },
      update: {
        connected: true,
        lastSync: new Date(),
      },
      create: {
        userId: session.userId,
        deviceType,
        deviceName,
        deviceId,
        connected: true,
      },
    });

    await createAuditLog({
      userId: session.userId,
      action: 'connect',
      resource: 'wearable_device',
      ipAddress,
      userAgent,
      status: 'success',
      details: `Connected device: ${deviceName}`,
    });

    return NextResponse.json({
      message: 'デバイスを接続しました',
      device,
    });
  } catch (error) {
    console.error('Connect device error:', error);
    return NextResponse.json(
      { error: 'デバイスの接続に失敗しました' },
      { status: 500 }
    );
  }
}