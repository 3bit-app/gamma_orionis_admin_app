/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * API Constants v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

// API Base URLs
export const API_BASE_URL = 'https://3bit.app';
export const API_VERSION = 'v1';

// Service paths
export const SERVICE_PATHS = {
  AUTH: '/service/auth/v1',
  ANALYTIC: '/service/analytic/v1',
  MARKET: '/service/market/v1',
  SUPPORT: '/service/support/v1',
};

// Error codes mapping
export const API_ERROR_CODES = {
  CONTENT_NOT_FOUND: -1001,
  MODULE_NOT_FOUND: -1002,
  CONFIGURATION_NOT_FOUND: -1003,
  DATABASE_CONNECTION_FAILED: -1004,
  AUTHORIZATION_FAILED: -1005,
  USER_NOT_ACTIVATED: -1006,
  ACCESS_TOKEN_EXPIRED: -1007,
  INVALID_ACCESS_TOKEN: -1008,
  INVALID_USERNAME_OR_PASSWORD: -1009,
  INVALID_EMAIL_OR_PASSWORD: -1010,
  INVALID_UPDATE_TOKEN: -1011,
  SOMETHING_WENT_WRONG: -1012,
  USER_BANNED: -1013,
  USER_TEMPORARY_BANNED: -1014,
  ROLE_PRIVILEGE_NOT_FOUND: -1015,
  USER_PRIVILEGE_NOT_FOUND: -1016,
  USER_REMOVED: -1017,
  USER_EMAIL_ALREADY_EXIST: -1018,
  USER_USERNAME_ALREADY_EXIST: -1019,
  USER_NICKNAME_ALREADY_EXIST: -1020,
  TOO_MANY_ATTEMPTS: -1021,
  DATA_NOT_FOUND: -1022,
  DATA_NOT_AVAILABLE: -1023,
  REQUEST_DATA_EXCEEDS_LIMIT: -1024,
  DATABASE_ERROR: -1100,
};

// Error messages
export const API_ERROR_MESSAGES = {
  [API_ERROR_CODES.CONTENT_NOT_FOUND]: 'Content not found',
  [API_ERROR_CODES.MODULE_NOT_FOUND]: 'Module or name not found',
  [API_ERROR_CODES.CONFIGURATION_NOT_FOUND]: 'Configuration not found',
  [API_ERROR_CODES.DATABASE_CONNECTION_FAILED]: 'Database connection failed',
  [API_ERROR_CODES.AUTHORIZATION_FAILED]: 'Authorization failed',
  [API_ERROR_CODES.USER_NOT_ACTIVATED]: 'User not activated',
  [API_ERROR_CODES.ACCESS_TOKEN_EXPIRED]: 'Access token expired',
  [API_ERROR_CODES.INVALID_ACCESS_TOKEN]: 'Invalid access token',
  [API_ERROR_CODES.INVALID_USERNAME_OR_PASSWORD]: 'Invalid username or password',
  [API_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD]: 'Invalid email or password',
  [API_ERROR_CODES.INVALID_UPDATE_TOKEN]: 'Invalid update token',
  [API_ERROR_CODES.SOMETHING_WENT_WRONG]: 'Something went wrong! Try again later',
  [API_ERROR_CODES.USER_BANNED]: 'User has been banned',
  [API_ERROR_CODES.USER_TEMPORARY_BANNED]: 'User temporary banned',
  [API_ERROR_CODES.ROLE_PRIVILEGE_NOT_FOUND]: 'Role privilege not found',
  [API_ERROR_CODES.USER_PRIVILEGE_NOT_FOUND]: 'User privilege not found',
  [API_ERROR_CODES.USER_REMOVED]: 'User has been removed',
  [API_ERROR_CODES.USER_EMAIL_ALREADY_EXIST]: 'User email already exist',
  [API_ERROR_CODES.USER_USERNAME_ALREADY_EXIST]: 'User username already exist',
  [API_ERROR_CODES.USER_NICKNAME_ALREADY_EXIST]: 'User nickname already exist',
  [API_ERROR_CODES.TOO_MANY_ATTEMPTS]: 'Too many attempts, no more allowed',
  [API_ERROR_CODES.DATA_NOT_FOUND]: 'Data not found',
  [API_ERROR_CODES.DATA_NOT_AVAILABLE]: 'Data not available',
  [API_ERROR_CODES.REQUEST_DATA_EXCEEDS_LIMIT]: 'Request data exceeds limit',
  [API_ERROR_CODES.DATABASE_ERROR]: 'Database error',
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_ENTITY_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Success codes
export const API_SUCCESS_CODES = {
  SUCCESS: 0,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
};

// Response status
export const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};
