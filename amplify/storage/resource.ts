import { defineStorage } from '@aws-amplify/backend';

/**
 * Defines the storage resource for the backend.
 */
export const storage = defineStorage({
  name: 'storage',
  access: (allow) => ({
    'storage/{entity_id}/*': [allow.guest.to(['read', 'write', 'delete'])],
  }),
});
