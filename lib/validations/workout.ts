import { z } from 'zod';

export const workoutSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  type: z.enum(['cardio', 'strength', 'flexibility', 'sports', 'other']),
  duration: z.number().min(1, '運動時間を入力してください'),
  intensity: z.enum(['low', 'medium', 'high']),
  distance: z.number().optional(),
  notes: z.string().optional(),
  date: z.string(),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, '種目名を入力してください'),
  sets: z.number().min(1),
  reps: z.number().min(1),
  weight: z.number().optional(),
  duration: z.number().optional(),
});

export type WorkoutInput = z.infer<typeof workoutSchema>;
export type ExerciseInput = z.infer<typeof exerciseSchema>;