// Calendario economico dos EUA (widget do TradingView). Carrega so quando a secao chega perto da tela
// e recarrega ao trocar o idioma (PT/EN). Sem o widget, o visitante ainda tem os links oficiais abaixo.
(function () {
  "use strict";
  var host = document.getElementById("cal-widget");
  if (!host) return;
  var started = false;

  function isEn() { return (document.documentElement.lang || "pt").indexOf("en") === 0; }

  function render() {
    started = true;
    host.textContent = "";
    var wrap = document.createElement("div");
    wrap.className = "tradingview-widget-container";
    var inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    wrap.appendChild(inner);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    s.text = JSON.stringify({
      colorTheme: "dark",
      isTransparent: true,
      locale: isEn() ? "en" : "br",
      countryFilter: "us",
      importanceFilter: "-1,0,1",
      width: "100%",
      height: 520
    });
    wrap.appendChild(s);
    host.appendChild(wrap);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); render(); }
    }, { rootMargin: "400px 0px" });
    io.observe(host);
  } else {
    render();
  }
  document.addEventListener("langchange", function () { if (started) render(); });
})();
