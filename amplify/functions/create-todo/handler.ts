import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { dbClient } from '../../shared/db/client';
import { apiHandler } from '../../shared/utils/apiHandler.util';
import { validate } from '../../shared/utils';
import { createTodoSchema } from '../../shared/schema/todo.schema';
import { Response } from '../../shared/utils/response.util';

export const handler: Handler = apiHandler(async (event) => {
  logger.crud.info('create todo fn event', { event });
  const body = validate.body(event.body, createTodoSchema);

  const result = await dbClient({
    action: 'create',
    table: 'Todo',
    item: {
      userId: '123',
      ...body,
    },
  });

  return Response.created(
    { message: 'Todo created successfully', result },
    event,
  );
});
