// Operações fechadas — lê data/trades-fechados.json (gerado pelo TT Journal) e desenha a lista.
// Regra: só mostra o que está no arquivo (ativo, datas, ganho/perda). Nada de valores em dólar.
(function () {
  "use strict";
  var PAGE = 10;
  var AUDIT_URL = window.RF_AUDIT_URL || "";   // definido em main.js
  var data = null, failed = false, filter = "all", shown = PAGE;

  function lang() { return (document.documentElement.lang || "pt").indexOf("pt") === 0 ? "pt" : "en"; }
  function tr(k) { var d = (window.I18N || {})[lang()] || {}; return d[k] || k; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  function fmtDate(iso) {
    var p = String(iso).slice(0, 10).split("-");
    if (p.length !== 3) return esc(iso);
    return lang() === "pt" ? p[2] + "/" + p[1] + "/" + p[0] : p[1] + "/" + p[2] + "/" + p[0];
  }
  function fmtP(v) {
    if (typeof v !== "number" || !isFinite(v)) return "—";
    var s = Math.abs(v).toFixed(1); if (lang() === "pt") s = s.replace(".", ",");
    return (v > 0 ? "+" : v < 0 ? "−" : "") + s + "%";
  }
  function days(a, b) {
    var x = String(a).slice(0, 10).split("-"), y = String(b).slice(0, 10).split("-");
    if (x.length !== 3 || y.length !== 3) return null;
    return Math.round((Date.UTC(+y[0], +y[1] - 1, +y[2]) - Date.UTC(+x[0], +x[1] - 1, +x[2])) / 86400000);
  }
  function fmtDur(n) {
    if (n === null || n < 0) return "—";
    if (n === 0) return tr("tr.dur.same");
    return n + " " + tr(n === 1 ? "tr.dur.one" : "tr.dur.many");
  }
  function fmtN(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang() === "pt" ? "." : ","); }
  function pct(a, b) { var s = (100 * a / b).toFixed(1); return lang() === "pt" ? s.replace(".", ",") : s; }

  function render() {
    var root = document.getElementById("tr-root");
    if (!root) return;
    if (failed) { root.innerHTML = '<p class="perf-empty">' + esc(tr("perf.unavailable")) + "</p>"; return; }
    if (!data || !Array.isArray(data.trades)) return;

    var all = data.trades;
    var list = all.filter(function (t) { return filter === "all" || (filter === "win" ? t.win : !t.win); });
    var visible = list.slice(0, shown);
    var wins = all.filter(function (t) { return t.win; }).length;
    var hasRefund = all.some(function (t) { return t.refund; });

    var chips = [["all", "tr.all"], ["win", "tr.wins"], ["loss", "tr.losses"]].map(function (c) {
      return '<button type="button" class="tr-chip' + (filter === c[0] ? " is-active" : "") + '" data-f="' + c[0] + '" aria-pressed="' + (filter === c[0]) + '">' + esc(tr(c[1])) + "</button>";
    }).join("");

    var rows = visible.map(function (t) {
      return "<tr><td class=\"tr-asset\">" + esc(t.asset) + '<span class="tr-sub">' + esc(fmtDur(days(t.opened, t.closed))) + '</span></td><td>' + fmtDate(t.opened) + '</td><td>' + fmtDate(t.closed) + '</td><td class="tr-dur">' + esc(fmtDur(days(t.opened, t.closed))) + '</td><td class="tr-pct ' + (typeof t.pct === "number" ? (t.pct >= 0 ? "is-win" : "is-loss") : "") + '">' + fmtP(t.pct) + '</td><td><span class="tr-res ' + (t.win ? "is-win" : "is-loss") + '">' + esc(tr(t.win ? "tr.win" : "tr.loss")) + "</span>" +
        (t.refund ? '<span class="tr-tag">' + esc(tr("tr.refund")) + "</span>" : "") + "</td></tr>";
    }).join("");

    var table = visible.length
      ? '<div class="tr-wrap"><table class="tr-table"><thead><tr><thead><tr><th>' + esc(tr("tr.col.asset")) + "</th><th>" + esc(tr("tr.col.opened")) + "</th><th>" + esc(tr("tr.col.closed")) + "</th><th>" + esc(tr("tr.col.dur")) + "</th><th>" + esc(tr("tr.col.pct")) + "</th><th>" + esc(tr("tr.col.result")) + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>"
      : '<div class="tr-wrap"><p class="tr-empty">' + esc(tr("tr.empty")) + "</p></div>";

    var more = "";
    if (list.length > PAGE) {
      more = shown < list.length
        ? '<button type="button" class="tr-more" data-more="1">' + esc(tr("tr.more")) + " (" + (list.length - shown) + ")</button>"
        : '<button type="button" class="tr-more" data-more="0">' + esc(tr("tr.less")) + "</button>";
    }

    var summary = esc(tr("tr.showing")) + " " + visible.length + " " + esc(tr("tr.of")) + " " + list.length + " · " +
      fmtN(all.length) + " " + esc(tr("tr.count")) + ", " + wins + " " + esc(tr("tr.winrate")) + " (" + pct(wins, all.length) + "%)";

    root.innerHTML =
      '<div class="tr-bar"><div class="tr-chips" role="group">' + chips + '</div><p class="tr-summary">' + summary + "</p></div>" +
      table + more +
      '<p class="tr-foot">' + esc(tr("tr.upto")) + ": " + (data.last_closed ? fmtDate(data.last_closed) : "—") + " · " + esc(tr(AUDIT_URL ? "tr.foot.audit" : "tr.foot")) +
      "<span>" + esc(tr("tr.durnote")) + "</span><span>" + esc(tr("tr.pctnote")) + "</span>" + (hasRefund ? "<span>" + esc(tr("tr.refundnote")) + "</span>" : "") + "</p>" +
      (AUDIT_URL ? '<p class="tr-audit"><strong>' + esc(tr("tr.audit.k")) + "</strong> " + esc(tr("tr.audit.text")) + ' <a href="' + esc(AUDIT_URL) + '" target="_blank" rel="noopener noreferrer">' + esc(tr("tr.audit.link")) + " →</a></p>" : "");
  }

  document.addEventListener("click", function (e) {
    var chip = e.target.closest && e.target.closest(".tr-chip");
    if (chip) { filter = chip.getAttribute("data-f"); shown = PAGE; render(); return; }
    var more = e.target.closest && e.target.closest(".tr-more");
    if (more) { shown = more.getAttribute("data-more") === "1" ? shown + PAGE * 2 : PAGE; render(); }
  });
  document.addEventListener("langchange", render);
  fetch("data/trades-fechados.json?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) { data = j; render(); })
    .catch(function () { failed = true; render(); });
})();
