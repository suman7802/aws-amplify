import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { apiHandler } from '../../shared/utils/apiHandler';

export const handler: Handler = apiHandler(async (event, context) => {
  logger.crud.info('Hello World, delete todo');

  console.log('context', context);
  console.log('event', event);
});
