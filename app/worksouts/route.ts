import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/jwt';
import { workoutSchema } from '@/lib/validations/workout';
import { calculateCalories } from '@/lib/utils';
import { createAuditLog } from '@/lib/security/audit-log';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');

    const where: any = { userId: session.userId };
    if (type) {
      where.type = type;
    }

    const workouts = await prisma.workout.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
      include: {
        exercises: true,
      },
    });

    const total = await prisma.workout.count({ where });

    return NextResponse.json({
      workouts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    return NextResponse.json(
      { error: 'ワークアウトの取得に失敗しました' },
      { status: 500 }
    );
  }
}

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
    const validatedData = workoutSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    const calories = user?.weight
      ? calculateCalories(user.weight, validatedData.duration, validatedData.intensity)
      : validatedData.duration * 5;

    const workout = await prisma.workout.create({
      data: {
        userId: session.userId,
        title: validatedData.title,
        type: validatedData.type,
        duration: validatedData.duration,
        calories: Math.round(calories),
        distance: validatedData.distance,
        intensity: validatedData.intensity,
        notes: validatedData.notes,
        date: new Date(validatedData.date),
      },
    });

    await createAuditLog({
      userId: session.userId,
      action: 'create',
      resource: 'workout',
      ipAddress,
      userAgent,
      status: 'success',
      details: `Created workout: ${workout.title}`,
    });

    return NextResponse.json(
      { message: 'ワークアウトを作成しました', workout },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create workout error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'ワークアウトの作成に失敗しました' },
      { status: 500 }
    );
  }
}