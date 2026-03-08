/**
 * Shared types for jose to resolve ESM/CJS compatibility issues.
 * Using inline import types is the recommended way to reference ESM types in a CJS environment
 * without triggering 'require' calls that cause TS1479 errors in strict environments like Vercel.
 */

/* eslint-disable @typescript-eslint/consistent-type-imports */
export type JWTPayload = import('jose').JWTPayload;
