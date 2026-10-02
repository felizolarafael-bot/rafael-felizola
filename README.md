# Site pessoal — Rafael Felizola

Site estático bilingue (PT-BR + EN) de autoridade profissional para trader.
Sem backend, sem serviços pagos. Pronto para hospedar de graça no **GitHub Pages** (ou Cloudflare Pages).

## Estrutura

```
rafael-felizola-site/
├── index.html          # Página única
├── css/styles.css      # Visual dark / trading
├── js/i18n.js          # Textos PT e EN
├── js/main.js          # Troca de idioma + menu mobile
└── README.md           # Este arquivo
```

## Pré-visualizar localmente

Qualquer uma destas opções:

```bash
# Opção 1 — abrir o arquivo no navegador
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# Opção 2 — servidor local simples (recomendado)
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

Troque o idioma com os botões **PT | EN** no topo (sem recarregar a página). A preferência fica salva no navegador (`localStorage`).

## Personalizar antes de publicar

1. **E-mail** — em `index.html`, busque `contact@rafaelfelizola.com` e troque pelo endereço real (também no `mailto:`).
2. **Bio / textos** — edite as strings em `js/i18n.js` (objetos `pt` e `en`) para manter os dois idiomas alinhados.
3. **Insights** — os três cards estão marcados como **Amostra / Sample**. Substitua títulos e textos pelos seus artigos reais (ou remova a seção).
4. **Newsletter** — o formulário está desabilitado de propósito. Para ativar, conecte um serviço gratuito (Buttondown, Mailchimp free, etc.) e remova o atributo `disabled`.

## Publicar de graça no GitHub Pages

### 1. Criar o repositório

1. Acesse [github.com/new](https://github.com/new).
2. Nome sugerido: `rafael-felizola` ou `rafaelfelizola.github.io`.
3. Deixe **público** (necessário para Pages gratuito em contas pessoais sem GitHub Pro).
4. Não precisa adicionar README/licença se for subir esta pasta.

### 2. Enviar os arquivos

No terminal, dentro desta pasta:

```bash
git init
git add .
git commit -m "Site inicial Rafael Felizola"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

Substitua `SEU_USUARIO` e `SEU_REPO` pelos seus dados.

### 3. Ativar o GitHub Pages

1. No repositório: **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Branch: **main**, pasta: **/ (root)**.
4. Salve. Em 1–2 minutos o site estará em:

   `https://SEU_USUARIO.github.io/SEU_REPO/`

Se o repositório se chamar `SEU_USUARIO.github.io`, o site fica na raiz:
`https://SEU_USUARIO.github.io/`

### 4. Domínio próprio (opcional, depois)

Em **Settings → Pages → Custom domain**, informe o domínio (ex.: `rafaelfelizola.com`) e configure os DNS no registrador conforme as instruções do GitHub. Isso continua gratuito no Pages.

## Alternativa: Cloudflare Pages (também grátis)

1. Crie conta em [pages.cloudflare.com](https://pages.cloudflare.com).
2. Conecte o mesmo repositório GitHub.
3. Build: deixe vazio (site estático). Output directory: `/` ou `.`
4. Deploy.

## O que este site NÃO faz

- Não inventa P&L, win rate ou credenciais.
- Não reivindica afiliação a corretoras.
- Não vende mentoria com hard-sell (só autoridade + contato suave).

## Licença / uso

Conteúdo e código feitos para uso pessoal de Rafael Felizola. Ajuste à vontade.
