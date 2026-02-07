import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';

import { handleError } from './errors.util';
import { Response } from './response.util';

type HandlerMode = 'api' | 'auth';
type AuthHandler<TEvent, TResult = TEvent> = (event: TEvent, context: Context) => Promise<TResult>;
type ApiHandler<T> = (event: APIGatewayProxyEvent, context: Context) => Promise<T | APIGatewayProxyResult>;

const globalLog = new Logger({ serviceName: 'global-logger' });

/**
 * Unified Lambda handler wrapper.
 */
export const apiHandler = <TEvent, TResult = TEvent>(mode: HandlerMode, handler: ApiHandler<TResult> | AuthHandler<TEvent, TResult>) => {
  return async (event: TEvent, context: Context): Promise<TResult | APIGatewayProxyResult> => {
    try {
      globalLog.info('Lambda event received', { mode, event });
      const result = await handler(event as any, context);

      // API GATEWAY MODE
      if (mode === 'api') {
        // If handler already returned a proxy result, pass through
        if (result && typeof result === 'object' && 'statusCode' in result && 'body' in result) {
          return result as APIGatewayProxyResult;
        }

        return Response.success(result as TResult, event as APIGatewayProxyEvent);
      }

      // COGNITO AUTH MODE
      return result as TResult;
    } catch (error) {
      globalLog.error('Lambda error', { error });
      const apiError = handleError(error);

      // API GATEWAY ERROR
      if (mode === 'api') {
        return Response.error(apiError.statusCode, apiError.toJSON(), event as APIGatewayProxyEvent);
      }

      // COGNITO AUTH MODE
      throw new Error(apiError.message);
    }
  };
};
