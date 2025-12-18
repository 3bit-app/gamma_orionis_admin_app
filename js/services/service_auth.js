/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * Auth service API v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

import { connector } from '../connector.js';
import { API_BASE_URL, SERVICE_PATHS } from '../api_constants.js';
import { buildQueryString, buildAuthHeader, buildHeaders } from '../api_utils.js';
import { extractAuthTokens } from '../auth_helpers.js';

const BASE_URL = API_BASE_URL + SERVICE_PATHS.AUTH;

let accessToken = null;
let updateToken = null;

export const authService = {

  /* ==================== Token Management ==================== */

  setAccessToken(token) {
    accessToken = token;
  },

  getAccessToken() {
    return accessToken;
  },

  setUpdateToken(token) {
    updateToken = token;
  },

  getUpdateToken() {
    return updateToken;
  },

  clearTokens() {
    accessToken = null;
    updateToken = null;
  },

  /* ==================== Version & Maintenance ==================== */

  /**
   * Get API version
   * @returns {Promise<Object>} Version info
   */
  async getVersion() {
    return await connector.get(`${BASE_URL}/admin/version`);
  },

  /**
   * Get service maintenance info
   * @returns {Promise<Object>} Maintenance info
   */
  async getServiceMaintenance() {
    return await connector.get(`${BASE_URL}/admin/service/maintenance`);
  },

  /* ==================== User Authentication ==================== */

  /**
   * User login
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @returns {Promise<Object>} Login response with tokens
   */
  async login(username, password) {
    const query = buildQueryString({ username, password });
    const url = `${BASE_URL}/user/login${query}`;
    
    console.log('Orionis ★ Auth Service: Calling login API');
    console.log('Orionis ★ Full URL:', url);
    
    const response = await connector.get(url);
    
    console.log('Orionis ★ Auth Service: Response received:', response);
    
    // Extract tokens using universal helper (handles both array and object)
    const tokens = extractAuthTokens(response);
    if (tokens?.accessToken) this.setAccessToken(tokens.accessToken);
    if (tokens?.updateToken) this.setUpdateToken(tokens.updateToken);
    
    return response;
  },

  /**
   * User logout
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} Logout response
   */
  async logout(username, password) {
    const query = buildQueryString({ username, password });
    const response = await connector.get(`${BASE_URL}/user/logout${query}`);
    this.clearTokens();
    return response;
  },

  /**
   * Get user token (refresh with update token)
   * @param {string} token - Update token
   * @returns {Promise<Object>} Token response
   */
  async getUserToken(token) {
    const query = buildQueryString({ token });
    return await connector.get(`${BASE_URL}/user/token${query}`);
  },

  /**
   * Login with Google ID token
   * @param {string} idToken - Google ID token
   * @returns {Promise<Object>} Login response
   */
  async loginWithGoogle(idToken) {
    return await connector.post(`${BASE_URL}/user/with/google`, { idToken });
  },

  /* ==================== User Info ==================== */

  /**
   * Get current user info
   * @returns {Promise<Object>} User data
   */
  async getUser() {
    const url = `${BASE_URL}/user/me`;
    
    console.log('Orionis ★ Auth Service: Calling getUser API');
    console.log('Orionis ★ Full URL:', url);
    
    const headers = buildAuthHeader(accessToken);
    const response = await connector.get(url, { headers });
    
    console.log('Orionis ★ Auth Service: Response received:', response);
    
    return response;
  },

  /**
   * Get user statistics
   * @param {string} startAt - Start date (ISO format)
   * @param {string} finishAt - Finish date (ISO format)
   * @returns {Promise<Object>} User statistics
   */
  async getUserStat(startAt, finishAt) {
    const query = buildQueryString({ startAt, finishAt });
    const headers = buildAuthHeader(accessToken);
    return await connector.get(`${BASE_URL}/user/stat${query}`, { headers });
  },

  /**
   * Get user status
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User status
   */
  async getUserStatus(userId) {
    const query = buildQueryString({ userId });
    const headers = buildAuthHeader(accessToken);
    return await connector.get(`${BASE_URL}/user/status${query}`, { headers });
  },

  /**
   * Get user(s)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} User(s) data
   */
  async getUsers(params = {}) {
    const query = buildQueryString(params);
    const headers = buildAuthHeader(accessToken);
    return await connector.get(`${BASE_URL}/user${query}`, { headers });
  },

  /* ==================== User Availability Checks ==================== */

  /**
   * Check if email is available
   * @param {string} email - Email to check
   * @returns {Promise<Object>} Availability response
   */
  async checkEmailAvailable(email) {
    const query = buildQueryString({ email });
    return await connector.get(`${BASE_URL}/user/email/available${query}`);
  },

  /**
   * Check if username is available
   * @param {string} username - Username to check
   * @returns {Promise<Object>} Availability response
   */
  async checkUsernameAvailable(username) {
    const query = buildQueryString({ username });
    return await connector.get(`${BASE_URL}/user/username/available${query}`);
  },

  /**
   * Check if passcode is available/valid
   * @param {string} passcode - Passcode to check
   * @returns {Promise<Object>} Availability response
   */
  async checkKeyAvailable(passcode) {
    const query = buildQueryString({ passcode });
    const headers = buildAuthHeader(accessToken);
    return await connector.get(`${BASE_URL}/user/key/available${query}`, { headers });
  },

  /* ==================== User Registration ==================== */

  /**
   * Register new user
   * @param {string} newEmail - Email
   * @param {string} newPassword - Password
   * @returns {Promise<Object>} Registration response with tokens
   */
  async register(newEmail, newPassword) {
    return await connector.post(`${BASE_URL}/user/register`, { newEmail, newPassword });
  },

  /**
   * Complete user registration (send confirmation code)
   * @param {string} newEmail - Email
   * @param {string} languageCode - Language code
   * @returns {Promise<Object>} Response
   */
  async registerComplete(newEmail, languageCode = 'en') {
    const query = buildQueryString({ newEmail, language: languageCode });
    const headers = buildHeaders(languageCode);
    return await connector.get(`${BASE_URL}/user/register/complete${query}`, { headers });
  },

  /**
   * Activate user status (complete registration with passcode)
   * @param {string} email - Email
   * @param {string} passcode - Confirmation code
   * @param {string} languageCode - Language code
   * @returns {Promise<Object>} Response
   */
  async activateUser(email, passcode, languageCode = 'en') {
    const headers = buildHeaders(languageCode);
    return await connector.put(`${BASE_URL}/user/status/activated`, 
      { email, passcode, language: languageCode }, 
      { headers }
    );
  },

  /* ==================== User Creation (Admin) ==================== */

  /**
   * Insert new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Response with tokens
   */
  async insertUser(userData) {
    const headers = buildAuthHeader(accessToken);
    return await connector.post(`${BASE_URL}/user`, userData, { headers });
  },

  /* ==================== User Updates ==================== */

  /**
   * Update user data
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Update response
   */
  async updateUser(userData) {
    const headers = buildAuthHeader(accessToken);
    return await connector.put(`${BASE_URL}/user`, userData, { headers });
  },

  /**
   * Update user email
   * @param {Object} data - { email, newEmail, passcode, language }
   * @returns {Promise<Object>} Update response
   */
  async updateUserEmail(data) {
    const headers = buildHeaders(data.language, accessToken);
    return await connector.put(`${BASE_URL}/user/email`, data, { headers });
  },

  /**
   * Update user birthyear
   * @param {Object} data - { birthYear, userId (admin) }
   * @returns {Promise<Object>} Update response
   */
  async updateUserBirthYear(data) {
    const headers = buildAuthHeader(accessToken);
    return await connector.put(`${BASE_URL}/user/birthyear`, data, { headers });
  },

  /**
   * Update user gender
   * @param {Object} data - { gender, userId (admin) }
   * @returns {Promise<Object>} Update response
   */
  async updateUserGender(data) {
    const headers = buildAuthHeader(accessToken);
    return await connector.put(`${BASE_URL}/user/gender`, data, { headers });
  },

  /**
   * Update user password
   * @param {Object} data - { password, newPassword, language, userId (admin) }
   * @returns {Promise<Object>} Update response
   */
  async updateUserPassword(data) {
    const headers = buildHeaders(data.language, accessToken);
    return await connector.put(`${BASE_URL}/user/password`, data, { headers });
  },

  /**
   * Update user username
   * @param {Object} data - { newUsername, userId (admin) }
   * @returns {Promise<Object>} Update response
   */
  async updateUserUsername(data) {
    const headers = buildAuthHeader(accessToken);
    return await connector.put(`${BASE_URL}/user/username`, data, { headers });
  },

  /**
   * Update user picture
   * @param {Object} data - { picture (base64), type, userId (admin) }
   * @returns {Promise<Object>} Update response
   */
  async updateUserPicture(data) {
    const headers = buildAuthHeader(accessToken);
    return await connector.put(`${BASE_URL}/user/picture`, data, { headers });
  },

  /**
   * Update user status
   * @param {Object} data - { status, passcode, language, userId (admin) }
   * @returns {Promise<Object>} Update response
   */
  async updateUserStatus(data) {
    const headers = buildHeaders(data.language, accessToken);
    return await connector.put(`${BASE_URL}/user/status`, data, { headers });
  },

  /**
   * Update user option
   * @param {Object} data - { name, value, type }
   * @returns {Promise<Object>} Update response
   */
  async updateUserOption(data) {
    const headers = buildAuthHeader(accessToken);
    return await connector.put(`${BASE_URL}/user/option`, data, { headers });
  },

  /* ==================== User Picture ==================== */

  /**
   * Get user picture
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Picture data
   */
  async getUserPicture(userId) {
    const query = buildQueryString({ userId });
    return await connector.get(`${BASE_URL}/user/picture${query}`);
  },

  /**
   * Delete user picture
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteUserPicture(userId) {
    const headers = buildAuthHeader(accessToken);
    return await connector.ajax({
      url: `${BASE_URL}/user/picture`,
      method: 'DELETE',
      data: { userId },
      headers,
    });
  },

  /* ==================== Email Confirmation ==================== */

  /**
   * Request email confirmation code
   * @param {string} newEmail - New email
   * @param {string} languageCode - Language code
   * @returns {Promise<Object>} Response
   */
  async requestEmailConfirm(newEmail, languageCode = 'en') {
    const query = buildQueryString({ newEmail, language: languageCode });
    const headers = buildHeaders(languageCode, accessToken);
    return await connector.get(`${BASE_URL}/user/email/confirm${query}`, { headers });
  },

  /**
   * Confirm email with passcode
   * @param {Object} data - { email, newEmail, passcode, language }
   * @returns {Promise<Object>} Response
   */
  async confirmEmail(data) {
    const headers = buildHeaders(data.language);
    return await connector.put(`${BASE_URL}/user/email/confirm`, data, { headers });
  },

  /* ==================== Password Reset ==================== */

  /**
   * Request password reset code
   * @param {string} email - Email
   * @param {string} languageCode - Language code
   * @returns {Promise<Object>} Response
   */
  async requestPasswordReset(email, languageCode = 'en') {
    const query = buildQueryString({ email, language: languageCode });
    const headers = buildHeaders(languageCode);
    return await connector.get(`${BASE_URL}/user/password/reset${query}`, { headers });
  },

  /**
   * Reset password with passcode
   * @param {Object} data - { email, newPassword, passcode, language }
   * @returns {Promise<Object>} Response
   */
  async resetPassword(data) {
    const headers = buildHeaders(data.language);
    return await connector.put(`${BASE_URL}/user/password/reset`, data, { headers });
  },

  /* ==================== Account Deletion ==================== */

  /**
   * Request account deletion code
   * @param {string} languageCode - Language code
   * @returns {Promise<Object>} Response
   */
  async requestAccountDelete(languageCode = 'en') {
    const query = buildQueryString({ language: languageCode });
    const headers = buildHeaders(languageCode, accessToken);
    return await connector.get(`${BASE_URL}/user/account/delete${query}`, { headers });
  },

  /**
   * Delete user
   * @param {Object} data - { passcode, language } or { userId } (admin)
   * @returns {Promise<Object>} Delete response
   */
  async deleteUser(data) {
    const headers = buildHeaders(data.language, accessToken);
    return await connector.ajax({
      url: `${BASE_URL}/user`,
      method: 'DELETE',
      data,
      headers,
    });
  },

};