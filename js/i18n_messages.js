/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * i18n messages v.2.0.0 (ESM)
 * 3bit.app | 2025
 */

/* Json Files format:
    {
      "name": "ENGLISH",
      "label": "English",
      "code": "en",
      "locale": "en-US",
      "status": "enabled",
      "messages": {
        "user_banned": "User has been banned",
        "hello_user": "Hello {username}!"
      }
    }
 */

// import { i18n } from "./js/i18n_messages.js";
// await i18n.loadFiles([ "/data/json/language_en.json", "/data/json/language_fr.json" ]);
// console.log(i18n.getTranslateName()); 
// console.log(i18n.getMessage("user_banned"));
// console.log(i18n.getMessage("hello_user", { username: "Alex" }));
// i18n.setLanguage("ua");
// i18n.onLanguageChange(lang => { console.log("Language changed to:", lang); });
// ------------------------------------------------------------
// Pluralization: i18n.getMessage("user_count", {count: 5})
// Json user_count message format: "user_count": { "one": "{count} user", "many": "{count} users" }


class I18nMessages {

  constructor() {
    this.languages = [];             // Languages list
    this.languagesMap = new Map();   // Map<code, languageObject>
    this.messagesMap = new Map();    // Map<code, Map<key, message>>

    this.currentLanguage = "en";
    this.fallbackLanguage = "en";

    this.listeners = new Set();      // Callbacks on language change
    this.rtlLanguages = new Set(     // RTL languages
      ["ar", "he", "fa", "ps", "ur"]);

    this._observer = null;           // MutationObserver
    this._lazyFiles = new Map();     // Map<code, filePath>
    this.lazyFilesPath = "";         // Path for lazy files
    this.isAlreadyRegistered = false;// Flag
  }

  // Load or register languages →
  // Case 1. Load all languages from files OR
  // Case 2. Register all languages and load on demand

  // Load languages → ( {string[]} files - list of path to JSON files )
  async loadFiles(files) {
    if (!this.isAlreadyRegistered) {
      this.languages = [];
      this.languagesMap.clear();
      this.messagesMap.clear();
    }

    for (const file of files) {
      const res = await fetch(file);
      if (!res.ok) {
        console.warn("Orionis ★ i18n: can't load", file);
        continue;
      }

      const language = await res.json();
      if (!language.code) continue;

      if (!this.isAlreadyRegistered) {
        this.languages.push(language);
        this.languagesMap.set(language.code, language);
      }

      const map = new Map();
      for (const [name, value] of Object.entries(language.messages || {})) {
        map.set(name, value);
      }
      // Other way:
      //Object.entries(lang.messages || {}).forEach(([name, value]) =>
      //  map.set(name, value)
      //);

      this.messagesMap.set(language.code, map);
    }

    // Current language
    this.detectBrowserLanguage();
    this.restoreSavedLanguage();
    this.applyDirection();
  }

  // Load definition file
  async loadFile(defFile) {
      const res = await fetch(defFile);
      if (!res.ok) {
        console.warn("Orionis ★ i18n: can't load", defFile);
        return null;
      }
      return await res.json();
  }

  // Register languages → ( {object[]} languagesDef - list of language definitions )
  // languagesDef = [
  //   { code: "en", file: "/data/json/en.json", "name": "ENGLISH", label: "English" },
  //   { code: "fr", file: "/data/json/fr.json", "name": "FRENCH", label: "Français" }
  // ]
  registerLanguages(languagesDef) {
    this.languages = languagesDef;

    for (const language of languagesDef) {
      this.languagesMap.set(language.code, language);
      this._lazyFiles.set(language.code, language.file);
    }

    this.detectBrowserLanguage();
    this.restoreSavedLanguage();
    this.applyDirection();

    this.isAlreadyRegistered = true;
  }

  // Load language messages on demand
  async loadLanguage(languageCode) {
    if (this.messagesMap.has(languageCode)) {
      return; // Already loaded
    }

    const lazyFile = this._lazyFiles.get(languageCode);
    if (!lazyFile) {
      console.warn("Orionis ★ i18n: missing file for " + languageCode);
      return;
    }

    await i18n.loadFiles([this.lazyFilesPath + lazyFile]);
  }

  setLazyFilesPath(lazyFilesPath) {
    this.lazyFilesPath = lazyFilesPath;
  }

  // Language operations
  detectBrowserLanguage() {
    const browserLanguage = navigator.language?.toLowerCase() || "en";
    for (const language of this.languages) {
      if (browserLanguage.startsWith(language.code.toLowerCase())) {
        this.currentLanguage = language.code;
        return;
      }
    }
  }

  restoreSavedLanguage() {
    const saved = localStorage.getItem("language");
    if (saved && this.languagesMap.has(saved)) {
      this.currentLanguage = saved;
    }
  }

  saveLanguage() {
    localStorage.setItem("language", this.currentLanguage);
  }

  async setLanguage(languageCode) {
    if (!this.languagesMap.has(languageCode)) return false;

    // Lazy load messages if needed
    if (this.isAlreadyRegistered) {
      await this.loadLanguage(languageCode); // Lazy load

      if (this.fallbackLanguage && !this.messagesMap.has(this.fallbackLanguage)) {
        await this.loadLanguage(this.fallbackLanguage);
      }
    }

    this.currentLanguage = languageCode;
    this.saveLanguage();
    this.applyDirection();
    this._emitLanguageChange();
    return true;
  }

  onLanguageChange(callback) {
    this.listeners.add(callback);
  }

  removeLanguageListener(callback) {
    this.listeners.delete(callback);
  }

  _emitLanguageChange() {
    for (const callback of this.listeners) callback(this.currentLanguage);
  }

  applyDirection() {
    const html = document.documentElement;

    if (this.rtlLanguages.has(this.currentLanguage)) {
      html.setAttribute("dir", "rtl");
    } else {
      html.setAttribute("dir", "ltr");
    }

    html.setAttribute("lang", this.currentLanguage);
  }

  // Language name
  getLanguageName(languageCode = this.currentLanguage) {
    const language = this.languagesMap.get(languageCode);
    return language?.label || language?.name || null;
  }

  // Get translated message → ( vars = { substitution: "Placeholder" } )
  getMessage(messageCode, vars = null, languageCode = this.currentLanguage) {
      const map = this.messagesMap.get(languageCode);

      let message = map?.get(messageCode);

      // Fallback message
      if (!message && this.fallbackLanguage && this.messagesMap.has(this.fallbackLanguage)) {
          message = this.messagesMap.get(this.fallbackLanguage).get(messageCode);
      }

      if (!message) return null;

      // Pluralization
      if (typeof message === "object" && vars?.count != null) {
        message = this._plural(message, vars.count);
      }

      // Placeholder
      if (vars && typeof vars === "object") {
        message = message.replace(/\{([^}]+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
      }

      return message;
  }

  _plural(variants, count) {
    if (count === 1 && variants.one) return variants.one;
    if (count >= 2 && variants.many) return variants.many;
    return Object.values(variants)[0];
  }

  // All languages
  getLanguages() {
    return this.languages;
  }

  // Observer → ( document.body.insertAdjacentHTML("beforeend", `<div data-i18n="hello"></div>`); )
  enableAutoDOMTranslate(updateFun) {
    if (this._observer) return;

    this._observer = new MutationObserver((mutations) => {
      let required = false;

      for (const m of mutations) {
        if (m.type === "childList" && m.addedNodes.length > 0) {
          required = true;
          break;
        }
      }

      if (required) updateFun();
    });

    this._observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Class export
export const i18n = new I18nMessages();
