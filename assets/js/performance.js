// Rendimentos — lê data/benchmark.json (conta inteira, gerado por scripts/gerar_benchmark.py)
// e data/performance.json (trades e margem, gerado por scripts/gerar_performance.py) e desenha a seção.
// Regra: só mostra porcentagens e contagens que estão nos arquivos. Nada é inventado aqui.
// 09/11/2026 (decisão do Rafael): número principal = retorno da conta inteira (ponderado pelo tempo);
// Mês a mês na mesma base; retorno sobre a margem vira "Eficiência da margem"; trades pela regra de 16/10
// (ciclo completo por ativo); um único "Como é calculado".
(function () {
  "use strict";
  var data = null, bench = null, failed = false, benchFailed = false, pending = 2;
  var MONTHS = {
    pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  // Tradução fiel dos textos de método que vêm em português nos arquivos
  var METHOD_EN = {
    account: "End-of-day account equity (net liquidating value, the broker's official snapshots). Daily return = (today's equity − that day's deposits and withdrawals) ÷ yesterday's equity − 1; days are chained (time-weighted return). Includes open positions, interest and fees.",
    flows: "Deposits, withdrawals, reversals and transfer fees do not count as returns.",
    adjustments: "On Jul 27 and Aug 31, 2026 the equity changed because of an agreement with the broker, not because of trades; those days count as zero return, and the agreement amount (Sep 3) is treated as outside money.",
    spy: "SPY with dividends reinvested: official daily NAV published by State Street and dividends on the ex-date.",
    kelly: "Kelly criterion = win rate − (1 − win rate) ÷ payoff, where payoff = average win ÷ average loss of the year's closed trades. Read as the fraction of the average margin used that can be risked per trade."
  };

  function lang() { return (document.documentElement.lang || "pt").indexOf("pt") === 0 ? "pt" : "en"; }
  function tr(k) { var d = (window.I18N || {})[lang()] || {}; return d[k] || k; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  function num(v) { return typeof v === "number" && isFinite(v) ? v : null; }
  function fmtN(v, d) { var s = v.toFixed(d); return lang() === "pt" ? s.replace(".", ",") : s; }
  function fmtPct(v) {
    if (num(v) === null) return "—";
    return (v > 0 ? "+" : v < 0 ? "−" : "") + fmtN(Math.abs(v), 1) + "%";
  }
  function fmtDate(iso) {
    var p = String(iso).slice(0, 10).split("-");
    if (p.length !== 3) return esc(iso);
    var m = MONTHS[lang()][+p[1] - 1];
    return lang() === "pt" ? (+p[2]) + " " + m.toLowerCase() + " " + p[0] : m + " " + (+p[2]) + ", " + p[0];
  }
  function info(tip) { return ' <span class="info" tabindex="0" role="button" aria-label="' + esc(tip) + '" data-tip="' + esc(tip) + '">i</span>'; }

  // Retorno de cada mês na série acumulada: (1 + fim do mês) ÷ (1 + fim do mês anterior) − 1
  function monthlyFrom(series) {
    var ends = {}, order = [];
    series.forEach(function (p) { var m = p.date.slice(0, 7); if (!(m in ends)) order.push(m); ends[m] = p; });
    var out = [], prevA = null, prevS = null;
    order.forEach(function (m) {
      var p = ends[m];
      if (prevA === null) { prevA = p.account_pct; prevS = p.spy_pct; return; } // 1º ponto = base (31/12 do ano anterior)
      out.push({
        month: m,
        acc: ((1 + p.account_pct / 100) / (1 + prevA / 100) - 1) * 100,
        spy: ((1 + p.spy_pct / 100) / (1 + prevS / 100) - 1) * 100
      });
      prevA = p.account_pct; prevS = p.spy_pct;
    });
    return out;
  }

  function render() {
    var root = document.getElementById("perf-root");
    if (!root || pending > 0) return;
    if (failed && (benchFailed || !bench)) { root.innerHTML = '<p class="perf-empty">' + esc(tr("perf.unavailable")) + "</p>"; return; }
    var d = data || {};
    var hasBench = bench && Array.isArray(bench.series) && bench.series.length > 1;

    // Número principal: conta inteira (se o arquivo da conta faltar, cai no retorno sobre a margem, como antes)
    var big = hasBench ? num(bench.ytd_account_pct) : num(d.ytd_return_on_margin_pct);
    var marginEff = num(d.ytd_return_on_margin_pct);

    // Mês a mês
    var bars = "", foot = [];
    if (hasBench) {
      var months = monthlyFrom(bench.series);
      var max = months.reduce(function (a, m) { return Math.max(a, Math.abs(m.acc)); }, 0) || 1;
      var lastM = months.length ? months[months.length - 1].month : "";
      var now = new Date(), curM = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2);
      var partialM = lastM === curM ? lastM : "";
      bars = months.map(function (m) {
        var v = m.acc, mi = +m.month.split("-")[1] - 1, cls = v >= 0 ? "pos" : "neg";
        var h = Math.max(2, Math.round(Math.abs(v) / max * 100));
        var tip = MONTHS[lang()][mi] + " " + m.month.slice(0, 4) + ": " + tr("perf.acc") + " " + fmtPct(v) + " · S&P 500 " + fmtPct(m.spy);
        return '<div class="perf-bar-col" title="' + esc(tip) + '">' +
          '<span class="perf-bar-val ' + cls + '">' + fmtPct(v) + "</span>" +
          '<div class="perf-bar-track"><div class="perf-bar ' + cls + '" style="height:' + h + '%"></div></div>' +
          '<span class="perf-bar-label">' + MONTHS[lang()][mi] + (m.month === partialM ? "*" : "") + "</span></div>";
      }).join("");
      if (partialM) foot.push("* " + tr("perf.partial"));
    }

    // Estatísticas dos trades (regra de 16/10)
    var stats = "";
    if (num(d.ytd_closed_trades) !== null) stats += '<div class="perf-stat"><span class="perf-stat-v">' + d.ytd_closed_trades + '</span><span class="perf-stat-l">' + esc(tr("perf.trades")) + "</span></div>";
    if (num(d.ytd_win_rate_pct) !== null) stats += '<div class="perf-stat"><span class="perf-stat-v">' + fmtN(d.ytd_win_rate_pct, 1) + '%</span><span class="perf-stat-l">' + esc(tr("perf.winrate")) + "</span></div>";
    if (num(d.ytd_payoff) !== null) stats += '<div class="perf-stat"><span class="perf-stat-v">' + fmtN(d.ytd_payoff, 2) + '</span><span class="perf-stat-l">' + esc(tr("perf.payoff")) + "</span></div>";
    if (num(d.ytd_kelly_pct) !== null) stats += '<div class="perf-stat"><span class="perf-stat-v">' + fmtN(d.ytd_kelly_pct, 1) + '%</span><span class="perf-stat-l">' + esc(tr("perf.kelly")) + info(tr("perf.kelly.tip") + ". " + tr("perf.kellyNote")) + "</span></div>";
    if (marginEff !== null) stats += '<div class="perf-stat"><span class="perf-stat-v">' + fmtPct(marginEff) + '</span><span class="perf-stat-l">' + esc(tr("perf.marginStat")) + info(tr("perf.m.marginText")) + "</span></div>";

    var start = hasBench ? null : (d.period && d.period.start);
    var end = hasBench ? bench.period && bench.period.end : (d.period && d.period.end);
    var period = (d.period && d.period.start ? fmtDate(d.period.start) : (start ? fmtDate(start) : "")) + (end ? " – " + fmtDate(end) : "");
    var account = d.account_label ? (lang() === "en" ? String(d.account_label).replace(/conta pessoal/i, "Personal account") : d.account_label) : "";

    // Como é calculado (único)
    var bm = (bench && bench.method) || {}, pm = d.method || {};
    var bt = function (k) { return lang() === "en" ? (METHOD_EN[k] || bm[k]) : bm[k]; };
    var rows = "";
    if (hasBench) {
      if (bm.account) rows += "<p><strong>" + esc(tr("perf.m.account")) + ":</strong> " + esc(bt("account")) + "</p>";
      if (bm.flows) rows += "<p><strong>" + esc(tr("perf.m.flows")) + ":</strong> " + esc(bt("flows")) + "</p>";
      if (bm.adjustments) rows += "<p><strong>" + esc(tr("perf.m.adj")) + ":</strong> " + esc(bt("adjustments")) + "</p>";
      rows += "<p><strong>" + esc(tr("perf.m.monthly")) + ":</strong> " + esc(tr("perf.m.monthlyText")) + "</p>";
      if (bm.spy) rows += "<p><strong>S&amp;P 500 (SPY):</strong> " + esc(bt("spy")) + "</p>";
    }
    if (marginEff !== null) rows += "<p><strong>" + esc(tr("perf.m.margin")) + ":</strong> " + esc(tr("perf.m.marginText")) + "</p>";
    rows += "<p><strong>" + esc(tr("perf.m.trade")) + ":</strong> " + esc(tr("perf.m.tradeText")) + "</p>";
    if (pm.kelly) rows += "<p><strong>" + esc(tr("perf.m.kelly")) + ":</strong> " + esc(lang() === "en" ? METHOD_EN.kelly : pm.kelly) + "</p>";

    root.innerHTML =
      '<div class="perf-grid">' +
        '<div class="card perf-ytd"><p class="perf-kicker">' + esc(tr(hasBench ? "perf.ytd" : "perf.ytdMargin")) + "</p>" +
          '<p class="perf-big ' + (big !== null && big < 0 ? "neg" : "pos") + '">' + fmtPct(big) + "</p>" +
          '<p class="perf-sub">' + esc(tr(hasBench ? "perf.twr" : "perf.onMargin")) + info(tr(hasBench ? "perf.twrTip" : "perf.marginTip")) + "</p>" +
          (end ? '<p class="perf-sub perf-asof">' + esc(tr("perf.dataThrough")) + " <b>" + fmtDate(end) + "</b></p>" : "") +
          (stats ? '<p class="perf-sub perf-stats-h">' + esc(tr("perf.tradesHead")) + info(tr("perf.tradeTip")) + '</p><div class="perf-stats">' + stats + "</div>" : "") +
          (period ? '<p class="perf-sub">' + esc(tr("perf.period")) + ": " + period + "</p>" : "") +
          (account ? '<p class="perf-sub">' + esc(account) + "</p>" : "") +
        "</div>" +
        '<div id="bench-root" class="bench"></div>' +
        (bars ? '<div class="card perf-months"><p class="perf-kicker">' + esc(tr("perf.monthly")) + "</p>" +
          '<div class="perf-bars">' + bars + "</div>" +
          (foot.length ? '<p class="perf-foot">' + esc(foot.join("   ·   ")) + "</p>" : "") +
        "</div>" : "") +
      "</div>" +
      '<details class="perf-method"><summary>' + esc(tr("perf.method")) + "</summary>" + rows +
        (window.RF_AUDIT_URL ? '<p class="tr-audit"><strong>' + esc(tr("tr.audit.k")) + "</strong> " + esc(tr("tr.audit.text")) + ' <a href="' + esc(window.RF_AUDIT_URL) + '" target="_blank" rel="noopener noreferrer">' + esc(tr("tr.audit.link")) + " →</a></p>" : "") + "</details>" +
      '<p class="perf-foot">' + esc(tr("perf.updated")) + " " + ((bench && bench.last_updated) || d.last_updated ? fmtDate((bench && bench.last_updated) || d.last_updated) : "—") + " · " + esc(tr("perf.disclaimer")) + "</p>";
    var su = document.getElementById("site-updated"), lu = (bench && bench.last_updated) || d.last_updated;
    if (su && lu) { su.textContent = tr("footer.updated") + " " + fmtDate(lu) + " " + tr("footer.at") + " " + String(lu).slice(11, 16) + " " + tr("footer.tz"); su.hidden = false; }
    document.dispatchEvent(new Event("perfrendered"));
  }

  document.addEventListener("langchange", render);
  function done() { pending -= 1; render(); }
  fetch("data/performance.json?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) { data = j; }).catch(function () { failed = true; }).then(done);
  fetch("data/benchmark.json?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) { bench = j; }).catch(function () { benchFailed = true; }).then(done);
})();
