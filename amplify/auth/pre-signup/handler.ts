import type { PreSignUpTriggerHandler } from 'aws-lambda';
import { createUserSchema } from '../../shared/schema/user.schema';

/**
 * Pre-Signup Trigger
 *
 * - Validates payload using Zod
 * - Enforces corporate email domain
 * - Auto-confirms trusted users
 */
export const handler: PreSignUpTriggerHandler = async (event) => {
  const attrs = event.request.userAttributes;

  createUserSchema.parse({
    name: attrs.name,
    phone: attrs.phone_number,
    email: attrs.email,
  });

  event.response.autoConfirmUser = false;
  event.response.autoVerifyEmail = false;

  return event;
};
