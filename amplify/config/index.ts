export const env = {
  ALLOWED_ORIGINS: '*', // allowed origins
  ALLOWED_TYPES: 'image/jpeg,image/png,image/webp', // allowed media types
  SIGNED_URL_EXPIRE_IN: String(60), // signed url expire time in seconds
  MAX_SIZE: String(1024 * 1024 * 3), // media size 3MB
};
