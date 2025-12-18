# Gamma Orionis ★ (Bellātrix) Admin Application

> **Bellātrix** - The White Blue Giant, The Lion Warrior, Conqueror  
> **Amon Ra Eye** - Administrative Application v1.0.0

A modern, lightweight administrative web application built with vanilla JavaScript (ESM), providing a complete authentication system and API integration with the 3bit.app service platform.

## 🌟 Features

- **Pure Vanilla JavaScript** - No frameworks, just modern ES6+ modules
- **Complete Authentication System** - Login, registration, password recovery
- **Environment Management** - Auto-detection for dev/staging/production
- **API Integration** - Full Auth Service API with 40+ endpoints
- **Token Management** - Automatic token handling and refresh
- **Responsive UI** - Bootstrap 5.3.3 based interface
- **Internationalization** - Multi-language support with lazy loading
- **Error Handling** - Comprehensive error messages and validation
- **State Management** - Cookie-based persistence and localStorage

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites

- Python 3.x (for local development server)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/3bit-app/gamma_orionis_admin_app.git
   cd gamma_orionis_admin_app
   ```

2. **Start local development server**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### First Login

Use the following test credentials:
- **Username:** `customer`
- **Password:** `bela_customer`

## 📁 Project Structure

```
gamma_orionis_admin_app/
├── index.html              # Application entry point
├── css/
│   ├── app.css            # Main application styles
│   └── styles.css         # Custom component styles
├── js/
│   ├── app.js             # Application controller
│   ├── config.js          # Environment configuration
│   ├── connector.js       # AJAX/Fetch wrapper with queue
│   ├── functions.js       # Utility functions
│   ├── i18n_messages.js   # Internationalization system
│   ├── api_constants.js   # API error codes and constants
│   ├── api_utils.js       # API response helpers
│   ├── auth_helpers.js    # Authentication utilities
│   ├── services/
│   │   ├── service_auth.js      # Auth Service API (40+ endpoints)
│   │   ├── service_analytic.js  # Analytics API
│   │   ├── service_market.js    # Market/Store API
│   │   └── service_support.js   # Support/Help API
│   └── forms/
│       └── login.js       # Login form logic
├── html/
│   ├── auth/
│   │   ├── login.html     # Login form
│   │   └── register.html  # Registration form
│   └── forms/
│       └── dashboard.html # Main dashboard
├── data/
│   └── json/
│       └── languages.json # Language definitions
├── API_IMPLEMENTATION.md  # API integration guide
├── ENVIRONMENT.md         # Environment setup guide
└── README.md             # This file
```

## ⚙️ Configuration

### Environment Setup

The application supports three environments:

- **Development:** `https://3bit.app/service`
- **Staging:** `https://stag.3bit.app/service`
- **Production:** `https://prod.3bit.app/service`

Environment is auto-detected based on:
1. URL parameter: `?env=staging`
2. LocalStorage override
3. Hostname detection
4. Default to production

**Manual Configuration:**

```javascript
// In browser console
appConfig.setEnvironment('staging');  // Switch to staging
appConfig.getEnvironment();           // Check current environment
appConfig.getApiBaseUrl();            // Get current API URL
```

See [ENVIRONMENT.md](ENVIRONMENT.md) for detailed configuration guide.

## 🔌 API Documentation

### Authentication Service

The application integrates with the 3bit.app Auth Service API:

**Base URL:** `https://3bit.app/service/auth/v1`

**Available Endpoints:**

- **Authentication**
  - `POST /user/login` - User login
  - `GET /user/logout` - User logout
  - `GET /user/token` - Refresh access token
  - `POST /user/with/google` - Google Sign-In

- **User Management**
  - `GET /user/me` - Get current user
  - `GET /user` - Get user(s) (admin)
  - `POST /user` - Create user (admin)
  - `PUT /user` - Update user
  - `DELETE /user` - Delete user

- **Registration**
  - `POST /user/register` - Register new user
  - `GET /user/register/complete` - Complete registration
  - `PUT /user/status/activated` - Activate user

- **Validation**
  - `GET /user/email/available` - Check email availability
  - `GET /user/username/available` - Check username availability

- **Password Management**
  - `GET /user/password/reset` - Request password reset
  - `PUT /user/password/reset` - Reset password
  - `PUT /user/password` - Update password

See [API_IMPLEMENTATION.md](API_IMPLEMENTATION.md) for complete API documentation.

### Usage Example

```javascript
import { authService } from './services/service_auth.js';
import { extractAuthTokens, isErrorResponse } from './auth_helpers.js';

// Login
const response = await authService.login('username', 'password');

if (!isErrorResponse(response)) {
  const tokens = extractAuthTokens(response);
  console.log('Access Token:', tokens.accessToken);
  
  // Get user info
  authService.setAccessToken(tokens.accessToken);
  const user = await authService.getUser();
}
```

## 🛠 Development

### Running Locally

1. **Start development server**
   ```bash
   python3 -m http.server 8000
   ```

2. **Open browser with dev environment**
   ```
   http://localhost:8000/?env=development
   ```

3. **Open DevTools console** to see debug logs

### Adding New Features

1. Create new service in `js/services/`
2. Add endpoint methods following existing patterns
3. Import and use in `js/app.js`
4. Update this README

### Code Style

- ES6+ modules (import/export)
- Async/await for asynchronous operations
- JSDoc comments for functions
- Consistent naming: camelCase for variables/functions
- Console logging: `console.log('Orionis ★ Message')`

### Testing

Test credentials for development:
- Username: `customer`
- Password: `bela_customer`

## 🚢 Deployment

### Build for Production

No build step required! This is a static application.

### Deploy to Web Server

1. **Copy files to web server**
   ```bash
   rsync -av --exclude='.git' . user@server:/var/www/html/
   ```

2. **Configure web server** (Apache/Nginx)
   - Serve `index.html` for all routes
   - Enable CORS if needed
   - Use HTTPS in production

3. **Set environment**
   - Production: Auto-detected from domain
   - Or use `?env=production` parameter

### Environment Variables

Edit `js/config.js` to set production API URLs:

```javascript
production: {
  name: 'production',
  apiBaseUrl: 'https://prod.3bit.app/service',
  debug: false,
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Coding Standards

- Use ESLint for code linting
- Follow existing code style
- Add JSDoc comments
- Test thoroughly before submitting

## 📝 License

Copyright © 2025 3bit.app

All rights reserved.

## 🔗 Links

- **GitHub:** [3bit-app/gamma_orionis_admin_app](https://github.com/3bit-app/gamma_orionis_admin_app)
- **API Documentation:** [3bit.app](https://3bit.app)
- **Support:** [3bit.app/support](https://3bit.app/support)

## 👥 Authors

- **3bit.app Team** - *Initial work*

## 🙏 Acknowledgments

- Bootstrap 5.3.3 for UI components
- Moment.js for datetime handling
- Font Awesome for icons
- Google Fonts for typography

---

**Built with ⭐ by 3bit.app**

*Gamma Orionis (Bellātrix) - The White Blue Giant, illuminating the path forward.*
