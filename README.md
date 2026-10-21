# Anna Valente — Portfólio de fotografia

Landing page estática (HTML + CSS + JS puro, sem build). GSAP + ScrollTrigger + Flip e Lenis vêm por CDN.

## Rodar

Abra com qualquer servidor estático, por exemplo:

```bash
node .claude/serve.mjs .
```

Depois acesse http://localhost:5173. Para publicar, suba a pasta inteira (Netlify, Vercel, GitHub Pages, hospedagem comum).

## Estrutura

```
index.html      estrutura, textos fixos (hero, manifesto, sobre), SEO e Schema.org
css/styles.css  design system (tokens em :root) e todas as seções
js/config.js    DADOS: contatos, fotos, categorias, pacotes, depoimentos, números
js/main.js      renderização, animações e interações
favicon.svg     monograma
```

## Como personalizar

**Fotos.** Edite `js/config.js`. Cada foto aceita um ID do Unsplash (a parte depois de `photo-` na URL) ou um caminho próprio, como `"img/casamento-01.jpg"`. Defina `ratio` como `"4/5"`, `"3/2"` ou `"1/1"` e escreva um `alt` descritivo. Para usar suas fotos, coloque-as em `img/` em WebP, com cerca de 1600 px no lado maior.

**Categorias.** Adicione ou remova itens em `categories` e use o mesmo `id` no campo `cat` de cada foto. Os filtros e as contagens são gerados sozinhos.

**Contatos.** Edite `brand` (nome, cidade, WhatsApp só com dígitos, Instagram, e-mail e horário de atendimento em `hours`). Isso atualiza todos os links do site.

**Perguntas frequentes.** Edite a lista `faq` (pergunta `q` e resposta `a`).

**Celular.** No celular, o portfólio mostra 8 fotos e um botão "Ver todas" (o número está em `MOBILE_LIMIT`, no `js/main.js`). Os pacotes viram carrossel e uma barra fixa com "Agendar" e WhatsApp aparece depois do hero.

**Cores e fontes.** Altere as variáveis em `:root`, no topo de `css/styles.css`. Use `--accent-ink` quando o destaque for texto sobre fundo claro (ela mantém o contraste AA).

**Textos fixos.** O hero, o manifesto e o "Sobre" ficam direto no `index.html`.

**SEO.** Atualize `<title>`, `description`, `og:*`, `canonical` e o bloco JSON-LD no `<head>` do `index.html`. Esses dados não são lidos do config, para que os buscadores os encontrem sem precisar executar JavaScript.

**Formulário.** Hoje ele valida os campos, mostra a mensagem de sucesso e oferece "Enviar pelo WhatsApp" com o texto já preenchido. Para receber os pedidos por e-mail, troque o `setTimeout` marcado com `INTEGRAÇÃO` em `js/main.js` por um `fetch` para o Formspree, o Netlify Forms ou o seu backend.
