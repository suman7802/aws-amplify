import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { Response } from '../../shared/utils/response.util';
import { apiHandler } from '../../shared/utils/apiHandler.util';

export const handler: Handler = apiHandler('api', async (event: APIGatewayProxyEvent) => {
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

  return Response.success(
    {
      data: mockTodo[0],
      message: 'update success',
    },
    event,
  );
});
