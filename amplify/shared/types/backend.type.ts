import { Backend } from '@aws-amplify/backend';

import { backendProps } from '../../backend';

export type AppBackend = Backend<typeof backendProps>;
