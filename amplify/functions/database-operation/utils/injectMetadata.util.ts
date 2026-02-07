import { randomUUID } from 'crypto';

/**
 * Generate ISO timestamp (UTC).
 */
function now(): string {
  return new Date().toISOString();
}

/**
 * Inject metadata for a CREATE operation.
 */
export function withCreateMetadata<T extends Record<string, any>>(item: T): T {
  const timestamp = now();

  return {
    id: item.id ?? randomUUID(),
    createdAt: item.createdAt ?? timestamp,
    ...item,
  };
}

/**
 * Inject metadata for an UPDATE operation.
 */
export function withUpdateMetadata<T extends Record<string, any>>(
  values: T,
): T {
  const timestamp = now();

  return {
    ...values,
    updatedAt: values.updatedAt ?? timestamp,
  };
}
