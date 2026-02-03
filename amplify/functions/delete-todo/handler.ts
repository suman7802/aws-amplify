import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { apiHandler } from '../../shared/utils/apiHandler';
import { createResponse } from '../../shared/utils/response';

export const handler: Handler = apiHandler(async (event, context) => {
  logger.crud.info('Hello World, delete todo');

  console.log('context', context);
  console.log('event', event);

  return createResponse(
    200,
    {
      messgae: 'todo deleted',
    },
    event,
  );
});
