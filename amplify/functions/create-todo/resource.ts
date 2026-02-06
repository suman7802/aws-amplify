import { defineFunction } from '@aws-amplify/backend';
import { env } from '../../config';

export const createTodo = defineFunction({
  name: 'create-todo',
  entry: './handler.ts',
  bundling: { minify: false },
  resourceGroupName: 'crud',
  logging: {
    format: 'json',
    level: 'debug',
  },
  environment: {
    ALLOWED_ORIGINS: env.ALLOWED_ORIGINS,
  },
});
