import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { dbClient } from '../../shared/db/client';
import { validate } from '../../shared/utils';
import { createTodoSchema } from '../../shared/schema/todo.schema';
import { Response } from '../../shared/utils/response.util';
import { apiHandler } from '../../shared/utils/apiHandler.util';

export const handler: Handler = apiHandler('api', async (event: APIGatewayProxyEvent) => {
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

  return Response.created({ message: 'Todo created successfully', result }, event);
});
