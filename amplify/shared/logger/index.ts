import { Logger } from '@aws-lambda-powertools/logger';

export const logger = {
  crud: new Logger({ serviceName: 'crud' }),
  auth: new Logger({ serviceName: 'auth' }),
  util: new Logger({ serviceName: 'util' }),
  service: new Logger({ serviceName: 'service' }),
  database: new Logger({ serviceName: 'database' }),
  S3Bucket: new Logger({ serviceName: 'S3Bucket' }),
  dbOperation: new Logger({ serviceName: 'dbOperation' }),
};
