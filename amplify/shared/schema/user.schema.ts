import { z } from 'zod';

export const userStatusEnum = z.enum(['PENDING', 'ACTIVE', 'SUSPENDED']);

export const baseUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  phone: z.string().optional(),
});

export const createUserSchema = baseUserSchema
  .extend({
    email: z.string().email(),
  })
  .passthrough();
export type CreateUserType = z.infer<typeof createUserSchema>;

export const updateUserSchema = baseUserSchema
  .extend({
    profileUrl: z.string().url().optional(),
    coverUrl: z.string().url().optional(),
  })
  .partial()
  .strict();
export type UpdateUserType = z.infer<typeof updateUserSchema>;
