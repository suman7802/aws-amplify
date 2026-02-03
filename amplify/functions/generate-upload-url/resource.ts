import { defineFunction } from '@aws-amplify/backend';
import { env } from '../../config';

export const generateUploadUrl = defineFunction({
  name: 'generate-upload-url',
  entry: './handler.ts',
  bundling: { minify: false },
  timeoutSeconds: 15,
  resourceGroupName: 'media',
  logging: {
    format: 'json',
    level: 'debug',
  },
  environment: {
    MAX_SIZE: env.MAX_SIZE,
    ALLOWED_TYPES: env.ALLOWED_TYPES,
    ALLOWED_ORIGINS: env.ALLOWED_ORIGINS,
    SIGNED_URL_EXPIRE_IN: env.SIGNED_URL_EXPIRE_IN,
  },
});
