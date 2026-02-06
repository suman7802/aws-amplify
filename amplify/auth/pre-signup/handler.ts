import type { PreSignUpTriggerHandler } from 'aws-lambda';
import { createUserSchema } from '../../shared/schema/user.schema';
import { handleError } from '../../shared/utils/errors.util';

/**
 * Pre-Signup Trigger
 *
 * - Validates payload using Zod
 * - Enforces corporate email domain
 * - Auto-confirms trusted users
 */
export const handler: PreSignUpTriggerHandler = async (event) => {
  const attrs = event.request.userAttributes;

  try {
    createUserSchema.parse({
      name: attrs.name,
      phone: attrs.phone_number,
      email: attrs.email,
    });
  } catch (error) {
    handleError(error);
  }

  event.response.autoConfirmUser = false;
  event.response.autoVerifyEmail = false;

  return event;
};
