# rafael-felizola

Site pessoal de Rafael Felizola, trader. Bilíngue (PT/EN), estático, publicado no GitHub Pages.

## Regras do projeto

- Rendimentos **só em porcentagem**. Nunca valores em dólar, saldo ou tamanho de posição.
- **Fidelidade total aos dados**: nenhum número de rendimento, GEX, POP, ATR etc. é inventado ou calculado no site.
- O aviso **"Resultados passados não garantem resultados futuros. Não é recomendação de investimento."** aparece no rodapé de todas as páginas e na seção Rendimentos.
- Construção aos poucos, uma parte por vez, com pré-visualização antes de seguir.

## Estrutura

```
index.html                 página única (seções abaixo)
assets/css/style.css       visual: fundo #0a0e14, dourado #c9a227, DM Sans + JetBrains Mono
assets/js/main.js          textos PT/EN (window.I18N), troca de idioma, menu mobile
assets/js/performance.js   desenha Rendimentos a partir de data/performance.json
data/performance.json      dados reais (gerado pelo TT Journal) — único arquivo a atualizar
gex/index.html             Mercúrio (painel de GEX do MyGex) — lê gex/data/atual.json
gex/data/atual.json        última rodada do MyGex (gravada pelo bot)
scripts/gerar_performance.py     gera o performance.json pelo TT Journal (com --api baixa da tastytrade)
scripts/validate_performance.py  valida o performance.json antes de publicar
scripts/atualizar-mercurio.ps1   roda o MyGex e entrega o atual.json ao site (via Google Drive)
scripts/teste_mercurio.py        teste do Mercúrio sem credenciais (refaz a última rodada pela coleta gravada)
BOT.md                     instruções para o Grok bot (rendimentos e GEX)
.nojekyll                  GitHub Pages serve os arquivos como estão
```

## Seções

1. **Início** (`#hero`): eyebrow "Especulação financeira", tagline, botão principal "Mercúrio".
2. **Sobre** (`#about`): bio adiada (selo "Bio completa em breve").
3. **Mercados** (`#markets`): "Onde especulo" — Opções (US), Ações & ETFs, Futuros.
4. **Rendimentos** (`#performance`): acumulado do ano sobre a margem utilizada, trades fechados, taxa de acerto, gráfico mês a mês, "Como é calculado".
5. **Insights** (`#insights`): textos de exemplo marcados como "Amostra".
6. **Contato** (`#contact`): e-mail provisório.
7. **Mercúrio (Gestor de GEX)** (`gex/`).
8. **Área do aluno**: botão no topo que leva ao servidor Discord JRBFT (`window.SITE.studentUrl` em `assets/js/main.js`; vazio = leva a Contato).

## Contrato do `data/performance.json`

O site lê apenas estes campos (os demais são ignorados):

| Campo | Uso |
|---|---|
| `ytd_return_on_margin_pct` | número grande "No ano" (mostrado com 1 casa decimal) |
| `ytd_closed_trades` | trades fechados no ano |
| `ytd_win_rate_pct` | taxa de acerto |
| `period.start`, `period.end` | período exibido; o mês de `end` é marcado `*` se `notes` contiver "parcial" |
| `monthly[]` → `month` (AAAA-MM), `return_on_margin_pct`, `closed_trades` | gráfico; `closed_trades = 0` aparece como "—" |
| `method.name/numerator/denominator/monthly/ytd/excluded` | "Como é calculado" (PT vem do arquivo; EN é tradução fixa em performance.js) |
| `account_label` | linha "Tastytrade (conta pessoal)" |
| `last_updated` | "Atualizado em" |

Para atualizar os rendimentos basta substituir esse arquivo e publicar — não é preciso mexer no código.
Se o arquivo não carregar, a seção mostra "Dados indisponíveis no momento" (nunca números antigos embutidos).

## Onde roda

O projeto é desenvolvido aqui e copiado para o Grok bot do Rafael, que executa duas tarefas: atualizar `data/performance.json` (TT Journal) e atualizar `gex/` (MyGex). Ver `BOT.md`.

## Publicação

- Repo: `felizolarafael-bot/rafael-felizola` (privado até o site ficar pronto).
- Depois: tornar público e ativar Pages em **Settings → Pages → Deploy from branch → main / (root)**.

## Pendente

- Bio, e-mail definitivo de contato, textos reais de Insights.
- Atualização automática dos rendimentos (TT Journal, dias úteis às 18:28).
- Subir as mudanças ao GitHub e ativar o Pages.
