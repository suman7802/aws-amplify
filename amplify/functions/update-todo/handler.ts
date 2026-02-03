import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { apiHandler } from '../../shared/utils/apiHandler';
import { createResponse } from '../../shared/utils/response';

export const handler: Handler = apiHandler(async (event, context) => {
  logger.crud.info('Hello World, update todo');

  console.log('context', context);
  console.log('event', event);

  const mockTodo = [
    {
      id: 1,
      title: 'title 01',
      content: 'content 01',
    },
    {
      id: 2,
      title: 'title 02',
      content: 'content 02',
    },
  ];

  return createResponse(
    200,
    {
      data: mockTodo[0],
      message: 'update success',
    },
    event,
  );
});
