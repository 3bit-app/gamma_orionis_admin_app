/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * app v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

import { connector } from './connector.js';
import { generateUUID } from './functions.js';
import { getParam, getValueFromOneOfParam, getCookie, setCookie } from './functions.js';
import { i18n } from "./i18n_messages.js";

import { authService } from './services/service_auth.js';
import { analyticService } from './services/service_analytic.js';
import { marketService } from './services/service_market.js';
import { supportService } from './services/service_support.js';

import { initLoginForm } from "./forms/login.js";
import { extractAuthTokens, extractUserData, isUserActivated, isAuthError, isUserStatusError } from './auth_helpers.js';
import { isErrorResponse, getErrorMessage } from './api_utils.js';

// Cookies
const COOKIE_ACTUAL_DAYS = 365;
const COOKIE_MAP_PROVIDER = "MapProvider";
const COOKIE_LANGUAGE_CODE = "LanguageCode";
const COOKIE_LANGUAGE_LOCALE = "LanguageLocale";
const COOKIE_ACCESS_TOKEN = "AccessToken"; // encodeData(accessToken, username);
const COOKIE_UPDATE_TOKEN = "UpdateToken"; // encodeData(updateToken, username);
const COOKIE_ACCESS_KEY = "AccessKey";
const COOKIE_USERNAME = "Username";
const COOKIE_PASSWORD = "Password"; // encodeData(password, username);
const COOKIE_TIMEZONE_OFFSET = "TimezoneOffset";
const COOKIE_DST_OFFSET = "DSTOffset";
const COOKIE_SAVE_ME = "SaveMe";
const COOKIE_PAGE_NAME = "PageName";

// Defaults
const DEFAULT_DATETIME_PICKER_FORMAT = "DD/MM/YYYY hh:mm A"; /* datetime picker default format https://getdatepicker.com */
const DEFAULT_DATE_FORMAT = "DD.MM.YYYY";
const DEFAULT_SEC_FORMAT = "ss";
const DEFAULT_HOUR_MIN_FORMAT = "HH:mm";
const DEFAULT_HOUR_MIN_SEC_FORMAT = "HH:mm:ss";
const DEFAULT_TIME_FORMAT = DEFAULT_HOUR_MIN_FORMAT;
const DEFAULT_DATETIME_FORMAT = DEFAULT_DATE_FORMAT + " " + DEFAULT_HOUR_MIN_FORMAT;
const DEFAULT_DATETIME_WITH_SEC_FORMAT = DEFAULT_DATETIME_FORMAT + " " + DEFAULT_HOUR_MIN_SEC_FORMAT;
const DEFAULT_TIMEZONE_OFFSET = "+00:00";
const DEFAULT_DST_OFFSET = "0";
const DEFAULT_LANGUAGE_CODE = "en";
const DEFAULT_LANGUAGE_LOCALE = "en-US";

// Resources
const MESSAGES_FILEPATH = "json/messages.json";
const COUNTRY_PHONE_CODES_FILEPATH = "json/country_phone_codes.json";
const DATA_JSON_PATH = "data/json/";
const HTML_PATH = "html/";
const HTML_ADMIN_PATH = "html/admin/";
const HTML_AUTH_PATH = "html/auth/";
const HTML_FORM_PATH = "html/form/";

// Http request args: p-starting page name, l-language name of interface m-map provider name
const requestPageName = getValueFromOneOfParam("p", "page");
const requestLanguageCode = getValueFromOneOfParam("l", "language");
const requestMapProvider = getValueFromOneOfParam("m", "map");
const requestUsername = getParam("username");
const requestPassword = getParam("password");
const requestAccessToken = getParam("token");
const requestUpdateToken = getParam("update");
const requestAccessKey = getParam("key");

// Current
// currentHostname = window.location.protocol + "//" + window.location.host + window.location.port;
let currentHostname = (window.location.href.split("/admin/"))[0];
let currentPathname = ""; //window.location.pathname;
let currentHostpath = "";
let currentPageName = null;
let currentLanguageCode = null;
let currentMapProvider = null;
let currentUsername = null;
let currentPassword = null;
let currentAccessToken = null;
let currentUpdateToken = null;
let currentAccessKey = null;
let currentUser = null;

let contentId = "#div_content";
let sessionId = generateUUID();

// Application
export const app = {

  async init() {

    // Language messages
    //await i18n.loadFiles([ DATA_JSON_PATH + "language_en.json", DATA_JSON_PATH + "language_ru.json", DATA_JSON_PATH + "language_ua.json" ]);
    const lazyFilesPath = DATA_JSON_PATH; 
    const defFile = DATA_JSON_PATH + "languages.json";
    const languagesDef = await i18n.loadFile(defFile);
    if (languagesDef) {
      i18n.setLazyFilesPath(lazyFilesPath);
      i18n.registerLanguages(languagesDef);
    }

    // Services API
    // |-> Initialize services

    let username = requestUsername ? requestUsername : getCookie(COOKIE_USERNAME);
    let password = requestPassword ? requestPassword : getCookie(COOKIE_PASSWORD);
    let accessToken = requestAccessToken ? requestAccessToken : getCookie(COOKIE_ACCESS_TOKEN);
    let pageName = requestPageName ? requestPageName : getCookie(COOKIE_PAGE_NAME);

    if (accessToken) {

      authService.setAccessToken(accessToken);
      const userResponse = await authService.getUser();

      if (isErrorResponse(userResponse)) {
        console.warn('Orionis ★ Failed to get user:', getErrorMessage(userResponse));
        this.clearCookies();
        this.gotoLogin();
      } else {
        currentUser = extractUserData(userResponse);
        
        if (!isUserActivated(currentUser)) {
          console.warn('Orionis ★ User not activated');
          this.gotoLogin();
        } else {
          if (pageName) this.gotoPage(pageName); else this.gotoHome();
        }
      }

    } else if (username && password) {

      const loginResponse = await authService.login(username, password);

      if (isErrorResponse(loginResponse)) {
        console.warn('Orionis ★ Login failed:', getErrorMessage(loginResponse));
        this.gotoLogin();
      } else {
        const tokens = extractAuthTokens(loginResponse);
        
        if (tokens?.accessToken) {
          authService.setAccessToken(tokens.accessToken);
          authService.setUpdateToken(tokens.updateToken);
          
          // Save tokens to cookies
          setCookie(COOKIE_ACCESS_TOKEN, tokens.accessToken, COOKIE_ACTUAL_DAYS);
          if (tokens.updateToken) {
            setCookie(COOKIE_UPDATE_TOKEN, tokens.updateToken, COOKIE_ACTUAL_DAYS);
          }
          
          const userResponse = await authService.getUser();
          
          if (!isErrorResponse(userResponse)) {
            currentUser = extractUserData(userResponse);
            if (pageName) this.gotoPage(pageName); else this.gotoHome();
          } else {
            this.gotoLogin();
          }
        } else {
          this.gotoLogin();
        }
      }

    } else {

      this.gotoLogin();
    }

    console.log(`Orionis ★ App initialization with SessionId: ${sessionId}`);

  },

  async postInit() {

    console.log('Orionis ★ Post initialization');

  },

  gotoHome() {
    currentPageName = "home";
    connector.loadContent(currentPathname + HTML_PATH + currentPageName + ".html", contentId, null);
  },

  gotoLogin() {
    currentPageName = "login";
    connector.loadContent(currentPathname + HTML_AUTH_PATH + currentPageName + ".html", contentId, null);
    initLoginForm();    
  },

  gotoRegister() {
    currentPageName = "register";
    connector.loadContent(currentPathname + HTML_AUTH_PATH + currentPageName + ".html", contentId, null);
  },

  gotoCabinet() {
    currentPageName = "cabinet";
    connector.loadContent(currentPathname + HTML_FORM_PATH + currentPageName + ".html", contentId, null);
  },

  gotoCalendar() {
    currentPageName = "calendar";
    connector.loadContent(currentPathname + HTML_FORM_PATH + currentPageName +  ".html", contentId, null);
  },

  gotoMap() {
    currentPageName = "map";
    connector.loadContent(currentPathname + HTML_FORM_PATH + currentPageName + ".html", contentId, null);
  },

  gotoAdmin() {
    currentPageName = "admin";
    connector.loadContent(currentPathname + HTML_ADMIN_PATH + currentPageName + ".html", contentId, null);
  },

  gotoPage(pageName) {
    currentPageName = pageName;
    connector.loadContent(currentPathname + HTML_ADMIN_PATH + currentPageName + ".html", contentId, null);
  },

  clearCurrentParameters() {
    currentPageName = null;
    currentLanguageCode = null;
    currentMapProvider = null;
    currentUsername = null;
    currentPassword = null;
    currentAccessToken = null;
    currentUpdateToken = null;
    currentAccessKey = null;
    currentUser = null;
  },

  clearCookies() {
    setCookie(COOKIE_USERNAME, "", 0);
    setCookie(COOKIE_PASSWORD, "", 0);
    setCookie(COOKIE_ACCESS_TOKEN, "", 0);
    setCookie(COOKIE_UPDATE_TOKEN, "", 0);
    setCookie(COOKIE_ACCESS_KEY, "", 0);
    setCookie(COOKIE_SAVE_ME, "", 0);
  },

  // Get current user
  getCurrentUser() {
    return currentUser;
  },

  // Set current user
  setCurrentUser(user) {
    currentUser = user;
  },

  // Logout
  async logout() {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Orionis ★ Logout request failed:', e);
    }
    
    this.clearCurrentParameters();
    this.clearCookies();
    authService.clearTokens();
    this.gotoLogin();
  },

  // Check authentication status
  isAuthenticated() {
    return currentUser !== null && authService.getAccessToken() !== null;
  },

  // i18n → ( <div id="language-switcher"></div> ) + app.initLanguageSwitcher("#language-switcher");
  // Language switcher UI
  initLanguageSwitcher(containerSelector = "#language-switcher", autoUpdate = false) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const select = document.createElement("select");
    select.style.padding = "6px 10px";
    select.style.borderRadius = "6px";
    select.style.fontSize = "14px";
    select.style.border = "1px solid #aaa";
    select.style.cursor = "pointer";

    // Languages list
    for (const language of i18n.getLanguages()) {
      const opt = document.createElement("option");
      opt.value = language.code;
      opt.textContent = language.label || language.name;
      if (language.code === i18n.currentLanguage) opt.selected = true;
      select.appendChild(opt);
    }

    select.addEventListener("change", () => {
      i18n.setLanguage(select.value);
      updateTranslatedText();
    });

    container.appendChild(select);

    // UI update on language change
    i18n.onLanguageChange((languageCode) => {
      select.value = languageCode;
      updateTranslatedText();
    });

    // MutationObserver auto update
    if (autoUpdate) i18n.enableAutoDOMTranslate(updateTranslatedText);    

    // UI first view
    updateTranslatedText();
  },

  // Update translated text in document:
  // <h1 data-i18n="hello"></h1>
  // <input data-i18n-placeholder="enter_name">
  // <img data-i18n-alt="logo_alt">
  // <button data-i18n-value="save_btn"></button>
  // <p title="" data-i18n-title="tooltip_info"></p>
  updateTranslatedText() {
    // text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = i18n.getMessage(el.dataset.i18n);
    });

    // placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = i18n.getMessage(el.dataset.i18nPlaceholder);
    });

    // title
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      el.title = i18n.getMessage(el.dataset.i18nTitle);
    });

    // value
    document.querySelectorAll("[data-i18n-value]").forEach(el => {
      el.value = i18n.getMessage(el.dataset.i18nValue);
    });

    // alt
    document.querySelectorAll("[data-i18n-alt]").forEach(el => {
      el.alt = i18n.getMessage(el.dataset.i18nAlt);
    });
  },

};

window.app = app;
