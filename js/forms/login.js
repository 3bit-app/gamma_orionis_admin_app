/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * Login v.1.0.0
 * 3bit.app | 2025
 */

import { authService } from '../services/service_auth.js';
import { connector } from '../connector.js';
import { getCookie, setCookie, encodeData } from '../functions.js';
import { extractAuthTokens, extractUserData, validateEmail } from '../auth_helpers.js';
import { isErrorResponse, getErrorMessage } from '../api_utils.js';

const COOKIE_ACTUAL_DAYS = 365;
const COOKIE_USERNAME = "Username";
const COOKIE_PASSWORD = "Password";
const COOKIE_ACCESS_TOKEN = "AccessToken";
const COOKIE_UPDATE_TOKEN = "UpdateToken";
const COOKIE_SAVE_ME = "SaveMe";

export function initLoginForm() {
  console.log('Orionis ★ Initializing login form - START');
  
  // Wait for form to be in DOM
  const checkFormReady = () => {
    const form = document.querySelector("#login_form");
    
    if (form) {
      console.log('Orionis ★ Form found in DOM, proceeding with initialization');
      
      // Expose functions to app.content first
      if (window.app) {
        window.app.content = window.app.content || {};
        window.app.content.userLogin = handleLogin;
        window.app.content.loginWithGoogle = handleLoginWithGoogle;
        window.app.content.loginWithApple = handleLoginWithApple;
        window.app.content.passwordRecovery = handlePasswordRecovery;
        window.app.content.saveMe = handleSaveMeToggle;
        console.log('Orionis ★ app.content functions exposed');
      } else {
        console.error('Orionis ★ window.app is not available!');
      }

      // Load saved credentials if checkbox was checked
      loadSavedCredentials();

      // Setup event listeners
      setupEventListeners();
      
      console.log('Orionis ★ Login form initialization - COMPLETE');
    } else {
      console.warn('Orionis ★ Form not ready yet, retrying...');
      requestAnimationFrame(checkFormReady);
    }
  };
  
  requestAnimationFrame(checkFormReady);
}

function setupEventListeners() {
  console.log('Orionis ★ Setting up event listeners');
  
  // Get form element
  const form = document.querySelector("#login_form");
  console.log('Orionis ★ Form element found:', form);
  
  // Add submit event listener
  if (form) {
    form.addEventListener('submit', async (e) => {
      console.log('Orionis ★ Form submit event triggered!');
      e.preventDefault();
      e.stopPropagation();
      await handleLogin();
      return false;
    });
    console.log('Orionis ★ Form submit listener added');
  } else {
    console.error('Orionis ★ Form #login_form NOT FOUND!');
  }

  // Form fields focus effects
  const inputUsername = document.querySelector("#input_username");
  const inputPassword = document.querySelector("#input_password");
  const inputSaveMe = document.querySelector("#input_save_me");

  console.log('Orionis ★ Input fields:', { username: !!inputUsername, password: !!inputPassword, saveMe: !!inputSaveMe });

  if (inputUsername) {
    inputUsername.addEventListener('focus', () => hideMessages());
    inputUsername.addEventListener('input', validateInputs);
  }

  if (inputPassword) {
    inputPassword.addEventListener('focus', () => hideMessages());
    inputPassword.addEventListener('input', validateInputs);
    
    // Allow Enter key to submit
    inputPassword.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        console.log('Orionis ★ Enter key pressed in password field');
        e.preventDefault();
        handleLogin();
      }
    });
  }

  if (inputSaveMe) {
    inputSaveMe.addEventListener('change', handleSaveMeToggle);
  }

  // Submit button
  const submitBtn = document.querySelector("#button_submit");
  console.log('Orionis ★ Submit button found:', submitBtn);
  
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      console.log('Orionis ★ Submit button clicked!');
      e.preventDefault();
      handleLogin();
    });
    console.log('Orionis ★ Submit button listener added');
  } else {
    console.error('Orionis ★ Submit button #button_submit NOT FOUND!');
  }

  // Close buttons
  const closeErrorBtn = document.querySelector("#div_error_message .white-close-btn");
  const closeSuccessBtn = document.querySelector("#div_success_message .grey-close-btn");

  if (closeErrorBtn) {
    closeErrorBtn.addEventListener('click', () => hideError());
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => hideSuccess());
  }
  
  console.log('Orionis ★ Event listeners setup complete');
}

async function handleLogin() {
  const username = getValue("#input_username");
  const password = getValue("#input_password");

  // Validation
  if (!username) {
    showError('Please enter username or email');
    return false;
  }

  if (!password) {
    showError('Please enter password');
    return false;
  }

  // Show loading state
  setLoginButtonState(true);
  hideMessages();

  try {
    console.log('Orionis ★ Attempting login with username:', username);
    console.log('Orionis ★ API Base URL:', 'https://3bit.app/service/auth/v1');

    // Call login API
    const response = await authService.login(username, password);
    console.log('Orionis ★ Login API response:', response);

    if (isErrorResponse(response)) {
      const errorMsg = getErrorMessage(response);
      console.warn('Orionis ★ Login failed:', errorMsg);
      showError(errorMsg || 'Login failed. Please check your credentials.');
      setLoginButtonState(false);
      return false;
    }

    // Extract tokens
    console.log('Orionis ★ Response.results:', response.results);
    const tokens = extractAuthTokens(response);
    console.log('Orionis ★ Extracted tokens:', tokens);

    if (!tokens?.accessToken) {
      console.error('Orionis ★ No access token in tokens:', tokens);
      showError('Login failed: No access token received');
      setLoginButtonState(false);
      return false;
    }

    console.log('Orionis ★ Login successful');

    // Save credentials if checkbox is checked
    const saveMe = document.querySelector("#input_save_me")?.checked || false;
    if (saveMe) {
      saveCredentials(username, password, tokens);
    } else {
      clearSavedCredentials();
    }

    // Save tokens to cookies
    setCookie(COOKIE_ACCESS_TOKEN, tokens.accessToken, COOKIE_ACTUAL_DAYS);
    if (tokens.updateToken) {
      setCookie(COOKIE_UPDATE_TOKEN, tokens.updateToken, COOKIE_ACTUAL_DAYS);
    }

    // Set tokens in service
    authService.setAccessToken(tokens.accessToken);
    if (tokens.updateToken) {
      authService.setUpdateToken(tokens.updateToken);
    }

    // Get user info
    const userResponse = await authService.getUser();

    if (!isErrorResponse(userResponse)) {
      const user = extractUserData(userResponse);
      window.app.setCurrentUser(user);
      
      showSuccess('Login successful! Redirecting...');

      // Redirect to dashboard after short delay
      setTimeout(() => {
        gotoDashboard();
      }, 800);

      return true;
    } else {
      showError('Failed to load user data');
      setLoginButtonState(false);
      return false;
    }

  } catch (error) {
    console.error('Orionis ★ Login error:', error);
    showError('An error occurred. Please try again.');
    setLoginButtonState(false);
    return false;
  }
}

async function handleLoginWithGoogle() {
  hideMessages();
  showSuccess('Google Sign-In integration coming soon...');
  
  // TODO: Implement Google Sign-In
  // const response = await authService.loginWithGoogle(idToken);
  
  console.log('Orionis ★ Google Sign-In clicked');
}

async function handleLoginWithApple() {
  hideMessages();
  showSuccess('Apple Sign-In integration coming soon...');
  
  // TODO: Implement Apple Sign-In
  
  console.log('Orionis ★ Apple Sign-In clicked');
}

function handlePasswordRecovery() {
  hideMessages();
  showSuccess('Password recovery: Check your email for reset instructions');
  
  // TODO: Navigate to password recovery page
  console.log('Orionis ★ Password recovery clicked');
}

function handleSaveMeToggle(event) {
  const checked = event.target.checked;
  setCookie(COOKIE_SAVE_ME, checked ? "true" : "false", COOKIE_ACTUAL_DAYS);
  console.log('Orionis ★ Save me:', checked);
}

function saveCredentials(username, password, tokens) {
  setCookie(COOKIE_USERNAME, username, COOKIE_ACTUAL_DAYS);
  setCookie(COOKIE_PASSWORD, encodeData(username, password), COOKIE_ACTUAL_DAYS);
  setCookie(COOKIE_SAVE_ME, "true", COOKIE_ACTUAL_DAYS);
  console.log('Orionis ★ Credentials saved');
}

function clearSavedCredentials() {
  setCookie(COOKIE_USERNAME, "", 0);
  setCookie(COOKIE_PASSWORD, "", 0);
  setCookie(COOKIE_SAVE_ME, "false", COOKIE_ACTUAL_DAYS);
}

function loadSavedCredentials() {
  const saveMe = getCookie(COOKIE_SAVE_ME) === "true";
  const saveMeCheckbox = document.querySelector("#input_save_me");
  
  if (saveMeCheckbox) {
    saveMeCheckbox.checked = saveMe;
  }

  if (!saveMe) return;

  const savedUsername = getCookie(COOKIE_USERNAME);
  const savedPassword = getCookie(COOKIE_PASSWORD);

  if (savedUsername) {
    setValue("#input_username", savedUsername);
  }

  if (savedPassword && savedUsername) {
    // Decode password
    const decodedPassword = encodeData(savedUsername, savedPassword);
    setValue("#input_password", decodedPassword);
  }

  console.log('Orionis ★ Loaded saved credentials');
}

function validateInputs() {
  const username = getValue("#input_username");
  const password = getValue("#input_password");
  const submitBtn = document.querySelector("#button_submit");

  // Enable/disable submit button based on input
  if (submitBtn) {
    if (username && password) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('disabled');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('disabled');
    }
  }
}

function setLoginButtonState(loading) {
  const submitBtn = document.querySelector("#button_submit");
  
  if (!submitBtn) return;

  if (loading) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
}

function gotoDashboard() {
  connector.loadContent('html/forms/dashboard.html', '#div_content', null);
}

// UI Helper functions
function getValue(selector) {
  const el = document.querySelector(selector);
  return el ? el.value.trim() : '';
}

function setValue(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.value = value;
}

function showError(message) {
  const errorDiv = document.querySelector("#div_error_message");
  const errorText = document.querySelector("#text_error_message");
  
  if (errorText) errorText.textContent = message;
  if (errorDiv) errorDiv.style.display = 'block';
}

function hideError() {
  const errorDiv = document.querySelector("#div_error_message");
  if (errorDiv) errorDiv.style.display = 'none';
}

function showSuccess(message) {
  const successDiv = document.querySelector("#div_success_message");
  const successText = document.querySelector("#text_success_message");
  
  if (successText) successText.textContent = message;
  if (successDiv) successDiv.style.display = 'block';
}

function hideSuccess() {
  const successDiv = document.querySelector("#div_success_message");
  if (successDiv) successDiv.style.display = 'none';
}

function hideMessages() {
  hideError();
  hideSuccess();
}