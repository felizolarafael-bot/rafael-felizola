// Calendario economico dos EUA: proximo grande evento em destaque e os seguintes em lista.
// Datas copiadas das agendas oficiais (Fed, BLS, BEA, NYSE) em data/agenda-eua.json; horarios de Fortaleza
// (UTC-3, sem horario de verao). Sem script de terceiros.
(function () {
  "use strict";
  var nextBox = document.getElementById("cal-next");
  var agenda = null;

  function isEn() { return (document.documentElement.lang || "pt").indexOf("en") === 0; }
  function tr(k) { var d = (window.I18N || {})[isEn() ? "en" : "pt"] || {}; return d[k] || k; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  function info(tip) { return ' <span class="info" tabindex="0" role="button" aria-label="' + esc(tip) + '" data-tip="' + esc(tip) + '">i</span>'; }
  function evTip(k) { var t = tr("cal.tip." + k); return t === "cal.tip." + k ? "" : info(t); }
  function srcLink(x) { return x.url ? '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.src) + "</a>" : esc(x.src); }
  function expRows(items) {
    var out = "";
    items.forEach(function (e) {
      if (e.prev) out += "<p><span>" + esc(tr("cal.prev")) + ":</span> " + esc(isEn() ? e.prev.en : e.prev.pt) + ' <span class="cal-exp-src">(' + srcLink(e.prev) + ")</span></p>";
      if (e.exp) out += "<p><span>" + esc(tr("cal.exp")) + info(tr("cal.expTip")) + ":</span> " + esc(isEn() ? e.exp.en : e.exp.pt) + ' <span class="cal-exp-src">(' + srcLink(e.exp) + ")</span></p>";
    });
    return out ? '<div class="cal-exp">' + out + "</div>" : "";
  }

  var MPT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  var MEN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WPT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var WEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var FOR = -3 * 3600 * 1000; // Fortaleza: UTC-3 o ano todo

  function local(ms) { return new Date(ms + FOR); } // ler com getUTC*
  function dayKey(ms) { var d = local(ms); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); }

  function fmtDay(ms) {
    var d = local(ms), en = isEn();
    return en ? WEN[d.getUTCDay()] + ", " + MEN[d.getUTCMonth()] + " " + d.getUTCDate()
              : WPT[d.getUTCDay()] + ", " + d.getUTCDate() + " " + MPT[d.getUTCMonth()];
  }
  function fmtTime(ms) {
    var d = local(ms), h = d.getUTCHours(), m = d.getUTCMinutes();
    if (isEn()) { var ap = h >= 12 ? "pm" : "am", h12 = h % 12 || 12; return h12 + ":" + (m < 10 ? "0" : "") + m + " " + ap; }
    return h + "h" + (m ? (m < 10 ? "0" : "") + m : "");
  }
  function fmtRef(k, ref) {
    if (!ref) return "";
    var en = isEn(), q = /^(\d{4})Q(\d)-(\d)$/.exec(ref);
    if (q) {
      var est = tr("cal.est" + q[3]);
      return en ? "Q" + q[2] + " " + q[1] + ", " + est : q[2] + "º tri/" + q[1] + ", " + est;
    }
    var m = /^(\d{4})-(\d{2})$/.exec(ref);
    if (!m) return "";
    return tr("cal.ref") + " " + (en ? MEN[+m[2] - 1] + " " + m[1] : MPT[+m[2] - 1] + "/" + m[1]);
  }
  function countdown(ms, now) {
    var n = Math.round((dayKey(ms) - dayKey(now)) / 86400000);
    if (n <= 0) return tr("cal.today");
    if (n === 1) return tr("cal.tomorrow");
    return tr("cal.inDays").replace("{n}", n);
  }

  function isMkt(e) { return e.k === "closed" || e.k === "early"; }
  function hol(e) { return tr("cal.h." + e.h); }
  function evName(e) {
    if (e.k === "closed") return tr("cal.closed") + " · " + hol(e);
    if (e.k === "early") return tr("cal.early") + " · " + hol(e);
    return tr("cal.ev." + e.k);
  }

  // Agrupa eventos no mesmo horario (ex.: PIB + PCE)
  function upcoming(now) {
    var list = (agenda && agenda.events) || [], groups = [];
    for (var i = 0; i < list.length; i++) {
      var e = list[i], ms = Date.parse(e.t);
      if (!(ms > now)) continue;
      var g = groups[groups.length - 1];
      if (g && g.ms === ms) g.items.push(e); else groups.push({ ms: ms, items: [e] });
    }
    return groups;
  }

  // Aviso de bolsa fechada ou pregao reduzido hoje e amanha
  function marketStatus(now) {
    var list = (agenda && agenda.events) || [], today = dayKey(now), out = [], shown = {};
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (!isMkt(e)) continue;
      var ms = Date.parse(e.t), n = Math.round((dayKey(ms) - today) / 86400000);
      if (n !== 0 && n !== 1) continue;
      var txt = e.k === "closed" ? tr("cal.st.closed").replace("{h}", hol(e))
                                 : tr("cal.st.early").replace("{t}", fmtTime(ms)).replace("{h}", hol(e));
      out.push('<p class="cal-mkt-st"><b>' + esc(tr(n === 0 ? "cal.Today" : "cal.Tomorrow")) + ":</b> " + esc(txt) + "</p>");
      shown[e.t] = true;
    }
    return { html: out.join(""), shown: shown };
  }

  function renderNext() {
    if (!nextBox) return;
    var now = Date.now(), groups = upcoming(now), st = marketStatus(now);
    var hi = -1;
    for (var i = 0; i < groups.length; i++) { if (!groups[i].items.some(isMkt)) { hi = i; break; } }
    if (hi < 0 && !st.html) { nextBox.hidden = true; return; }
    var main = "";
    if (hi >= 0) {
      var g = groups[hi];
      var names = g.items.map(function (e) {
        var r = fmtRef(e.k, e.ref);
        return '<span class="cal-next-ev"><b>' + esc(tr("cal.ev." + e.k)) + "</b>" + evTip(e.k) + (r ? ' <span class="cal-next-ref">' + esc(r) + "</span>" : "") + "</span>";
      }).join("");
      var tent = g.items.some(function (e) { return e.tent; });
      main = '<div class="cal-next-main">' +
          '<p class="cal-next-tag">' + esc(tr("cal.next")) + "</p>" +
          '<div class="cal-next-names">' + names + "</div>" +
          '<p class="cal-next-when">' + esc(fmtDay(g.ms)) + " · " + esc(fmtTime(g.ms)) + " " + esc(tr("cal.tz")) +
            (tent ? ' <span class="cal-next-tent">' + esc(tr("cal.tent")) + "</span>" : "") + "</p>" +
          expRows(g.items) +
        "</div>" +
        '<p class="cal-next-cd">' + esc(countdown(g.ms, now)) + "</p>";
    }
    // Lista: datas seguintes (economicas e da bolsa), ate 6 eventos economicos
    var rows = [], econ = 0;
    for (var k = 0; k < groups.length && econ < 6; k++) {
      if (k === hi) continue;
      var x = groups[k], mkt = x.items.some(isMkt);
      if (mkt && x.items.every(function (e) { return st.shown[e.t]; })) continue;
      if (!mkt) econ++;
      var t = x.items.some(function (e) { return e.tent; });
      var hcol = mkt ? (x.items[0].k === "closed" ? tr("cal.allday") : tr("cal.until").replace("{t}", fmtTime(x.ms))) : fmtTime(x.ms);
      rows.push('<li' + (mkt ? ' class="cal-mkt"' : "") + '><span class="cal-next-d">' + esc(fmtDay(x.ms)) + '</span><span class="cal-next-h">' + esc(hcol) + "</span>" +
        '<span class="cal-next-n">' + x.items.map(function (e) { return esc(evName(e)) + (isMkt(e) ? "" : evTip(e.k)); }).join(" + ") +
        (t ? ' <span class="cal-next-tent">' + esc(tr("cal.tent")) + "</span>" : "") + "</span></li>");
    }
    nextBox.innerHTML = (st.html ? '<div class="cal-mkt-box">' + st.html + "</div>" : "") + main +
      (rows.length ? '<div class="cal-next-after"><p class="cal-next-tag">' + esc(tr("cal.after")) + "</p><ul>" + rows.join("") + "</ul></div>" : "");
    nextBox.hidden = false;
  }

  if (nextBox) {
    fetch("data/agenda-eua.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { agenda = j; renderNext(); })
      .catch(function () { nextBox.hidden = true; });
    setInterval(renderNext, 60000);
  }

  document.addEventListener("langchange", renderNext);
})();
