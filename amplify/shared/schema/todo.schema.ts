import { z } from 'zod';

export const todoStatusEnum = z.enum(['pending', 'progress', 'completed']);

export const baseTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Content is required'),
  media: z.array(z.string()).optional(),
});

export const createTodoSchema = baseTodoSchema.extend({
  status: todoStatusEnum.default('pending'),
});
export type CreateTodoType = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = baseTodoSchema
  .extend({
    status: todoStatusEnum,
  })
  .partial();
export type UpdateTodoType = z.infer<typeof updateTodoSchema>;
