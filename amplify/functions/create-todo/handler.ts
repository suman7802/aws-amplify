import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { apiHandler } from '../../shared/utils/apiHandler';
import { createResponse } from '../../shared/utils/response';

export const handler: Handler = apiHandler(async (event, context) => {
  logger.crud.info('Hello World, create todo');

  console.log('context', context);
  console.log('event', event);

  createResponse(
    201,
    {
      evnet: event,
      messgae: 'todo created',
    },
    event,
  );
});
