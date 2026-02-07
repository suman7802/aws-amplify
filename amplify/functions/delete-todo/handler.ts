import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { apiHandler } from '../../shared/utils/apiHandler.util';
import { Response } from '../../shared/utils/response.util';

export const handler: Handler = apiHandler('api', async (event: APIGatewayProxyEvent) => {
  return Response.success(
    {
      messgae: 'todo deleted',
    },
    event,
  );
});
