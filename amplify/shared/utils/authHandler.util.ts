import { Context } from 'aws-lambda';
import { handleError } from './errors.util';
import { logger } from '../logger';

/**
 * Standardizes error handling and logging for Cognito Lambda triggers.
 *
 * Unlike API Gateway handlers, Cognito triggers:
 * 1. Expect the 'event' object to be returned on success.
 * 2. Expect a plain Error to be thrown on failure (the message is shown to the user).
 */
export const authHandler = <TEvent, TResult = TEvent>(
  handler: (event: TEvent, context: Context) => Promise<TResult>,
) => {
  return async (event: TEvent, context: Context): Promise<TResult> => {
    try {
      logger.auth.info('Auth trigger event received', { event });
      const result = await handler(event, context);
      return result;
    } catch (error) {
      const apiError = handleError(error);

      // Cognito requires a plain Error where the message is what's displayed to users
      throw new Error(apiError.message);
    }
  };
};
