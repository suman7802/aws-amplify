import { defineAuth } from '@aws-amplify/backend';
import { preSignUp } from './pre-signup/resource';
import { postConfirmation } from './post-confirmation/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['admin', 'user'],
  triggers: {
    preSignUp,
    postConfirmation,
  },
  // userAttributes: {
  //   'custom:status': {
  //     dataType: 'String',
  //     mutable: true,
  //   },
  // },
});
