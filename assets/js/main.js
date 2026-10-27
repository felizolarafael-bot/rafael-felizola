// Rafael Felizola — textos PT/EN, troca de idioma e menu mobile

// Pasta pública do Drive com os extratos mensais oficiais com tarja (conta, endereço, valores, quantidades e lado cobertos).
// Usada em Operações fechadas. Vazio = o bloco de auditoria não aparece.
window.RF_AUDIT_URL = "https://drive.google.com/drive/folders/1Cc-D598cm-1_Dpe0Q3MGeW-MrhiNZyLO";

window.I18N = {
  pt: {
    "skip": "Ir para o conteúdo",
    "nav.about": "Sobre",
    "nav.markets": "Mercados",
    "nav.perf": "Rendimentos",
    "nav.gex": "Mercúrio",
    "nav.contact": "Contato",
    "hero.eyebrow": "Especulação financeira",
    "hero.tagline": "Onde a aposta termina.",
    "hero.cta_gex": "Mercúrio",
    "hero.cta_primary": "Ver abordagem",
    "hero.cta_secondary": "Contato",
    "hero.m1": "Opções US",
    "hero.m2": "Ações & ETFs",
    "about.eyebrow": "Sobre",
    "about.title": "Conhecimento prático acima de narrativa",
    "about.lead": "João Rafael Bezerra Felizola Torres é advogado, formado pela Universidade Estadual Vale do Acaraú, com atuação profissional em mais de 1.400 processos em diversas áreas do Direito público e privado.",
    "about.p2": "Atua no mercado financeiro desde 2015, quando fez sua primeira operação em bolsa. Só entre 2019 e 2026 realizou mais de 3.700 trades, que se desdobraram em mais de 32 mil negócios. Trata a especulação financeira como ofício, com método, lógica, psicologia, números e gestão.",
    "about.p3": "É autor do livro <em>Especular é Preciso: quando a sorte muda de lado</em>, obra que retrata sua visão de mercado.",
    "markets.eyebrow": "Mercados & abordagem",
    "markets.title": "Onde especulo",
    "markets.lead": "Dois mercados: à vista e futuro, ambos com análise bayesiana, método e responsabilidade.",
    "markets.spot_title": "Mercado à Vista",
    "markets.spot_lead": "Ações e ETFs.",
    "markets.deriv_title": "Mercado Futuro",
    "markets.deriv_lead": "Opções.",
    "markets.opt_title": "Opções (US)",
    "markets.opt_body": "Opção é um contrato derivado de um ativo à vista que dá ao comprador o direito, e ao vendedor a obrigação, de negociar um ativo por um preço (strike) até uma data. A vantagem operacional é a flexibilidade: dá para montar posições com risco e retorno definidos ou indefinidos, ganhar com alta, queda ou lateralização, usar o tempo a favor ao vender prêmio, proteger uma carteira etc. Em contrapartida, exige conhecimento, prática e método: prazo, volatilidade e margem precisam ser geridos.",
    "markets.eq_title": "Ações & ETFs",
    "markets.eq_body": "Ação é uma fração do capital de uma empresa; ETF é um fundo negociado em bolsa que replica um índice ou uma cesta de ativos (como SPY e QQQ). O ganho operacional está na simplicidade e na liquidez: spreads curtos, entrada e saída a qualquer momento do pregão, sem vencimento e sem alavancagem embutida. O ETF dá diversificação em uma única ordem. Também são o ativo-objeto das opções, base de várias estruturas.",
    "perf.eyebrow": "Rendimentos",
    "perf.title": "Resultado do ano",
    "perf.lead": "Resultado real dos meus trades fechados, só em porcentagem. Depósitos e saques não entram.",
    "perf.tab.total": "Total",
    "perf.tab.day": "Day Trade",
    "perf.tab.swing": "Swing Trade",
    "perf.onMargin": "Retorno sobre margem · trades fechados (FIFO)",
    "perf.trades": "trades fechados",
    "perf.winrate": "taxa de acerto",
    "perf.kelly": "critério de Kelly",
    "perf.kelly.tip": "Kelly = acerto − (1 − acerto) ÷ payoff, dos trades fechados do ano",
    "perf.m.kelly": "Kelly",
    "perf.noTrades": "sem trades fechados no mês",
    "perf.m.num": "Numerador",
    "perf.m.den": "Denominador",
    "perf.m.monthly": "Mensal",
    "perf.m.ytd": "No ano",
    "perf.m.excl": "Fora do cálculo",
    "perf.loading": "Carregando dados…",
    "perf.unavailable": "Dados indisponíveis no momento.",
    "perf.ytd": "No ano",
    "perf.period": "Período",
    "perf.monthly": "Mês a mês",
    "perf.partial": "parcial",
    "perf.method": "Como é calculado",
    "perf.audit.text": "Para conferir estes números, há uma pasta aberta com cópias dos extratos mensais oficiais da corretora (tastytrade / Apex Clearing), em nome do titular, com número da conta, endereço, valores, quantidades e lado da operação cobertos por tarja.",
    "perf.updated": "Atualizado em",
    "perf.disclaimer": "Resultados passados não garantem resultados futuros. Não é recomendação de investimento.",
    "nav.insights": "Artigos",
    "insights.eyebrow": "Artigos",
    "insights.title": "Pensar o mercado com precisão",
    "insights.lead": "Artigos educativos sobre mercado financeiro.",
    "nav.trades": "Operações",
    "tr.eyebrow": "Operações",
    "tr.title": "Operações fechadas",
    "tr.lead": "Cada trade fechado do ano, do mais recente ao mais antigo. Só ativo, datas, duração, ganho ou perda e o resultado em % sobre o valor de abertura.",
    "tr.all": "Todas",
    "tr.wins": "Ganhos",
    "tr.losses": "Perdas",
    "tr.col.closed": "Fechamento",
    "tr.col.asset": "Ativo",
    "tr.col.opened": "Abertura",
    "tr.col.result": "Resultado",
    "tr.win": "Ganho",
    "tr.loss": "Perda",
    "tr.refund": "Estorno",
    "tr.count": "operações",
    "tr.winrate": "ganhos",
    "tr.showing": "Mostrando",
    "tr.of": "de",
    "tr.more": "Ver mais",
    "tr.less": "Ver menos",
    "tr.empty": "Nenhuma operação neste filtro.",
    "tr.upto": "Último fechamento",
    "tr.audit.k": "Auditoria.",
    "tr.audit.text": "Para conferir estes números, há uma pasta aberta com cópias dos extratos mensais oficiais da corretora (tastytrade / Apex Clearing), em nome do titular, com número da conta, endereço, valores, quantidades e lado da operação cobertos por tarja.",
    "tr.audit.link": "Abrir a pasta de extratos",
    "tr.foot": "1 contrato = 1 trade. Resultado já com comissões e taxas. Nenhum valor em dólar, preço ou tamanho de posição. A lista fecha com o total de trades e a taxa de acerto de Rendimentos.",
    "tr.foot.audit": "1 contrato = 1 trade. Resultado já com comissões e taxas. A lista mostra só percentuais; datas, ativos e preços de cada operação estão nos extratos da pasta de auditoria. A lista fecha com o total de trades e a taxa de acerto de Rendimentos.",
    "tr.col.dur": "Duração",
    "tr.dur.same": "Mesmo dia",
    "tr.dur.one": "dia",
    "tr.dur.many": "dias",
    "tr.durnote": "Duração = dias corridos entre a abertura e o fechamento do trade.",
    "tr.col.pct": "%",
    "tr.pctnote": "% = resultado líquido do trade ÷ valor de abertura (o que entrou ou saiu ao abrir). É uma medida por operação: não é o rendimento do ano, que usa a margem como base, e não se soma. Em vendas, o máximo é +100%; perdas podem passar de −100%. Trades com estorno ficam sem %.",
    "tr.refundnote": "Estorno: trade com estorno, incluído no resultado do ano.",
    "contact.eyebrow": "Contato",
    "contact.title": "Vamos conversar",
    "contact.lead": "Para assuntos profissionais, use o e-mail abaixo.",
    "contact.email_label": "E-mail",
    "footer.disclaimer": "Resultados passados não garantem resultados futuros. Não é recomendação de investimento."
  },
  en: {
    "skip": "Skip to content",
    "nav.about": "About",
    "nav.markets": "Markets",
    "nav.perf": "Returns",
    "nav.gex": "Mercury",
    "nav.contact": "Contact",
    "hero.eyebrow": "Financial speculation",
    "hero.tagline": "Where gambling ends.",
    "hero.cta_gex": "Mercury",
    "hero.cta_primary": "See approach",
    "hero.cta_secondary": "Contact",
    "hero.m1": "U.S. options",
    "hero.m2": "Stocks & ETFs",
    "about.eyebrow": "About",
    "about.title": "Practical knowledge over narrative",
    "about.lead": "João Rafael Bezerra Felizola Torres is a lawyer, a graduate of the Universidade Estadual Vale do Acaraú, with professional experience in more than 1,400 legal cases across several areas of Public and Private Law.",
    "about.p2": "He has been active in the Financial Market since 2015, when he made his first trade on the Exchange. Between 2019 and 2026 alone, he made more than 3,700 trades, which unfolded into more than 32,000 executions. He treats Financial Speculation as a craft, with method, logic, psychology, numbers and management.",
    "about.p3": "He is the author of the book <em>Especular é Preciso: quando a sorte muda de lado</em>, a work that portrays his view of the market.",
    "markets.eyebrow": "Markets & approach",
    "markets.title": "Where I speculate",
    "markets.lead": "Two markets: spot and futures, both with Bayesian analysis, method and responsibility.",
    "markets.spot_title": "Spot Market",
    "markets.spot_lead": "Stocks and ETFs.",
    "markets.deriv_title": "Futures Market",
    "markets.deriv_lead": "Options.",
    "markets.opt_title": "U.S. options",
    "markets.opt_body": "An option is a contract derived from a spot asset that gives the buyer the right, and the seller the obligation, to trade an asset at a price (strike) up to a date. The operational edge is flexibility: positions with defined or undefined risk and return, gains in rising, falling or sideways markets, time working in your favor when selling premium, portfolio protection, and more. In return, it demands knowledge, practice and method: time, volatility and margin must be managed.",
    "markets.eq_title": "Stocks & ETFs",
    "markets.eq_body": "A stock is a fraction of a company's capital; an ETF is an exchange-traded fund that tracks an index or a basket of assets (such as SPY and QQQ). The operational edge is simplicity and liquidity: tight spreads, entry and exit at any moment of the session, no expiry and no built-in leverage. An ETF gives diversification in a single order. They are also the underlying of options, the base of many structures.",
    "perf.eyebrow": "Returns",
    "perf.title": "Year to date",
    "perf.lead": "Real results from my closed trades, percentages only. Deposits and withdrawals are excluded.",
    "perf.tab.total": "Total",
    "perf.tab.day": "Day Trade",
    "perf.tab.swing": "Swing Trade",
    "perf.onMargin": "Return on margin · closed trades (FIFO)",
    "perf.trades": "closed trades",
    "perf.winrate": "win rate",
    "perf.kelly": "Kelly criterion",
    "perf.kelly.tip": "Kelly = win rate − (1 − win rate) ÷ payoff, from the year's closed trades",
    "perf.m.kelly": "Kelly",
    "perf.noTrades": "no closed trades that month",
    "perf.m.num": "Numerator",
    "perf.m.den": "Denominator",
    "perf.m.monthly": "Monthly",
    "perf.m.ytd": "Year to date",
    "perf.m.excl": "Excluded",
    "perf.loading": "Loading data…",
    "perf.unavailable": "Data unavailable right now.",
    "perf.ytd": "Year to date",
    "perf.period": "Period",
    "perf.monthly": "Month by month",
    "perf.partial": "partial",
    "perf.method": "How it is calculated",
    "perf.audit.text": "To check these numbers, an open folder holds copies of the official monthly broker statements (tastytrade / Apex Clearing), in the account holder's name, with account number, address, amounts, quantities and trade side blacked out.",
    "perf.updated": "Updated",
    "perf.disclaimer": "Past performance does not guarantee future results. Not investment advice.",
    "nav.insights": "Articles",
    "insights.eyebrow": "Articles",
    "insights.title": "Thinking about the market with precision",
    "insights.lead": "Educational articles on the Financial Market.",
    "nav.trades": "Trades",
    "tr.eyebrow": "Trades",
    "tr.title": "Closed trades",
    "tr.lead": "Every closed trade of the year, newest first. Only the underlying, dates, duration, win or loss, and the result as a % of the opening value.",
    "tr.all": "All",
    "tr.wins": "Wins",
    "tr.losses": "Losses",
    "tr.col.closed": "Closed",
    "tr.col.asset": "Underlying",
    "tr.col.opened": "Opened",
    "tr.col.result": "Result",
    "tr.win": "Win",
    "tr.loss": "Loss",
    "tr.refund": "Refund",
    "tr.count": "trades",
    "tr.winrate": "wins",
    "tr.showing": "Showing",
    "tr.of": "of",
    "tr.more": "Show more",
    "tr.less": "Show less",
    "tr.empty": "No trades in this filter.",
    "tr.upto": "Last close",
    "tr.audit.k": "Audit.",
    "tr.audit.text": "To check these numbers, an open folder holds copies of the official monthly broker statements (tastytrade / Apex Clearing), in the account holder's name, with account number, address, amounts, quantities and trade side blacked out.",
    "tr.audit.link": "Open the statements folder",
    "tr.foot": "1 contract = 1 trade. Result is net of commissions and fees. No dollar amounts, prices or position size. The list matches the trade count and win rate under Returns.",
    "tr.foot.audit": "1 contract = 1 trade. Result is net of commissions and fees. The list shows percentages only; dates, symbols and prices of each trade are in the statements in the audit folder. The list matches the trade count and win rate under Returns.",
    "tr.col.dur": "Duration",
    "tr.dur.same": "Same day",
    "tr.dur.one": "day",
    "tr.dur.many": "days",
    "tr.durnote": "Duration = calendar days between the trade's opening and closing.",
    "tr.col.pct": "%",
    "tr.pctnote": "% = net result of the trade ÷ opening value (cash in or out at entry). It is a per-trade measure: not the year's return, which uses margin as its base, and it does not add up. On short options the maximum is +100%; losses can exceed −100%. Refunded trades have no %.",
    "tr.refundnote": "Refund: trade with a refund, included in the year's result.",
    "contact.eyebrow": "Contact",
    "contact.title": "Let's talk",
    "contact.lead": "For professional matters, use the email below.",
    "contact.email_label": "Email",
    "footer.disclaimer": "Past performance does not guarantee future results. Not investment advice."
  }
};

(function () {
  "use strict";
  var STORAGE_KEY = "rf-lang";

  function getPreferredLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "pt" || stored === "en") return stored;
    } catch (_) {}
    return "pt";
  }

  function setLang(lang) {
    var dict = window.I18N[lang];
    if (!dict) return;
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, key)) { if (el.hasAttribute("data-i18n-html")) el.innerHTML = dict[key]; else el.textContent = dict[key]; }
    });
    document.querySelectorAll(".lang-btn, .lang-btn-text").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      if (btn.classList.contains("lang-btn")) btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  function initMobileNav() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.getElementById("mobile-nav");
    if (!toggle || !panel) return;
    function close() { toggle.setAttribute("aria-expanded", "false"); panel.hidden = true; }
    function open() { toggle.setAttribute("aria-expanded", "true"); panel.hidden = false; }
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") close(); else open();
    });
    panel.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang")); });
  });
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
  initMobileNav();
  setLang(getPreferredLang());
})();
