/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * API Utils v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

import { generateUUID } from './functions.js';
import { RESPONSE_STATUS, API_ERROR_MESSAGES } from './api_constants.js';

/**
 * Build success response (HTTP 200)
 * @param {Array} results - Array of result objects
 * @param {string} statusMessage - Success message
 * @param {string} sessionId - Session UUID
 * @returns {Object} Success response object
 */
export function buildSuccessResponse(results = [], statusMessage = 'Success', sessionId = null) {
  return {
    results,
    rows: results.length,
    sessionId: sessionId || generateUUID(),
    statusMessage,
    statusCode: 0,
    status: RESPONSE_STATUS.SUCCESS,
  };
}

/**
 * Build simple success response (HTTP 201-206)
 * @param {number} statusCode - HTTP status code
 * @param {string} statusMessage - Success message
 * @param {string} sessionId - Session UUID
 * @returns {Object} Simple success response object
 */
export function buildSimpleSuccessResponse(statusCode, statusMessage = 'Accepted', sessionId = null) {
  return {
    sessionId: sessionId || generateUUID(),
    statusMessage,
    statusCode,
    status: RESPONSE_STATUS.SUCCESS,
  };
}

/**
 * Build error response
 * @param {number} statusCode - Error code (negative)
 * @param {string} statusMessage - Error message (optional, will use default if not provided)
 * @param {string} sessionId - Session UUID
 * @returns {Object} Error response object
 */
export function buildErrorResponse(statusCode, statusMessage = null, sessionId = null) {
  return {
    sessionId: sessionId || generateUUID(),
    statusMessage: statusMessage || API_ERROR_MESSAGES[statusCode] || 'Unknown error',
    statusCode,
    status: RESPONSE_STATUS.ERROR,
  };
}

/**
 * Check if response is error
 * @param {Object} response - API response
 * @returns {boolean} True if error
 */
export function isErrorResponse(response) {
  return response?.status === RESPONSE_STATUS.ERROR;
}

/**
 * Check if response is success
 * @param {Object} response - API response
 * @returns {boolean} True if success
 */
export function isSuccessResponse(response) {
  return response?.status === RESPONSE_STATUS.SUCCESS;
}

/**
 * Extract error code from response
 * @param {Object} response - API response
 * @returns {number|null} Error code or null
 */
export function getErrorCode(response) {
  return isErrorResponse(response) ? response.statusCode : null;
}

/**
 * Extract error message from response
 * @param {Object} response - API response
 * @returns {string|null} Error message or null
 */
export function getErrorMessage(response) {
  return isErrorResponse(response) ? response.statusMessage : null;
}

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
export function buildQueryString(params) {
  if (!params || Object.keys(params).length === 0) return '';
  
  const query = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return query ? `?${query}` : '';
}

/**
 * Build authorization header
 * @param {string} token - Access token
 * @returns {Object} Headers object
 */
export function buildAuthHeader(token) {
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Build headers with language code
 * @param {string} languageCode - Language code
 * @param {string} token - Access token (optional)
 * @returns {Object} Headers object
 */
export function buildHeaders(languageCode = null, token = null) {
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (languageCode) {
    headers['LanguageCode'] = languageCode;
  }
  
  return headers;
}
