import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { dbClient } from '../../shared/db/client';
import { apiHandler } from '../../shared/utils/apiHandler.util';
import { createResponse } from '../../shared/utils/response.util';

export const handler: Handler = apiHandler(async (event, context) => {
  logger.crud.info('create todo fn event', { event });

  return createResponse(201, { message: 'Todo created successfully' }, event);
});
