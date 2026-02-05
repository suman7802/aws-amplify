import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'storage',
  access: (allow) => ({
    'storage/{entity_id}/*': [allow.guest.to(['read', 'write', 'delete'])],
  }),
});
