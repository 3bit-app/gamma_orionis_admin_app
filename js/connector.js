/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * connector v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

// Queue 5 max parallel requests, 
// retries, refresh token, ajaxStop event, 
// HTML content caching, 
// auto response types (json/text/blob) →

// Examples:
// - ajax(...).then(data => { console.log(data); });
// - Promise.all([ ... ]).then(() => { ... });
// connector.get('/api/data').then(data => { console.log(data); });
// connector.post('/api/data', { key: 'value' }).then(data => { console.log(data); });
// connector.upload('/api/upload', formData).then(data => { console.log(data); });
// connector.loadContent('/html/page.html', '#content', () => { console.log('Loaded'); }, true, '/page');
// connector.setAuth(getTokensFn, refreshFn);
// document.addEventListener("ajaxStop", () => { console.log('All ajax requests completed'); });
// connector.onAjaxStop(() => { console.log('All ajax requests completed'); });
// ------------------------------------------------------------
// let users = await connector.get('/api/users');
// let auth = await connector.post('/api/login', { login: "admin", pass: "1234" });
// Form data upload:
// let fd = new FormData();
// fd.append("avatar", fileInput.files[0]);
// await API.upload('/api/upload', fd);
// Promise.all example:
// let [u, s] = await Promise.all([
//   API.get('/api/users'),
//   API.get('/api/settings')
// ]);
// Ajax examples:
// ajax({ url: '/download', responseType: 'blob' });
// ajax({ url: '/api/xml', method: 'POST', data: '<xml><a>1</a></xml>', headers: { 'Content-Type': 'application/xml' } });
// ------------------------------------------------------------


let activeAjaxRequests = 0;
let ajaxStopHandlers = [];

const contentCache = new Map();

// Queue
const MAX_PARALLEL = 5;
const MAX_RETRIES = 2;
const TIMEOUT_DEFAULT = 15000;

let active = 0;
const queue = [];

// Auth
const auth = {
  getTokens: () => ({ access: null, refresh: null }),
  refresh: null, // Func for refresh token
  refreshing: null, // Current refreshing promise
};

// Events
function triggerAjaxStop() {
  const event = new Event("ajaxStop");
  document.dispatchEvent(event);

  if (activeAjaxRequests === 0) {
    ajaxStopHandlers.forEach(h => h());
    ajaxStopHandlers = [];
  }
}

// Connector
export const connector = {

  // Auth tokens
  setAuth(getTokensFn, refreshFn) {
    auth.getTokens = getTokensFn;
    auth.refresh = refreshFn;
  },

  onAjaxStop(handler) {
    ajaxStopHandlers.push(handler);
  },

  // API methods
  ajax(opts) {
    return queueRequest(opts);
  },

  get(url, opts = {}) {
    return queueRequest({ url, method: 'GET', ...opts });
  },

  post(url, data, opts = {}) {
    return queueRequest({ url, method: 'POST', data, ...opts });
  },

  upload(url, formData, opts = {}) {
    return queueRequest({
      url,
      method: 'POST',
      data: formData,
      ...opts
    });
  },

  // Load html content with caching
  async loadContent(url, selector, callback = null, pushState = false, stateUrl = null) {
    try {
      let html = contentCache.get(url);

      if (!html) {
        html = await connector.get(url, { responseType: 'text' });
        contentCache.set(url, html);
      }

      const el = document.querySelector(selector);
      if (el) el.innerHTML = html;

      if (typeof callback === 'function') callback();

      if (pushState && stateUrl) {
        window.history.pushState({}, '', stateUrl);
      }

    } catch (e) {
      console.error("Orionis ★ loadContent error:", e);
    }
  }
};


// Queue management
function queueRequest(options) {
  return new Promise((resolve, reject) => {
    queue.push({ resolve, reject, options });
    processQueue();
  });
}

function processQueue() {
  if (active >= MAX_PARALLEL || queue.length === 0) return;

  const { resolve, reject, options } = queue.shift();
  active++;

  doRequest(options)
    .then(resolve)
    .catch(reject)
    .finally(() => {
      active--;
      processQueue();
    });
}

// Request
async function doRequest(opts) {
  const {
    url,
    method = 'GET',
    data = null,
    headers = {},
    timeout = TIMEOUT_DEFAULT,
    responseType = 'auto',
    retry = MAX_RETRIES,
  } = opts;

  activeAjaxRequests++;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  // Auth tokens
  const tokens = auth.getTokens ? auth.getTokens() : {};
  if (tokens.access) {
    headers['Authorization'] = `Bearer ${tokens.access}`;
  }

  // Fetch options
  const fetchOpts = {
    method,
    headers: { ...headers },
    signal: controller.signal,
  };

  // Body
  if (data !== null) {
    if (data !== null) {
      if (typeof data === 'object' && !(data instanceof FormData)) {
        fetchOpts.headers['Content-Type'] = fetchOpts.headers['Content-Type'] || 'application/json';
        fetchOpts.body = JSON.stringify(data);
      } else if (typeof data === 'string') {
        fetchOpts.headers['Content-Type'] = fetchOpts.headers['Content-Type'] || 'text/plain';
        fetchOpts.body = data;
      } else { // FormData
        fetchOpts.body = data;
      }
    }
  }

  try {
    const response = await fetch(url, fetchOpts);
    clearTimeout(timer);

    // Unauthorized handling (Refresh token)
    if (response.status === 401 && auth.refresh) {
      return await handle401(opts);
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // Response
    let result;
    if (responseType === 'blob') result = await response.blob();
    else if (responseType === 'text') result = await response.text();
    else if (responseType === 'json') result = await response.json();
    else {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) result = await response.json();
      else result = await response.text();
    }
    return result;

  } catch (err) {
    if (err.name === 'AbortError') {
      if (retry > 0) return doRequest({ ...opts, retry: retry - 1 });
      throw new Error(`Timeout: ${url}`);
    }

    if (retry > 0) return doRequest({ ...opts, retry: retry - 1 });

    throw err;

  } finally {
    activeAjaxRequests--;
    if (activeAjaxRequests === 0) triggerAjaxStop();
  }
}

// Handle 401 Unauthorized
async function handle401(opts) {
  // already being refreshed
  if (auth.refreshing) {
    await auth.refreshing;
    return doRequest(opts);
  }

  auth.refreshing = (async () => {
    const newToken = await auth.refresh();
    return newToken;
  })();

  await auth.refreshing;
  auth.refreshing = null;

  return doRequest(opts);
}

window.ajax = connector.ajax;
window.onAjaxStop = connector.onAjaxStop;
