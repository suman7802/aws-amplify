import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'media',
  access: (allow) => ({
    'media/{entity_id}/*': [allow.guest.to(['read', 'write', 'delete'])],
  }),
});
