# Environment Configuration

## Overview

The application supports multiple environments with different API endpoints:
- **Development**: `http://localhost:8080`
- **Staging**: `https://stag.3bit.app`
- **Production**: `https://3bit.app`

## Auto-Detection

Environment is automatically detected based on:

1. **URL Parameter** (highest priority)
   ```
   http://localhost:8000/?env=staging
   http://localhost:8000/?env=production
   http://localhost:8000/?env=development
   ```

2. **LocalStorage** (persistent override)
   ```javascript
   appConfig.setEnvironment('staging');
   ```

3. **Hostname Detection**
   - `localhost` or `127.0.0.1` → development
   - Hostname contains `stag` or `staging` → staging
   - All other cases → production

4. **Default**: Production

## Manual Configuration

### In Browser Console

```javascript
// View current environment
appConfig.getEnvironment();  // Returns: 'production', 'staging', or 'development'

// View full config
appConfig.getConfig();
// Returns: { name: 'production', apiBaseUrl: 'https://3bit.app', debug: false }

// Get API base URL
appConfig.getApiBaseUrl();  // Returns: 'https://3bit.app'

// Check debug mode
appConfig.isDebugMode();  // Returns: true/false

// Set environment (requires page reload)
appConfig.setEnvironment('staging');

// Clear environment override
appConfig.clearEnvironment();
```

### Via URL Parameter

Open the application with the `env` parameter:
```
http://localhost:8000/?env=staging
http://localhost:8000/?env=development
```

### Persistent Override

To permanently set the environment for testing:
```javascript
// Set to staging
localStorage.setItem('app_environment', 'staging');

// Set to development
localStorage.setItem('app_environment', 'development');

// Clear override
localStorage.removeItem('app_environment');
```

Then reload the page.

## Adding New Environments

Edit `js/config.js` and add new environment:

```javascript
const ENVIRONMENTS = {
  development: {
    name: 'development',
    apiBaseUrl: 'http://localhost:8080',
    debug: true,
  },
  staging: {
    name: 'staging',
    apiBaseUrl: 'https://stag.3bit.app',
    debug: true,
  },
  production: {
    name: 'production',
    apiBaseUrl: 'https://3bit.app',
    debug: false,
  },
  // Add new environment
  testing: {
    name: 'testing',
    apiBaseUrl: 'https://test.3bit.app',
    debug: true,
  },
};
```

## Environment-Specific Features

The configuration also controls:
- **Debug Mode**: Enables/disables verbose logging
- **API Base URL**: Different API endpoints per environment

Add more environment-specific settings in `config.js` as needed:
```javascript
{
  name: 'production',
  apiBaseUrl: 'https://3bit.app',
  debug: false,
  // Add custom settings
  enableAnalytics: true,
  logLevel: 'error',
  cacheDuration: 3600,
}
```

## Troubleshooting

If the wrong environment is detected:
1. Check URL parameter: `?env=...`
2. Check localStorage: `localStorage.getItem('app_environment')`
3. Check hostname detection logic in `config.js`
4. Use `appConfig.getConfig()` to see current settings
