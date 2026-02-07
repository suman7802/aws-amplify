import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { apiHandler } from '../../shared/utils/apiHandler.util';
import { Response } from '../../shared/utils/response.util';

export const handler: Handler = apiHandler('api', async (event: APIGatewayProxyEvent) => {
  logger.crud.info('Hello World, delete todo');

  return Response.success(
    {
      messgae: 'todo deleted',
    },
    event,
  );
});
