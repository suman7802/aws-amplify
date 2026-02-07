import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { apiHandler } from '../../shared/utils/apiHandler.util';
import { Response } from '../../shared/utils/response.util';

export const handler: Handler = apiHandler(async (event, context) => {
  logger.crud.info('Hello World, delete todo');

  return Response.success(
    {
      messgae: 'todo deleted',
    },
    event,
  );
});
