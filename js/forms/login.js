/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * Login v.1.0.0
 * 3bit.app | 2025
 */

/*
import { getMainService, getSignInService } from "../services/service_auth.js";
import { getMessage, getLanguageCode } from "../messages.js";
import {
  setCookie, getCookie, encodeData, clearAuth, clearAuthCookie
} from "../functions.js";
*/
export function initLoginForm() {

  const form = document.querySelector("#login_form");
  const btnApple = document.querySelector("#button_login_with_apple");
  const btnGoogle = document.querySelector("#button_login_with_google");
  const btnCloseError = document.querySelector('[data-close="error"]');
  const btnCloseSuccess = document.querySelector('[data-close="success"]');

  // ---------------- EVENTS ---------------- //

  //form.addEventListener("submit", onLoginSubmit);
  //btnApple.addEventListener("click", loginWithApple);
  //btnGoogle.addEventListener("click", loginWithGoogle);

  //btnCloseError.addEventListener("click", () => hide("#div_error_message"));
  //btnCloseSuccess.addEventListener("click", () => hide("#div_success_message"));

  //loadSavedCredentials();
  //updateLanguage(getLanguageCode());
}
/*
function onLoginSubmit(event) {
  event.preventDefault();

  const username = value("#input_username");
  const password = value("#input_password");
  const accessKey = value("#input_access_key");

  if (!username && !accessKey) return error("Enter username or access key");
  if (!password && !accessKey) return error("Enter password");

  clearAuth();
  clearAuthCookie();

  const service = getMainService();

  if (username) {
      service.setUsername(username);
      service.setPassword(password);
      service.getUserLogin(null, "#text_error_message", afterLogin);
  }
  else if (accessKey) {
      service.setAccessKey(accessKey);
      // service.getUserLoginByAccessKey(...)
  }
}

function afterLogin(_, res) {
  if (!res || res.status !== "success") return;

  const s = getMainService();
  const t = res.results[0];

  s.setAccessToken(t.accessToken);
  s.setUpdateToken(t.updateToken);

  setCookie("ACCESS_TOKEN", t.accessToken, 30);
  setCookie("UPDATE_TOKEN", t.updateToken, 30);

  window.dispatchEvent(new Event("ajaxStop")); // simulate old jQuery ajaxStop
}

function loadSavedCredentials() {
  const save = getCookie("SAVE_ME") === "true";
  value("#input_save_me", save);

  if (!save) return;

  value("#input_username", getCookie("USERNAME"));
  value("#input_password", encodeData(getCookie("USERNAME"), getCookie("PASSWORD")));
  value("#input_access_key", getCookie("ACCESS_KEY"));
}

function loginWithApple() {
  const s = getSignInService();
  s.setSignInProvider("APPLE");
  s.initService();
  s.signInWithPopup("#text_error_message", afterLogin);
}

function loginWithGoogle() {
  const s = getSignInService();
  s.setSignInProvider("GOOGLE");
  s.initService();
  s.signInWithPopup("#text_error_message", afterLogin);
}

// ---------------- UTIL ---------------- //

function value(selector, set) {
  const el = document.querySelector(selector);
  if (!el) return "";
  if (set !== undefined) el.value = set;
  return el.value.trim();
}

function error(msg) {
  document.querySelector("#text_error_message").textContent = msg;
  show("#div_error_message");
}

function show(sel) {
  document.querySelector(sel).style.display = "block";
}

function hide(sel) {
  document.querySelector(sel).style.display = "none";
}

function updateLanguage(lang) {
  document.querySelector("#text_login").textContent = getMessage(lang, 1051);
}
*/