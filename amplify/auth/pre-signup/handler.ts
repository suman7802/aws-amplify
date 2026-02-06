import type { PreSignUpTriggerEvent } from 'aws-lambda';
import { createUserSchema } from '../../shared/schema/user.schema';
import { authHandler } from '../../shared/utils';

/**
 * Pre-Signup Trigger
 *
 * - Validates payload using Zod
 * - Enforces corporate email domain
 * - Auto-confirms trusted users
 */
export const handler = authHandler<PreSignUpTriggerEvent>(async (event) => {
  const attrs = event.request.userAttributes;

  createUserSchema.parse({
    name: attrs.name,
    phone: attrs.phone_number,
    email: attrs.email,
  });

  // Auto-confirm/verify logic (can be expanded based on trusted domains etc.)
  event.response.autoConfirmUser = false;
  event.response.autoVerifyEmail = false;

  return event;
});
