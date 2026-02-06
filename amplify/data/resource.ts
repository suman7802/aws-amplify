import { defineData } from '@aws-amplify/backend';
import { schema } from './schema';

export const data = defineData({
  name: 'todo',
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
