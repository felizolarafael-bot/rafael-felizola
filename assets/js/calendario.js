// Calendario economico dos EUA: proximo grande evento em destaque e os seguintes em lista.
// Datas copiadas das agendas oficiais (Fed, BLS, BEA) em data/agenda-eua.json; horarios de Fortaleza
// (UTC-3, sem horario de verao). Sem script de terceiros.
(function () {
  "use strict";
  var nextBox = document.getElementById("cal-next");
  var agenda = null;

  function isEn() { return (document.documentElement.lang || "pt").indexOf("en") === 0; }
  function tr(k) { var d = (window.I18N || {})[isEn() ? "en" : "pt"] || {}; return d[k] || k; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }

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

  function renderNext() {
    if (!nextBox) return;
    var now = Date.now(), groups = upcoming(now);
    if (!groups.length) { nextBox.hidden = true; return; }
    var g = groups[0];
    var names = g.items.map(function (e) {
      var r = fmtRef(e.k, e.ref);
      return '<span class="cal-next-ev"><b>' + esc(tr("cal.ev." + e.k)) + "</b>" + (r ? ' <span class="cal-next-ref">' + esc(r) + "</span>" : "") + "</span>";
    }).join("");
    var tent = g.items.some(function (e) { return e.tent; });
    var rest = groups.slice(1, 7).map(function (x) {
      var t = x.items.some(function (e) { return e.tent; });
      return '<li><span class="cal-next-d">' + esc(fmtDay(x.ms)) + '</span><span class="cal-next-h">' + esc(fmtTime(x.ms)) + "</span>" +
        '<span class="cal-next-n">' + esc(x.items.map(function (e) { return tr("cal.ev." + e.k); }).join(" + ")) +
        (t ? ' <span class="cal-next-tent">' + esc(tr("cal.tent")) + "</span>" : "") + "</span></li>";
    }).join("");
    nextBox.innerHTML =
      '<div class="cal-next-main">' +
        '<p class="cal-next-tag">' + esc(tr("cal.next")) + "</p>" +
        '<div class="cal-next-names">' + names + "</div>" +
        '<p class="cal-next-when">' + esc(fmtDay(g.ms)) + " · " + esc(fmtTime(g.ms)) + " " + esc(tr("cal.tz")) +
          (tent ? ' <span class="cal-next-tent">' + esc(tr("cal.tent")) + "</span>" : "") + "</p>" +
      "</div>" +
      '<p class="cal-next-cd">' + esc(countdown(g.ms, now)) + "</p>" +
      (rest ? '<div class="cal-next-after"><p class="cal-next-tag">' + esc(tr("cal.after")) + '</p><ul>' + rest + "</ul></div>" : "");
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
