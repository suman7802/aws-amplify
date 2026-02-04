import { z } from 'zod';

export const idSchema = z.string().trim().min(1, 'Id is required');
export const todoStatusEnum = z.enum(['pending', 'progress', 'completed']);

const todoBaseSchema = {
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Content is required'),
  status: todoStatusEnum,
  media: z.array(z.string()),
};

export const createTodoSchema = z.object({
  ...todoBaseSchema,
  status: todoStatusEnum.default('pending'),
  media: z.array(z.string()).default([]),
});

export type CreateTodoType = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = z
  .object({
    id: idSchema,
    ...todoBaseSchema,
    status: todoStatusEnum,
    media: z.array(z.string()),
  })
  .partial();

export type UpdateTodoType = z.infer<typeof updateTodoSchema>;

export const deleteTodoSchema = z.object({
  id: idSchema,
});

export type DeleteTodoType = z.infer<typeof deleteTodoSchema>;

export const getTodoByIdSchema = z.object({
  id: idSchema,
});

export type GetTodoByIdType = z.infer<typeof getTodoByIdSchema>;

export const getTodoListQuerySchema = z.object({
  status: todoStatusEnum.optional(),
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type GetTodoListQueryType = z.infer<typeof getTodoListQuerySchema>;
