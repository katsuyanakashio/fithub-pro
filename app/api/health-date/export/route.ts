import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/jwt';
import { exportUserData } from '@/lib/security/gdpr';
import { createAuditLog } from '@/lib/security/audit-log';

export async function GET(request: NextRequest) {
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

    const userData = await exportUserData(session.userId);

    await createAuditLog({
      userId: session.userId,
      action: 'export_data',
      resource: 'user_data',
      ipAddress,
      userAgent,
      status: 'success',
      details: 'GDPR data export',
    });

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Export data error:', error);
    return NextResponse.json(
      { error: 'データのエクスポートに失敗しました' },
      { status: 500 }
    );
  }
}