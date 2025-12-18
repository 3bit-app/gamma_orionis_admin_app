/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * Auth service helpers v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

import { isEmailAddress } from './functions.js';
import { isErrorResponse, getErrorCode, getErrorMessage } from './api_utils.js';
import { API_ERROR_CODES } from './api_constants.js';

/**
 * Universal helper to extract first data item from response.results
 * Handles both array and object formats
 * @param {Object} response - API response
 * @returns {Object|null} First data item or null
 */
function getFirstResult(response) {
  if (!response?.results) return null;
  
  // If results is an array, take first element
  if (Array.isArray(response.results)) {
    return response.results[0] || null;
  }
  
  // If results is an object, return it directly
  if (typeof response.results === 'object') {
    return response.results;
  }
  
  return null;
}

/**
 * Extract tokens from auth response
 * @param {Object} response - API response
 * @returns {Object|null} { accessToken, updateToken, tokenExpired, username } or null
 */
export function extractAuthTokens(response) {
  const data = getFirstResult(response);
  if (!data) return null;
  
  return {
    accessToken: data.accessToken || null,
    updateToken: data.updateToken || null,
    tokenExpired: data.tokenExpired || null,
    username: data.username || null,
  };
}

/**
 * Extract user data from response
 * @param {Object} response - API response
 * @returns {Object|null} User data or null
 */
export function extractUserData(response) {
  return getFirstResult(response);
}

/**
 * Extract users list from response
 * @param {Object} response - API response
 * @returns {Array} Users array
 */
export function extractUsersList(response) {
  return response?.results || [];
}

/**
 * Check if user is activated
 * @param {Object} userData - User data object
 * @returns {boolean} True if activated
 */
export function isUserActivated(userData) {
  return userData?.activated === true;
}

/**
 * Check if user is banned
 * @param {Object} userData - User data object
 * @returns {boolean} True if banned
 */
export function isUserBanned(userData) {
  return userData?.status === 0 || userData?.status === -1;
}

/**
 * Check if user has role
 * @param {Object} userData - User data object
 * @param {string} roleName - Role name to check
 * @returns {boolean} True if user has role
 */
export function hasRole(userData, roleName) {
  return userData?.role?.name === roleName;
}

/**
 * Check if error is auth-related
 * @param {Object} response - API response
 * @returns {boolean} True if auth error
 */
export function isAuthError(response) {
  if (!isErrorResponse(response)) return false;
  
  const code = getErrorCode(response);
  return [
    API_ERROR_CODES.AUTHORIZATION_FAILED,
    API_ERROR_CODES.ACCESS_TOKEN_EXPIRED,
    API_ERROR_CODES.INVALID_ACCESS_TOKEN,
    API_ERROR_CODES.INVALID_USERNAME_OR_PASSWORD,
    API_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD,
    API_ERROR_CODES.INVALID_UPDATE_TOKEN,
  ].includes(code);
}

/**
 * Check if error is user status related
 * @param {Object} response - API response
 * @returns {boolean} True if user status error
 */
export function isUserStatusError(response) {
  if (!isErrorResponse(response)) return false;
  
  const code = getErrorCode(response);
  return [
    API_ERROR_CODES.USER_NOT_ACTIVATED,
    API_ERROR_CODES.USER_BANNED,
    API_ERROR_CODES.USER_TEMPORARY_BANNED,
    API_ERROR_CODES.USER_REMOVED,
  ].includes(code);
}

/**
 * Check if error is privilege related
 * @param {Object} response - API response
 * @returns {boolean} True if privilege error
 */
export function isPrivilegeError(response) {
  if (!isErrorResponse(response)) return false;
  
  const code = getErrorCode(response);
  return [
    API_ERROR_CODES.ROLE_PRIVILEGE_NOT_FOUND,
    API_ERROR_CODES.USER_PRIVILEGE_NOT_FOUND,
  ].includes(code);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validatePassword(password) {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one digit');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  return isEmailAddress(email);
}

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateUsername(username) {
  const errors = [];
  
  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username && username.length > 50) {
    errors.push('Username must not exceed 50 characters');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, hyphens and underscores');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format user display name
 * @param {Object} userData - User data
 * @returns {string} Display name
 */
export function getUserDisplayName(userData) {
  if (!userData) return 'Unknown User';
  
  if (userData.username && !userData.username.startsWith('User-')) {
    return userData.username;
  }
  
  if (userData.email) {
    return userData.email.split('@')[0];
  }
  
  return userData.username || 'User';
}

/**
 * Get user avatar URL or initials
 * @param {Object} userData - User data
 * @returns {Object} { type: 'url'|'initials', value: string }
 */
export function getUserAvatar(userData) {
  if (userData?.hasPicture && userData?.pictureLink) {
    return {
      type: 'url',
      value: userData.pictureLink,
    };
  }
  
  const displayName = getUserDisplayName(userData);
  const initials = displayName
    .split(/[\s_-]+/)
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  return {
    type: 'initials',
    value: initials || 'U',
  };
}

/**
 * Parse token expiration timestamp
 * @param {number} tokenExpired - Token expiration timestamp
 * @returns {Object} { expired: boolean, expiresAt: Date, remainingMs: number }
 */
export function parseTokenExpiration(tokenExpired) {
  if (!tokenExpired) {
    return { expired: true, expiresAt: null, remainingMs: 0 };
  }
  
  const expiresAt = new Date(tokenExpired * 1000);
  const now = new Date();
  const remainingMs = expiresAt.getTime() - now.getTime();
  
  return {
    expired: remainingMs <= 0,
    expiresAt,
    remainingMs: Math.max(0, remainingMs),
  };
}

/**
 * Format gender value to display string
 * @param {number} gender - Gender code
 * @returns {string} Gender display string
 */
export function formatGender(gender) {
  const genderMap = {
    0: 'Not specified',
    1: 'Male',
    2: 'Female',
    10: 'Non-binary',
    11: 'Other',
  };
  
  return genderMap[gender] || 'Unknown';
}

/**
 * Format user status to display string
 * @param {number} status - Status code
 * @returns {string} Status display string
 */
export function formatUserStatus(status) {
  const statusMap = {
    0: 'Inactive',
    1: 'Active',
    2: 'Premium',
    '-1': 'Banned',
  };
  
  return statusMap[status] || 'Unknown';
}
