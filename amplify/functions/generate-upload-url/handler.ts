import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { Response } from '../../shared/utils/response.util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getUserInfo } from '../../shared/utils/getUserInfo.util';
import { ApiError } from '../../shared/utils/errors.util';
import { apiHandler } from '../../shared/utils/apiHandler.util';

const s3 = new S3Client({});

/**
 * AWS Lambda handler that generates a pre-signed S3 upload URL for user media uploads.
 *
 * This endpoint validates the requested file's content type and size using query
 * parameters, then returns a time-limited pre-signed URL allowing the client to
 * upload directly to S3.
 *
 * @param {import('aws-lambda').APIGatewayProxyEvent} event
 * The API Gateway event containing query string parameters:
 * - contentType {string} MIME type of the file (e.g. image/jpeg)
 * - contentLength {string} Size of the file in bytes
 *
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 * A response containing:
 * - key {string} The S3 object key where the file should be uploaded
 * - uploadUrl {string} The pre-signed S3 upload URL
 *
 * @throws {ApiError}
 * Throws an error if:
 * - contentType is missing or not allowed
 * - contentLength is missing, zero, or exceeds the maximum allowed size
 *
 * @env MEDIA_BUCKET
 * The S3 bucket used to store uploaded media.
 *
 * @env MAX_SIZE
 * Maximum allowed file size in bytes.
 *
 * @env ALLOWED_TYPES
 * Comma-separated list of allowed MIME types.
 *
 * @env SIGNED_URL_EXPIRE_IN
 * Expiration time (in seconds) for the generated pre-signed URL.
 */
export const handler: Handler = apiHandler('api', async (event: APIGatewayProxyEvent) => {
  const MAX_SIZE = Number(process.env.MAX_SIZE);
  const ALLOWED_TYPES = process.env.ALLOWED_TYPES?.split(',').map((origin) => origin.trim());
  const SIGNED_URL_EXPIRE_IN = Number(process.env.SIGNED_URL_EXPIRE_IN);

  const { userId } = getUserInfo(event);
  const { contentType, contentLength } = event.queryStringParameters || {};

  const size = Number(contentLength);

  if (!contentType || !ALLOWED_TYPES?.includes(contentType)) {
    throw new ApiError(400, 'Invalid media type. Only JPEG, PNG, and WebP are allowed.');
  }

  if (size === 0 || size > MAX_SIZE) {
    throw new ApiError(400, `File size must be between 1 byte and ${MAX_SIZE / (1024 * 1024)}MB.`);
  }

  const extension = contentType.split('/')[1] || 'jpg';
  const key = `users/${userId}/${crypto.randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.MEDIA_BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: SIGNED_URL_EXPIRE_IN,
  });

  return Response.create(
    201,
    {
      key,
      uploadUrl,
      message: 'Upload url generated successfully',
    },
    event,
  );
});
