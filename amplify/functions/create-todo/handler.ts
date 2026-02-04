import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { dbClient } from '../../shared/db/client';
import { apiHandler } from '../../shared/utils/apiHandler.util';
import { createResponse } from '../../shared/utils/response.util';

export const handler: Handler = apiHandler(async (event, context) => {
  logger.crud.info(`create todo fn, evnet: ${event}`);

  const result = await dbClient({
    action: 'create',
    table: 'Test',
    item: {
      name: 'Suman Sharma',
      email: 'suman@gmail.com',
      phone: '+9779840282545',
    },
  });

  return createResponse(201, result, event);
});
