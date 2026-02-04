import type { Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { apiHandler } from '../../shared/utils/apiHandler';
import { createResponse } from '../../shared/utils/response';
import { DynamoPayload, TableItemMap } from '../../shared/db/contracts';
import { sendToDb } from '../../shared/db/client';

export const handler: Handler = apiHandler(async (event, context) => {
  logger.crud.info('Hello World, create todo');

  const payload: DynamoPayload = {
    action: 'create',
    table: 'Todo',
    item: {
      title: 'Learn AWS',
      content: 'Learn AWS',
      userId: '123',
    },
  };

  const result = await sendToDb(payload);

  return createResponse(201, result, event);
});
