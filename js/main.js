(function () {
  "use strict";

  var STORAGE_KEY = "rf-lang";
  var htmlKeysWithMarkup = { "markets.note": true };

  function getPreferredLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "pt" || stored === "en") return stored;
    } catch (_) {}
    var nav = (navigator.language || "").toLowerCase();
    if (nav.indexOf("pt") === 0) return "pt";
    return "en";
  }

  function setLang(lang) {
    if (!window.I18N || !window.I18N[lang]) return;
    var dict = window.I18N[lang];

    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!Object.prototype.hasOwnProperty.call(dict, key)) return;
      if (htmlKeysWithMarkup[key]) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    document.querySelectorAll(".lang-btn, .lang-btn-text").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      if (btn.classList.contains("lang-btn")) {
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      }
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }

  function initLangSwitcher() {
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
    setLang(getPreferredLang());
  }

  function initMobileNav() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.getElementById("mobile-nav");
    if (!toggle || !panel) return;

    function close() {
      toggle.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    }

    function open() {
      toggle.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) close();
      else open();
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initLangSwitcher();
    initMobileNav();
  });
})();
