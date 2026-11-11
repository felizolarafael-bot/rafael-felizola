// Comparativo no ano: conta inteira × SPY — lê data/benchmark.json (gerado por scripts/gerar_benchmark.py).
// Regra: só desenha porcentagens que estão no arquivo. Nada é inventado aqui.
(function () {
  "use strict";
  var data = null, failed = false;
  var T = {
    pt: {
      kicker: "Conta inteira × S&P 500 no ano", acc: "Minha conta", short: "Conta", spy: "S&P 500",
      sub: "Retorno acumulado sobre o patrimônio inteiro da conta, descontados depósitos e saques. S&P 500 medido pelo ETF SPY, com dividendos reinvestidos.",
      diff: "Por que é diferente do +109%?", diffText: "Aqui a base é o patrimônio inteiro da conta, com as posições abertas. O número do cartão No ano é sobre a margem utilizada e conta só os trades fechados; por isso os dois são diferentes.", method: "Como é calculado",
      table: "Ver em tabela (fim de cada mês)", month: "Mês", unavailable: "Comparativo indisponível no momento.",
      until: "até", pts: "p.p.", ahead: "acima do S&P 500", behind: "abaixo do S&P 500",
      m: { account: "Conta", flows: "Depósitos e saques", adjustments: "Acordo com a corretora", spy: "S&P 500 (SPY)", difference: "Diferença para o número acima" }
    },
    en: {
      kicker: "Whole account × S&P 500 this year", acc: "My account", short: "Account", spy: "S&P 500",
      sub: "Cumulative return on the whole account equity, net of deposits and withdrawals. S&P 500 measured by the SPY ETF, with dividends reinvested.",
      diff: "Why is it different from the big number?", diffText: "Here the base is the whole account equity, including open positions. The Year to date number is on the margin used and counts only closed trades, so the two differ.", method: "How it is calculated",
      table: "View as table (end of each month)", month: "Month", unavailable: "Comparison unavailable right now.",
      until: "through", pts: "pts", ahead: "ahead of the S&P 500", behind: "behind the S&P 500",
      m: { account: "Account", flows: "Deposits and withdrawals", adjustments: "Agreement with the broker", spy: "S&P 500 (SPY)", difference: "Difference from the number above" }
    }
  };
  var METHOD_EN = {
    account: "End-of-day account equity (net liquidating value, the broker's official snapshots). Daily return = (today's equity − that day's deposits and withdrawals) ÷ yesterday's equity − 1; days are chained (time-weighted return). Includes open positions, interest and fees.",
    flows: "Deposits, withdrawals, reversals and transfer fees do not count as returns.",
    adjustments: "On Jul 27 and Aug 31, 2026 the equity changed because of an agreement with the broker, not because of trades; those days count as zero return, and the agreement amount (Sep 3) is treated as outside money.",
    spy: "SPY with dividends reinvested: official daily NAV published by State Street and dividends on the ex-date.",
    difference: "This is the return on the whole account. The big number above is on the margin used and counts only closed trades, so the two differ."
  };
  var MONTHS = {
    pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  var C_ACC = "#c9a227", C_SPY = "#4a86e0";

  function lang() { return (document.documentElement.lang || "pt").indexOf("pt") === 0 ? "pt" : "en"; }
  function t() { return T[lang()]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  function fmt(v) { var s = Math.abs(v).toFixed(1); if (lang() === "pt") s = s.replace(".", ","); return (v > 0 ? "+" : v < 0 ? "−" : "") + s + "%"; }
  function fmtPts(v) { var s = Math.abs(v).toFixed(1); if (lang() === "pt") s = s.replace(".", ","); return s + " " + t().pts; }
  function fmtDay(iso) { var p = iso.split("-"); return lang() === "pt" ? (+p[2]) + " " + MONTHS.pt[+p[1] - 1] + " " + p[0] : MONTHS.en[+p[1] - 1] + " " + (+p[2]) + ", " + p[0]; }

  // 06/11: o desenho usa a largura real do quadro (1 unidade = 1 px), para o texto do gráfico
  // ter sempre o mesmo tamanho em qualquer janela (antes: 760 ou 400 fixos, esticados pelo navegador).
  function dims() {
    var r = document.getElementById("bench-root"), wrap = r && r.querySelector(".bm-wrap");
    var w = Math.round(wrap ? wrap.clientWidth : (r ? r.clientWidth - 48 : 720));
    w = Math.max(280, w || 720);
    var small = w < 520;
    return small ? { W: w, H: Math.round(Math.max(240, Math.min(320, w * 0.78))), L: 54, R: 14, TOP: 14, B: 28, small: true }
                 : { W: w, H: Math.round(Math.max(260, Math.min(340, w * 0.42))), L: 46, R: 118, TOP: 16, B: 30, small: false };
  }
  function ytdTxt() { var b = document.querySelector("#perf-root .perf-big"); return b ? b.textContent : "número grande"; }
  function chart(s, D) {
    var W = D.W, H = D.H, L = D.L, R = D.R, TOP = D.TOP, B = D.B;
    var vals = [];
    s.forEach(function (p) { vals.push(p.account_pct, p.spy_pct); });
    var lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max(0, Math.max.apply(null, vals));
    var step = [5, 10, 20, 25, 50, 100].filter(function (k) { return (hi - lo) / k <= 6; })[0] || 100;
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
    var n = s.length - 1;
    var x = function (i) { return L + (W - L - R) * i / n; };
    var y = function (v) { return TOP + (H - TOP - B) * (hi - v) / (hi - lo); };
    var grid = "";
    for (var v = lo; v <= hi + 1e-9; v += step) {
      grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="bm-grid' + (v === 0 ? " bm-zero" : "") + '"/>' +
        '<text x="' + (L - 8) + '" y="' + (y(v) + 4) + '" class="bm-ax" text-anchor="end">' + (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v) + "%</text>";
    }
    var ticks = "", seen = {}, nm = 0;
    s.forEach(function (p, i) {
      var m = p.date.slice(0, 7);
      if (i > 0 && !seen[m]) { seen[m] = 1; if (D.small && (nm++ % 2)) return; ticks += '<text x="' + x(i) + '" y="' + (H - 8) + '" class="bm-ax" text-anchor="middle">' + MONTHS[lang()][+m.slice(5) - 1] + "</text>"; }
    });
    function path(k) { return s.map(function (p, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p[k]).toFixed(1); }).join(""); }
    var last = s[n];
    var ya = y(last.account_pct), ys = y(last.spy_pct);
    if (Math.abs(ya - ys) < 16) { if (ya < ys) { ya -= 8; ys += 8; } else { ya += 8; ys -= 8; } }
    return '<svg class="bm-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(t().kicker + ": " + t().acc + " " + fmt(last.account_pct) + ", " + t().spy + " " + fmt(last.spy_pct)) + '">' +
      grid + ticks +
      '<path d="' + path("spy_pct") + '" fill="none" stroke="' + C_SPY + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="' + path("account_pct") + '" fill="none" stroke="' + C_ACC + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="' + x(n) + '" cy="' + y(last.account_pct) + '" r="4" fill="' + C_ACC + '" stroke="#131920" stroke-width="2"/>' +
      '<circle cx="' + x(n) + '" cy="' + y(last.spy_pct) + '" r="4" fill="' + C_SPY + '" stroke="#131920" stroke-width="2"/>' +
      (D.small ? "" : '<text x="' + (x(n) + 10) + '" y="' + (ya + 4) + '" class="bm-lbl">' + esc(t().short) + " " + fmt(last.account_pct) + "</text>" +
      '<text x="' + (x(n) + 10) + '" y="' + (ys + 4) + '" class="bm-lbl">' + esc(t().spy) + " " + fmt(last.spy_pct) + "</text>") +
      '<g class="bm-hover" style="display:none"><line class="bm-cross" y1="' + TOP + '" y2="' + (H - B) + '"/>' +
      '<circle class="bm-ha" r="4" fill="' + C_ACC + '" stroke="#131920" stroke-width="2"/><circle class="bm-hs" r="4" fill="' + C_SPY + '" stroke="#131920" stroke-width="2"/></g>' +
      '<rect class="bm-hit" x="' + L + '" y="0" width="' + (W - L - R) + '" height="' + H + '" fill="transparent"/>' +
      "</svg>";
  }

  function wire(root, s, D) {
    var svg = root.querySelector(".bm-svg"), tip = root.querySelector(".bm-tip"), g = svg.querySelector(".bm-hover");
    var hit = svg.querySelector(".bm-hit");
    var L = D.L, W = D.W, R = D.R, n = s.length - 1;
    function show(ev) {
      var r = svg.getBoundingClientRect(), cx = (ev.touches ? ev.touches[0].clientX : ev.clientX);
      var vx = (cx - r.left) / r.width * W;
      var i = Math.max(0, Math.min(n, Math.round((vx - L) / (W - L - R) * n)));
      var p = s[i], px = L + (W - L - R) * i / n;
      var la = svg.querySelector('path[stroke="' + C_ACC + '"]'), ls = svg.querySelector('path[stroke="' + C_SPY + '"]');
      var ya = +la.getAttribute("d").split(/[ML]/)[i + 1].split(" ")[1], ysp = +ls.getAttribute("d").split(/[ML]/)[i + 1].split(" ")[1];
      g.style.display = "";
      g.querySelector(".bm-cross").setAttribute("x1", px); g.querySelector(".bm-cross").setAttribute("x2", px);
      g.querySelector(".bm-ha").setAttribute("cx", px); g.querySelector(".bm-ha").setAttribute("cy", ya);
      g.querySelector(".bm-hs").setAttribute("cx", px); g.querySelector(".bm-hs").setAttribute("cy", ysp);
      tip.innerHTML = "<strong>" + esc(fmtDay(p.date)) + "</strong>" +
        '<span><i style="background:' + C_ACC + '"></i>' + esc(t().acc) + " <b>" + fmt(p.account_pct) + "</b></span>" +
        '<span><i style="background:' + C_SPY + '"></i>' + esc(t().spy) + " <b>" + fmt(p.spy_pct) + "</b></span>";
      tip.hidden = false;
      var left = px / W * r.width;
      tip.style.left = Math.max(0, Math.min(r.width - tip.offsetWidth, left - tip.offsetWidth / 2)) + "px";
    }
    function hide() { g.style.display = "none"; tip.hidden = true; }
    hit.addEventListener("mousemove", show); hit.addEventListener("mouseleave", hide);
    hit.addEventListener("touchstart", show, { passive: true }); hit.addEventListener("touchmove", show, { passive: true });
    hit.addEventListener("touchend", hide);
  }

  function render() {
    var root = document.getElementById("bench-root");
    if (!root) return;
    if (failed) { root.innerHTML = '<p class="perf-empty">' + esc(t().unavailable) + "</p>"; return; }
    if (!data || !Array.isArray(data.series) || data.series.length < 2) return;
    var s = data.series, last = s[s.length - 1], gap = last.account_pct - last.spy_pct, D = dims();
    var md = data.method || {};
    var mt = function (k) { return lang() === "en" ? (METHOD_EN[k] || md[k]) : md[k]; };
    var rows = ["account", "flows", "adjustments", "spy"].filter(function (k) { return md[k]; })
      .map(function (k) { return "<p><strong>" + esc(t().m[k]) + ":</strong> " + esc(mt(k)) + "</p>"; }).join("");
    var ends = {}; s.forEach(function (p) { ends[p.date.slice(0, 7)] = p; });
    var trows = Object.keys(ends).sort().map(function (m) {
      var p = ends[m];
      return "<tr><th scope=\"row\">" + esc(fmtDay(p.date)) + "</th><td>" + fmt(p.account_pct) + "</td><td>" + fmt(p.spy_pct) + "</td></tr>";
    }).join("");
    root.innerHTML =
      '<div class="card bm-card">' +
        '<p class="perf-kicker">' + esc(t().kicker) + "</p>" +
        '<div class="bm-legend">' +
          '<span><i style="background:' + C_ACC + '"></i>' + esc(t().acc) + " <b>" + fmt(last.account_pct) + "</b></span>" +
          '<span><i style="background:' + C_SPY + '"></i>' + esc(t().spy) + " <b>" + fmt(last.spy_pct) + "</b></span>" +
          '<span class="bm-gap">' + esc(fmtPts(gap) + " " + (gap >= 0 ? t().ahead : t().behind)) + " · " + esc(t().until + " " + fmtDay(last.date)) + "</span>" +
        "</div>" +
        '<div class="bm-wrap">' + chart(s, D) + '<div class="bm-tip" hidden></div></div>' +
        '<p class="perf-sub">' + esc(t().sub) + "</p>" +
        '<details class="perf-method"><summary>' + esc(t().table) + "</summary>" +
          '<div class="ins-tablewrap"><table class="ins-table bm-table"><thead><tr><th>' + esc(t().month) + "</th><th>" + esc(t().acc) + "</th><th>" + esc(t().spy) + "</th></tr></thead><tbody>" + trows + "</tbody></table></div>" +
        "</details>" +
      "</div>";
    wire(root, s, D);
    lastSmall = D.small; lastW = D.W;
    var wr = root.querySelector(".bm-wrap");
    if (wr && Math.abs(wr.clientWidth - D.W) > 8 && !again) { again = true; render(); again = false; }
  }
  var lastSmall = null, lastW = 0, again = false, rzT = null;
  window.addEventListener("resize", function () {
    clearTimeout(rzT);
    rzT = setTimeout(function () { if (data && Math.abs(dims().W - lastW) > 8) render(); }, 120);
  });

  document.addEventListener("langchange", render);
  document.addEventListener("perfrendered", render);
  fetch("data/benchmark.json?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) { data = j; render(); })
    .catch(function () { failed = true; render(); });
})();
