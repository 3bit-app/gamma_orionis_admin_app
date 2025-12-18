/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * Configuration v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

/**
 * Environment configurations
 */
const ENVIRONMENTS = {
  development: {
    name: 'development',
    apiBaseUrl: 'https://3bit.app/service',  // Development API
    debug: true,
  },
  staging: {
    name: 'staging',
    apiBaseUrl: 'https://stag.3bit.app/service',  // Staging API
    debug: true,
  },
  production: {
    name: 'production',
    apiBaseUrl: 'https://prod.3bit.app/service',  // Production API
    debug: false,
  },
};

/**
 * Determine current environment
 * Priority: URL param > localStorage > hostname detection > default
 */
function detectEnvironment() {
  // 1. Check URL parameter (?env=staging)
  const urlParams = new URLSearchParams(window.location.search);
  const envParam = urlParams.get('env');
  if (envParam && ENVIRONMENTS[envParam]) {
    return envParam;
  }

  // 2. Check localStorage (for persistent override)
  const storedEnv = localStorage.getItem('app_environment');
  if (storedEnv && ENVIRONMENTS[storedEnv]) {
    return storedEnv;
  }

  // 3. Auto-detect from hostname
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  if (hostname.includes('stag') || hostname.includes('staging')) {
    return 'staging';
  }
  
  // 4. Default to production
  return 'production';
}

/**
 * Get current environment name
 * @returns {string} Environment name
 */
export function getEnvironment() {
  return detectEnvironment();
}

/**
 * Get current environment configuration
 * @returns {Object} Environment config
 */
export function getConfig() {
  const env = detectEnvironment();
  return ENVIRONMENTS[env];
}

/**
 * Get API base URL for current environment
 * @returns {string} API base URL
 */
export function getApiBaseUrl() {
  return getConfig().apiBaseUrl;
}

/**
 * Check if debug mode is enabled
 * @returns {boolean} Debug mode status
 */
export function isDebugMode() {
  return getConfig().debug;
}

/**
 * Set environment manually (saved to localStorage)
 * @param {string} env - Environment name (development, staging, production)
 */
export function setEnvironment(env) {
  if (!ENVIRONMENTS[env]) {
    console.error(`Invalid environment: ${env}. Valid options:`, Object.keys(ENVIRONMENTS));
    return;
  }
  
  localStorage.setItem('app_environment', env);
  console.log(`Environment set to: ${env}. Reload the page to apply changes.`);
}

/**
 * Clear environment override
 */
export function clearEnvironment() {
  localStorage.removeItem('app_environment');
  console.log('Environment override cleared. Reload the page to auto-detect.');
}

// Log current environment on load
const currentEnv = getConfig();
console.log(`Orionis ★ Environment: ${currentEnv.name}`);
console.log(`Orionis ★ API Base URL: ${currentEnv.apiBaseUrl}`);
console.log(`Orionis ★ Debug Mode: ${currentEnv.debug}`);

// Expose environment utilities to window for debugging
window.appConfig = {
  getEnvironment,
  getConfig,
  setEnvironment,
  clearEnvironment,
  getApiBaseUrl,
  isDebugMode,
};
