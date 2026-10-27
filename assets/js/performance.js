// Rendimentos — lê data/performance.json (gerado pelo TT Journal) e desenha a seção.
// Regra: só mostra porcentagens e contagens que estão no arquivo. Nada é inventado aqui.
(function () {
  "use strict";
  var data = null, failed = false;
  var MONTHS = {
    pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  // Tradução fiel do método descrito no arquivo (o arquivo vem em português)
  var METHOD_EN = {
    name: "Closed P&L on margin used",
    numerator: "Net P&L of trades closed in the period, by closing date, after commissions and fees. Computed by TT Journal (1 contract = 1 trade, from opening until the quantity reaches zero) from the official account transactions.",
    denominator: "Daily average of the official end-of-day maintenance requirement (official EOD balance snapshots) over the same period.",
    monthly: "Closed P&L for the month ÷ average daily margin for the month.",
    ytd: "Closed P&L for the year ÷ average daily margin for the year. Not a sum or product of the months.",
    excluded: "Deposits, withdrawals and changes in positions still open.",
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

  function render() {
    var root = document.getElementById("perf-root");
    if (!root) return;
    if (failed) { root.innerHTML = '<p class="perf-empty">' + esc(tr("perf.unavailable")) + "</p>"; return; }
    if (!data) return;

    var months = Array.isArray(data.monthly) ? data.monthly.filter(function (m) { return num(m.return_on_margin_pct) !== null; }) : [];
    var max = months.reduce(function (a, m) { return m.closed_trades === 0 ? a : Math.max(a, Math.abs(m.return_on_margin_pct)); }, 0) || 1;
    var endMonth = data.period && data.period.end ? String(data.period.end).slice(0, 7) : "";
    var hasPartial = /parcial|partial/i.test((data.notes || []).join(" "));

    var bars = months.map(function (m) {
      var v = m.return_on_margin_pct, none = m.closed_trades === 0;
      var h = none ? 0 : Math.max(2, Math.round(Math.abs(v) / max * 100));
      var mi = +String(m.month).split("-")[1] - 1;
      var partial = hasPartial && String(m.month) === endMonth;
      var cls = none ? "zero" : (v >= 0 ? "pos" : "neg");
      var tip = MONTHS[lang()][mi] + " " + String(m.month).slice(0, 4) + ": " +
        (none ? tr("perf.noTrades") : fmtPct(v) + " · " + m.closed_trades + " " + tr("perf.trades"));
      return '<div class="perf-bar-col" title="' + esc(tip) + '">' +
        '<span class="perf-bar-val ' + cls + '">' + (none ? "—" : fmtPct(v)) + "</span>" +
        '<div class="perf-bar-track"><div class="perf-bar ' + cls + '" style="height:' + h + '%"></div></div>' +
        '<span class="perf-bar-label">' + MONTHS[lang()][mi] + (partial ? "*" : "") + "</span></div>";
    }).join("");

    var ytd = num(data.ytd_return_on_margin_pct);
    var period = data.period ? fmtDate(data.period.start) + " – " + fmtDate(data.period.end) : "";
    var stats = "";
    if (num(data.ytd_closed_trades) !== null) stats += '<div class="perf-stat"><span class="perf-stat-v">' + data.ytd_closed_trades + '</span><span class="perf-stat-l">' + esc(tr("perf.trades")) + "</span></div>";
    if (num(data.ytd_win_rate_pct) !== null) stats += '<div class="perf-stat"><span class="perf-stat-v">' + fmtN(data.ytd_win_rate_pct, 1) + '%</span><span class="perf-stat-l">' + esc(tr("perf.winrate")) + "</span></div>";
    if (num(data.ytd_kelly_pct) !== null) stats += '<div class="perf-stat" title="' + esc(tr("perf.kelly.tip")) + '"><span class="perf-stat-v">' + fmtN(data.ytd_kelly_pct, 1) + '%</span><span class="perf-stat-l">' + esc(tr("perf.kelly")) + "</span></div>";
    var account = data.account_label ? (lang() === "en" ? String(data.account_label).replace("conta pessoal", "personal account") : data.account_label) : "";

    var md = data.method || {};
    var mt = function (k) { return lang() === "en" ? (METHOD_EN[k] || md[k]) : md[k]; };
    var mrows = [["perf.m.num", "numerator"], ["perf.m.den", "denominator"], ["perf.m.monthly", "monthly"], ["perf.m.ytd", "ytd"], ["perf.m.excl", "excluded"], ["perf.m.kelly", "kelly"]]
      .filter(function (r) { return md[r[1]]; })
      .map(function (r) { return "<p><strong>" + esc(tr(r[0])) + ":</strong> " + esc(mt(r[1])) + "</p>"; }).join("");

    var foot = [];
    if (hasPartial) foot.push("* " + tr("perf.partial"));
    if (months.some(function (m) { return m.closed_trades === 0; })) foot.push("— " + tr("perf.noTrades"));

    root.innerHTML =
      '<div class="perf-grid">' +
        '<div class="card perf-ytd"><p class="perf-kicker">' + esc(tr("perf.ytd")) + "</p>" +
          '<p class="perf-big ' + (ytd !== null && ytd < 0 ? "neg" : "pos") + '">' + fmtPct(ytd) + "</p>" +
          '<p class="perf-sub">' + esc(tr("perf.onMargin")) + "</p>" +
          (stats ? '<div class="perf-stats">' + stats + "</div>" : "") +
          (period ? '<p class="perf-sub">' + esc(tr("perf.period")) + ": " + period + "</p>" : "") +
          (account ? '<p class="perf-sub">' + esc(account) + "</p>" : "") +
        "</div>" +
        '<div class="card perf-months"><p class="perf-kicker">' + esc(tr("perf.monthly")) + "</p>" +
          '<div class="perf-bars">' + bars + "</div>" +
          (foot.length ? '<p class="perf-foot">' + esc(foot.join("   ·   ")) + "</p>" : "") +
        "</div>" +
      "</div>" +
      '<details class="perf-method"><summary>' + esc(tr("perf.method")) + "</summary>" +
        (md.name ? "<p><strong>" + esc(mt("name")) + "</strong></p>" : "") + mrows + "</details>" +
      '<p class="perf-foot">' + esc(tr("perf.updated")) + " " + (data.last_updated ? fmtDate(data.last_updated) : "—") + " · " + esc(tr("perf.disclaimer")) + "</p>";
  }

  document.addEventListener("langchange", render);
  fetch("data/performance.json?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) { data = j; render(); })
    .catch(function () { failed = true; render(); });
})();
