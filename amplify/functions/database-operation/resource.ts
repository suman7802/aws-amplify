import { defineFunction } from '@aws-amplify/backend';
import { env } from '../../config';

export const databaseOperation = defineFunction({
  name: 'database-operation',
  entry: './handler.ts',
  bundling: { minify: false },
  resourceGroupName: 'data',
  logging: {
    format: 'json',
    level: 'debug',
  },
  environment: {
    ALLOWED_ORIGINS: env.ALLOWED_ORIGINS,
  },
});
