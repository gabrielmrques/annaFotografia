/* ==========================================================================
   ANNA VALENTE — interações e animações
   Organização:
     1. Utilitários e imagens
     2. Renderização a partir do config.js
     3. Smooth scroll (Lenis) + header + progresso
     4. Preloader e intro do hero
     5. Animações de scroll (reveal, clip, parallax, manifesto, números…)
     6. Portfólio: filtros (FLIP) + lightbox
     7. Galeria horizontal, depoimentos, cursor, botão magnético
     8. Formulário
   ========================================================================== */
(() => {
  "use strict";

  const S = window.SITE;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = Boolean(window.gsap && window.ScrollTrigger);
  const EASE = "expo.out"; // equivalente a cubic-bezier(0.22, 1, 0.36, 1)

  document.documentElement.classList.add("js");
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger, ...(window.Flip ? [Flip] : []));

  /* ------------------------------------------------------------------
     1. UTILITÁRIOS E IMAGENS
     ------------------------------------------------------------------ */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const ratioOf = (r = "4/5") => { const [w, h] = String(r).split("/").map(Number); return w / (h || 1); };
  const isUnsplash = (src) => /^\d{10,}-[\w-]+$/.test(src);

  /** URL de imagem. IDs do Unsplash viram URLs com corte e formato automático (WebP/AVIF). */
  function imgUrl(src, w, ratio) {
    if (!isUnsplash(src)) return src;
    const h = ratio ? `&h=${Math.round(w / ratio)}` : "";
    return `https://images.unsplash.com/photo-${src}?w=${w}${h}&q=75&auto=format&fit=crop`;
  }
  function imgSrcset(src, widths, ratio) {
    if (!isUnsplash(src)) return "";
    return widths.map((w) => `${imgUrl(src, w, ratio)} ${w}w`).join(", ");
  }
  /** Gera <img> responsivo com width/height (evita CLS) e fade ao carregar. */
  function imgTag({ src, alt = "", ratio, sizes = "100vw", widths = [480, 800, 1200, 1600], lazy = true, cls = "" }) {
    const r = ratio ? ratioOf(ratio) : null;
    const w = 1200, h = r ? Math.round(w / r) : 800;
    const set = imgSrcset(src, widths, r);
    return `<img class="${cls}" src="${imgUrl(src, 800, r)}" ${set ? `srcset="${set}" sizes="${sizes}"` : ""}
      alt="${esc(alt)}" width="${w}" height="${h}" ${lazy ? 'loading="lazy"' : ""} decoding="async" data-fade>`;
  }
  /** Miniatura minúscula usada como placeholder borrado (blur-up). */
  const lqip = (src, ratio) => (isUnsplash(src) ? `url('${imgUrl(src, 24, ratio ? ratioOf(ratio) : null)}&q=30')` : "none");

  function watchImageLoads(root = document) {
    $$("img[data-fade]", root).forEach((img) => {
      const done = () => img.classList.add("is-loaded");
      if (img.complete && img.naturalWidth) done();
      else img.addEventListener("load", done, { once: true });
    });
  }

  /* ------------------------------------------------------------------
     2. RENDERIZAÇÃO
     ------------------------------------------------------------------ */
  const B = S.brand;
  const waLink = (msg = B.whatsappMessage) => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(msg)}`;
  const catLabel = (id) => (S.categories.find((c) => c.id === id) || {}).label || id;

  function renderBrand() {
    $$("[data-brand]").forEach((el) => { const v = B[el.dataset.brand]; if (v != null) el.textContent = v; });
    const links = { whatsapp: waLink(), instagram: `https://instagram.com/${B.instagram}`, email: `mailto:${B.email}` };
    $$("[data-link]").forEach((a) => { if (links[a.dataset.link]) a.href = links[a.dataset.link]; });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    $$("[data-rating='score']").forEach((el) => (el.textContent = S.rating.score));
    $("[data-rating='text']").textContent = `em ${S.rating.count} avaliações no ${S.rating.source}`;
    // lista duplicada (aria-hidden) para o loop contínuo no celular
    $("[data-press]").innerHTML = S.press.map((p) => `<li>${esc(p)}</li>`).join("") + S.press.map((p) => `<li aria-hidden="true">${esc(p)}</li>`).join("");

    // Hero: só troca se o config apontar para outra foto
    const hero = $("[data-hero-img]");
    if (!hero.src.includes(S.hero.src)) {
      hero.src = imgUrl(S.hero.src, 1440);
      hero.srcset = imgSrcset(S.hero.src, [828, 1440, 2200]);
    }
    hero.alt = S.hero.alt;
    // placeholder borrado enquanto a foto grande carrega
    $("[data-hero-media]").style.background = `#3a3835 ${lqip(S.hero.src)} center / cover`;
  }

  function renderManifesto() {
    $("[data-manifesto-floats]").innerHTML = S.manifesto.map((m, i) => `
      <figure class="manifesto__float" data-speed="${i ? 0.25 : -0.35}">
        ${imgTag({ src: m.src, alt: m.alt, ratio: m.ratio, sizes: "15vw", widths: [240, 400] })}
      </figure>`).join("");
  }

  const MOBILE_LIMIT = 8; // fotos visíveis no celular antes de "Ver todas"

  function renderPortfolio() {
    const counts = S.categories.map((c) => S.portfolio.filter((p) => p.cat === c.id).length);
    const filters = [{ id: "all", label: "Todos", n: S.portfolio.length }, ...S.categories.map((c, i) => ({ ...c, n: counts[i] }))];
    $("[data-filters]").insertAdjacentHTML("afterbegin", filters.map((f, i) => `
      <button class="filter" role="tab" aria-selected="${i === 0}" aria-controls="grid" data-filter="${f.id}">
        ${esc(f.label)}<sup>${pad(f.n)}</sup>
      </button>`).join(""));

    const grid = $("[data-grid]");
    grid.id = "grid";
    grid.innerHTML = S.portfolio.map((p, i) => `
      <li class="card${i >= MOBILE_LIMIT ? " is-extra" : ""}" data-cat="${p.cat}" data-index="${i}">
        <button class="card__btn" data-cursor="view" aria-label="Ampliar foto: ${esc(p.title)}, ${esc(catLabel(p.cat))}">
          <div class="card__media" style="aspect-ratio:${p.ratio};--lqip:${lqip(p.src, p.ratio)}">
            <div class="card__inner">
              ${imgTag({ src: p.src, alt: p.alt, ratio: p.ratio, sizes: "(min-width:1024px) 31vw, 48vw", widths: [400, 640, 900, 1200] })}
            </div>
          </div>
          <span class="card__info"><span class="card__title">${esc(p.title)}</span><span class="card__cat">${esc(catLabel(p.cat))}</span></span>
        </button>
      </li>`).join("");
  }

  function renderFeatured() {
    $("[data-hscroll-track]").innerHTML = S.featured.map((f) => `
      <li class="hs-item">
        <div class="hs-item__media" style="aspect-ratio:${f.ratio};--lqip:${lqip(f.src, f.ratio)}">
          ${imgTag({ src: f.src, alt: `${f.title} — ${f.place}`, ratio: f.ratio, sizes: "(min-width:1024px) 50vw, 80vw", widths: [480, 800, 1200] })}
        </div>
        <p class="hs-item__cap"><span>${esc(f.title)}</span><span>${esc(f.place)}</span></p>
      </li>`).join("");
  }

  function renderAbout() {
    const img = $("[data-about-img]");
    img.src = imgUrl(S.about.src, 900, 0.8);
    img.srcset = imgSrcset(S.about.src, [480, 900, 1300], 0.8);
    img.sizes = "(min-width:1024px) 40vw, 100vw";
    img.alt = S.about.alt;

    $("[data-stats]").innerHTML = S.about.stats.map((s) => `
      <div class="stat">
        <dt>${esc(s.label)}</dt>
        <dd data-count="${s.value}" data-prefix="${esc(s.prefix)}" data-suffix="${esc(s.suffix)}">${esc(s.prefix)}${s.value}${esc(s.suffix)}</dd>
      </div>`).join("");
  }

  function renderServices() {
    $("[data-services]").innerHTML = S.services.map((s, i) => `
      <li class="price-card${s.featured ? " price-card--featured" : ""}" data-reveal>
        ${s.featured ? '<span class="price-card__badge">Mais escolhido</span>' : ""}
        <span class="price-card__num">${pad(i + 1)}</span>
        <h3 class="price-card__name">${esc(s.name)}</h3>
        <p class="price-card__tag">${esc(s.tagline)}</p>
        <ul class="price-card__list">${s.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
        <p class="price-card__price">a partir de <strong>R$ ${esc(s.price)}</strong></p>
        <a class="btn ${s.featured ? "" : "btn--dark"}" href="${waLink(`Olá, Anna! Tenho interesse no pacote "${s.name}".`)}" target="_blank" rel="noopener">
          <span class="btn__roll">${esc(s.cta)}</span>
        </a>
      </li>`).join("");
  }

  function renderProcess() {
    $("[data-process]").innerHTML = S.process.map((p, i) => `
      <li class="step" data-reveal>
        <span class="step__num">${pad(i + 1)}</span>
        <h3 class="step__title">${esc(p.title)}</h3>
        <p class="step__text">${esc(p.text)}</p>
      </li>`).join("");
  }

  function renderTestimonials() {
    $("[data-slider]").innerHTML = S.testimonials.map((t, i) => `
      <figure class="slide${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="depoimento" aria-label="${i + 1} de ${S.testimonials.length}">
        <blockquote class="slide__quote"><span class="q-line">${esc(t.quote)}</span></blockquote>
        <figcaption class="slide__author">
          <img src="${imgUrl(t.src, 112, 1)}" alt="" width="56" height="56" loading="lazy" decoding="async">
          <span><span class="slide__name">${esc(t.name)}</span><br><span class="slide__detail">${esc(t.detail)}</span></span>
        </figcaption>
      </figure>`).join("");
    $("[data-dots]").innerHTML = S.testimonials.map((t, i) =>
      `<button class="slider__dot" role="tab" aria-selected="${i === 0}" aria-label="Depoimento de ${esc(t.name)}"></button>`).join("");
  }

  function renderFaq() {
    $("[data-faq]").innerHTML = (S.faq || []).map((f, i) => `
      <li class="faq__item" data-reveal>
        <h3>
          <button class="faq__q" aria-expanded="false" aria-controls="faq-${i}" id="faq-q-${i}">
            <span>${esc(f.q)}</span><span class="faq__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="faq__a" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(f.a)}</p></div></div>
      </li>`).join("");
  }

  function renderMarquee() {
    const item = (src, hidden) => `
      <li class="marquee__item"${hidden ? ' aria-hidden="true"' : ""}>
        <a href="https://instagram.com/${B.instagram}" target="_blank" rel="noopener" ${hidden ? 'tabindex="-1"' : ""} aria-label="Ver no Instagram">
          ${imgTag({ src, alt: "", ratio: "1/1", sizes: "320px", widths: [320, 640] })}
        </a>
      </li>`;
    // Lista duplicada para o loop infinito ficar contínuo
    $("[data-marquee]").innerHTML = S.instagram.map((s) => item(s, false)).join("") + S.instagram.map((s) => item(s, true)).join("");
  }

  /** Envolve o texto dos botões para o efeito "roll". */
  function prepareButtons() {
    $$(".btn__roll").forEach((el) => {
      if (el.querySelector(".btn__roll-inner")) return;
      el.innerHTML = `<span class="btn__roll-inner">${el.innerHTML}</span>`;
    });
  }

  /** Quebra um elemento em palavras, preservando <em>. `mask` cria a máscara para o reveal. */
  function splitWords(el, mask) {
    const wrap = (text) => text.split(/(\s+)/).map((t) => {
      if (!t.trim()) return t ? " " : "";
      return mask ? `<span class="word"><span class="word__inner">${esc(t)}</span></span>` : `<span class="w">${esc(t)}</span>`;
    }).join("");
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    el.innerHTML = Array.from(el.childNodes).map((n) =>
      n.nodeType === 3 ? wrap(n.textContent) : `<${n.tagName.toLowerCase()}>${wrap(n.textContent)}</${n.tagName.toLowerCase()}>`).join("");
    // filhos ficam ocultos para leitores de tela; o aria-label lê a frase inteira
    Array.from(el.children).forEach((c) => c.setAttribute("aria-hidden", "true"));
  }

  renderBrand();
  renderManifesto();
  renderPortfolio();
  renderFeatured();
  renderAbout();
  renderServices();
  renderProcess();
  renderTestimonials();
  renderMarquee();
  renderFaq();
  prepareButtons();
  splitWords($("[data-split]"), true);
  splitWords($("[data-manifesto]"), false);
  watchImageLoads();

  /* ------------------------------------------------------------------
     3. SMOOTH SCROLL + HEADER + PROGRESSO
     ------------------------------------------------------------------ */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const lockScroll = (on) => { document.body.classList.toggle("is-locked", on); if (lenis) on ? lenis.stop() : lenis.start(); };
  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else (typeof target === "number" ? window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" }) : target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));
  };

  // Âncoras internas com smooth scroll + foco acessível
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id === "#topo" ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(id === "#topo" ? 0 : target);
    if (target !== document.body) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
  });
  $("[data-to-top]").addEventListener("click", () => scrollToTarget(0));

  const header = $("[data-header]");
  const bar = $(".progress__bar");
  const waFloat = $("[data-wa-float]");
  const mbar = $("[data-mbar]");
  const heroEl = $(".hero");
  const contactEl = $("#contato");
  let lastY = window.scrollY, ticking = false, menuOpen = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle("is-scrolled", y > 40);
    if (!menuOpen) header.classList.toggle("is-hidden", y > lastY && y > 300);
    // aparece depois do hero e some quando o contato (que já tem CTA) está na tela
    const showCta = y > heroEl.offsetHeight * 0.7 && contactEl.getBoundingClientRect().top > innerHeight * 0.6;
    waFloat.classList.toggle("is-visible", showCta);
    mbar.classList.toggle("is-visible", showCta && !menuOpen);
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  // Menu mobile
  const toggle = $(".menu-toggle");
  const menu = $("#mobile-menu");
  function openMenu() {
    menuOpen = true;
    toggle.setAttribute("aria-expanded", "true");
    toggle.querySelector(".sr-only").textContent = "Fechar menu";
    menu.classList.add("is-open"); menu.setAttribute("aria-hidden", "false");
    header.classList.add("menu-open"); header.classList.remove("is-hidden");
    mbar.classList.remove("is-visible");
    lockScroll(true);
  }
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    toggle.setAttribute("aria-expanded", "false");
    toggle.querySelector(".sr-only").textContent = "Abrir menu";
    menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true");
    header.classList.remove("menu-open");
    lockScroll(false);
    onScroll();
  }
  toggle.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menuOpen) { closeMenu(); toggle.focus(); } });
  matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && closeMenu());

  /* ------------------------------------------------------------------
     4. PRELOADER + INTRO DO HERO
     ------------------------------------------------------------------ */
  const preloader = $(".preloader");
  const heroWords = $$(".hero__title .word__inner");
  const heroFades = $$("[data-hero-fade]");

  function intro() {
    if (!hasGSAP || reduced) { preloader.remove(); return; }
    gsap.set(heroWords, { yPercent: 110 });
    gsap.set(heroFades, { y: 40, opacity: 0 });
    gsap.set("[data-hero-img]", { scale: 1.15 });
    gsap.set(preloader, { clipPath: "inset(0% 0% 0% 0%)" });

    const num = $(".preloader__num");
    const counter = { v: 0 };
    lockScroll(true);
    gsap.timeline({ onComplete: () => { preloader.remove(); lockScroll(false); } })
      .to(counter, { v: 100, duration: 1.1, ease: "power2.inOut", onUpdate: () => (num.textContent = Math.round(counter.v)) })
      .to(".preloader__inner", { y: -24, opacity: 0, duration: 0.4, ease: "power2.in" }, "-=0.05")
      .to(preloader, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.15")
      .to("[data-hero-img]", { scale: 1, duration: 1.8, ease: EASE }, "<")
      .to(heroWords, { yPercent: 0, duration: 1.2, ease: EASE, stagger: 0.08 }, "<0.35")
      .to(heroFades, { y: 0, opacity: 1, duration: 1, ease: EASE, stagger: 0.08 }, "<0.4");
  }

  /* ------------------------------------------------------------------
     5. ANIMAÇÕES DE SCROLL
     ------------------------------------------------------------------ */
  function scrollAnimations() {
    if (!hasGSAP || reduced) return;

    // Reveal em cascata: translateY(40px) + opacity
    const reveals = $$("[data-reveal]");
    gsap.set(reveals, { y: 40, opacity: 0 });
    ScrollTrigger.batch(reveals, {
      start: "top 88%",
      once: true,
      onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1, ease: EASE, stagger: 0.08, overwrite: true, clearProps: "transform" }),
    });

    // Imagens: clip-path de baixo para cima + scale 1.15 → 1
    const clipIn = (wrap, inner) => {
      gsap.set(wrap, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(inner, { scale: 1.15 });
      return gsap.timeline({ paused: true })
        .to(wrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE })
        .to(inner, { scale: 1, duration: 1.4, ease: EASE }, 0);
    };
    $$("[data-clip]").forEach((fig) => {
      const tl = clipIn(fig, fig.querySelector("img"));
      ScrollTrigger.create({ trigger: fig, start: "top 80%", once: true, onEnter: () => tl.play() });
    });
    $$(".card__media").forEach((m) => (m._reveal = clipIn(m, m.querySelector(".card__inner"))));
    ScrollTrigger.batch(".card__media", {
      start: "top 92%",
      once: true,
      onEnter: (els) => els.forEach((m, i) => gsap.delayedCall(i * 0.08, () => m._reveal && m._reveal.play())),
    });

    // Parallax do hero
    gsap.to("[data-hero-media]", {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    // Parallax em camadas (data-speed)
    $$("[data-speed]").forEach((el) => {
      gsap.fromTo(el, { yPercent: 0 }, {
        yPercent: parseFloat(el.dataset.speed) * 100, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Manifesto: opacidade palavra por palavra
    gsap.set("[data-manifesto] .w", { opacity: 0.2 });
    gsap.to("[data-manifesto] .w", {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 50%", scrub: true },
    });

    // Números com contagem
    $$("[data-count]").forEach((el) => {
      const { count, prefix, suffix } = el.dataset;
      const o = { v: 0 };
      el.textContent = `${prefix}0${suffix}`;
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => gsap.to(o, { v: +count, duration: 2, ease: "power3.out", onUpdate: () => (el.textContent = `${prefix}${Math.round(o.v).toLocaleString("pt-BR")}${suffix}`) }),
      });
    });

    // Processo: linha que se desenha + passos que acendem
    gsap.to("[data-process-line]", {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".process__steps", start: "top 65%", end: "bottom 65%", scrub: true },
    });
    $$(".step").forEach((s) => ScrollTrigger.create({ trigger: s, start: "top 65%", end: "max", toggleClass: "is-active" }));

    // Galeria horizontal "pinned" apenas no desktop
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const section = $("[data-hscroll]");
      const track = $("[data-hscroll-track]");
      section.classList.add("is-pinned");
      const distance = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: ".hscroll__pin", start: "top top", end: () => `+=${distance()}`,
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      // o matchMedia já desfaz o tween e o pin; só limpamos a classe
      return () => { section.classList.remove("is-pinned"); gsap.set(track, { clearProps: "x" }); };
    });

    // Recalcula depois que as fontes carregam (alturas mudam)
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ------------------------------------------------------------------
     6. PORTFÓLIO: FILTROS + LIGHTBOX
     ------------------------------------------------------------------ */
  const filtersEl = $("[data-filters]");
  const indicator = $(".filters__indicator");
  const cards = $(".card");
  const grid = $("[data-grid]");
  const moreBtn = $("[data-more]");
  $(".btn__roll-inner", moreBtn).textContent = `Ver todas as ${S.portfolio.length} fotos`;
  moreBtn.addEventListener("click", () => {
    revealAllCards();
    grid.classList.add("is-expanded");
    const first = $(".card.is-extra:not(.is-hidden) .card__btn", grid);
    if (hasGSAP && !reduced) gsap.from(".card.is-extra", { opacity: 0, y: 24, duration: 0.8, ease: EASE, stagger: 0.05, clearProps: "all" });
    hasGSAP && ScrollTrigger.refresh();
    first && first.focus({ preventScroll: true });
  });

  function moveIndicator() {
    const active = $(".filter[aria-selected='true']", filtersEl);
    indicator.style.transform = `translateX(${active.offsetLeft}px) scaleX(${active.offsetWidth / 100})`;
  }
  function revealAllCards() {
    // Ao filtrar, cards ainda não revelados aparecem direto (sem clip pendente)
    $$(".card__media").forEach((m) => m._reveal && m._reveal.progress(1));
  }
  function applyFilter(cat) {
    const show = (c) => cat === "all" || c.dataset.cat === cat;
    if (!hasGSAP || !window.Flip || reduced) {
      grid.classList.add("is-expanded");
      cards.forEach((c) => c.classList.toggle("is-hidden", !show(c)));
      hasGSAP && ScrollTrigger.refresh();
      return;
    }
    revealAllCards();
    const state = Flip.getState(cards, { props: "opacity" });
    grid.classList.add("is-expanded");
    cards.forEach((c) => c.classList.toggle("is-hidden", !show(c)));
    Flip.from(state, {
      duration: 0.8, ease: EASE, absolute: true, stagger: 0.015, nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.7, ease: EASE }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.4, ease: "power2.in" }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }
  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn || btn.getAttribute("aria-selected") === "true") return;
    $$(".filter", filtersEl).forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
    moveIndicator();
    applyFilter(btn.dataset.filter);
  });
  // Setas do teclado entre as abas
  filtersEl.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const tabs = $$(".filter", filtersEl);
    const i = tabs.indexOf(document.activeElement);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    next.focus(); next.click();
  });
  window.addEventListener("resize", moveIndicator);
  moveIndicator();
  document.fonts && document.fonts.ready.then(moveIndicator);

  // Lightbox
  const lb = $("[data-lightbox]");
  const lbImg = $("[data-lb-img]");
  const lbTitle = $("[data-lb-title]");
  const lbCount = $("[data-lb-count]");
  let lbList = [], lbIndex = 0, lbReturn = null;

  function lbShow(i, dir = 0) {
    lbIndex = (i + lbList.length) % lbList.length;
    const p = S.portfolio[lbList[lbIndex]];
    const set = () => {
      lbImg.src = imgUrl(p.src, 1800);
      lbImg.srcset = imgSrcset(p.src, [900, 1400, 2000]);
      lbImg.sizes = "90vw";
      lbImg.alt = p.alt;
      lbTitle.textContent = `${p.title} · ${catLabel(p.cat)}`;
      lbCount.textContent = `${pad(lbIndex + 1)} / ${pad(lbList.length)}`;
    };
    if (hasGSAP && !reduced && dir) {
      gsap.timeline()
        .to(lbImg, { x: -40 * dir, opacity: 0, duration: 0.25, ease: "power2.in", onComplete: set })
        .fromTo(lbImg, { x: 40 * dir }, { x: 0, opacity: 1, duration: 0.6, ease: EASE });
    } else set();
    // pré-carrega vizinhas
    [1, -1].forEach((d) => { const n = S.portfolio[lbList[(lbIndex + d + lbList.length) % lbList.length]]; new Image().src = imgUrl(n.src, 1400); });
  }
  function lbOpen(index) {
    lbList = cards.filter((c) => c.offsetParent !== null).map((c) => +c.dataset.index);
    lbReturn = document.activeElement;
    lb.hidden = false;
    lockScroll(true);
    lbShow(lbList.indexOf(index));
    if (hasGSAP && !reduced) gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: EASE });
    $("[data-lb-close]").focus();
    cursorHide();
  }
  function lbClose() {
    const done = () => { lb.hidden = true; lockScroll(false); lbReturn && lbReturn.focus(); };
    if (hasGSAP && !reduced) gsap.to(lb, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: done });
    else done();
  }
  $("[data-grid]").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) lbOpen(+card.dataset.index);
  });
  $("[data-lb-close]").addEventListener("click", lbClose);
  $("[data-lb-prev]").addEventListener("click", () => lbShow(lbIndex - 1, -1));
  $("[data-lb-next]").addEventListener("click", () => lbShow(lbIndex + 1, 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lbClose(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lbClose();
    else if (e.key === "ArrowRight") lbShow(lbIndex + 1, 1);
    else if (e.key === "ArrowLeft") lbShow(lbIndex - 1, -1);
    else if (e.key === "Tab") {
      // mantém o foco dentro do lightbox
      const f = $$("button", lb);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  // Swipe no mobile
  let sx = null, sy = null;
  lb.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
  lb.addEventListener("pointerup", (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? lbShow(lbIndex + 1, 1) : lbShow(lbIndex - 1, -1);
    sx = sy = null;
  });

  /* ------------------------------------------------------------------
     7. DEPOIMENTOS, CURSOR, MAGNÉTICO
     ------------------------------------------------------------------ */
  const slides = $$(".slide");
  const dots = $$(".slider__dot");
  let tIndex = 0, tTimer = null;
  function tShow(i) {
    tIndex = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === tIndex));
    dots.forEach((d, k) => d.setAttribute("aria-selected", String(k === tIndex)));
    $("[data-t-count]").textContent = `${pad(tIndex + 1)} / ${pad(slides.length)}`;
  }
  const tPlay = () => { if (reduced) return; clearInterval(tTimer); tTimer = setInterval(() => tShow(tIndex + 1), 6500); };
  const tPause = () => clearInterval(tTimer);
  $("[data-t-prev]").addEventListener("click", () => { tShow(tIndex - 1); tPlay(); });
  $("[data-t-next]").addEventListener("click", () => { tShow(tIndex + 1); tPlay(); });
  dots.forEach((d, i) => d.addEventListener("click", () => { tShow(i); tPlay(); }));
  const tSection = $(".testimonials");
  tSection.addEventListener("mouseenter", tPause);
  tSection.addEventListener("mouseleave", tPlay);
  tSection.addEventListener("focusin", tPause);
  tSection.addEventListener("focusout", tPlay);
  tPlay();
  tShow(0);
  // swipe nos depoimentos
  let tsx = null, tsy = null;
  const slider = $("[data-slider]");
  slider.addEventListener("pointerdown", (e) => { tsx = e.clientX; tsy = e.clientY; });
  slider.addEventListener("pointerup", (e) => {
    if (tsx == null) return;
    const dx = e.clientX - tsx, dy = e.clientY - tsy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { tShow(tIndex + (dx < 0 ? 1 : -1)); tPlay(); }
    tsx = tsy = null;
  });

  // Serviços (carrossel no celular): contador e barra de progresso
  const cardsEl = $("[data-services]");
  const priceCards = $$(".price-card", cardsEl);
  const cardsCount = $("[data-cards-count]");
  const cardsBar = $("[data-cards-bar]");
  function onCardsScroll() {
    const max = cardsEl.scrollWidth - cardsEl.clientWidth;
    const p = max > 0 ? cardsEl.scrollLeft / max : 0;
    const i = Math.round(p * (priceCards.length - 1));
    cardsCount.textContent = `${pad(i + 1)} / ${pad(priceCards.length)}`;
    cardsBar.style.transform = `scaleX(${(i + 1) / priceCards.length})`;
  }
  cardsEl.addEventListener("scroll", onCardsScroll, { passive: true });
  onCardsScroll();

  // FAQ: acordeão (um aberto por vez)
  $("[data-faq]").addEventListener("click", (e) => {
    const q = e.target.closest(".faq__q");
    if (!q) return;
    const item = q.closest(".faq__item");
    const open = !item.classList.contains("is-open");
    $$(".faq__item.is-open").forEach((it) => { it.classList.remove("is-open"); $(".faq__q", it).setAttribute("aria-expanded", "false"); });
    item.classList.toggle("is-open", open);
    q.setAttribute("aria-expanded", String(open));
    hasGSAP && setTimeout(() => ScrollTrigger.refresh(), 650);
  });

  // Cursor customizado "Ver"
  const cursor = $(".cursor");
  let cursorOn = false;
  function cursorHide() { cursorOn = false; cursor.classList.remove("is-visible"); hasGSAP && gsap.to(cursor, { scale: 0, duration: 0.4, ease: EASE }); }
  if (finePointer && hasGSAP) {
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });
    window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const over = Boolean(e.target.closest("[data-cursor]"));
      if (over && !cursorOn) {
        cursorOn = true;
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        cursor.classList.add("is-visible");
        gsap.to(cursor, { scale: 1, duration: 0.5, ease: EASE });
      } else if (!over && cursorOn) cursorHide();
    });
  }

  // Botão magnético
  if (finePointer && hasGSAP && !reduced) {
    $$("[data-magnetic]").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
      });
      btn.addEventListener("pointerleave", () => { gsap.to(btn, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" }); });
    });
  }

  // Nome gigante do footer ocupa a largura toda
  const fitEl = $("[data-fit]");
  function fitFooter() {
    const span = fitEl.firstElementChild;
    fitEl.style.fontSize = "100px";
    const w = fitEl.clientWidth;
    fitEl.style.fontSize = `${(100 * w) / span.offsetWidth * 0.99}px`;
  }
  fitFooter();
  window.addEventListener("resize", fitFooter);
  document.fonts && document.fonts.ready.then(fitFooter);

  /* ------------------------------------------------------------------
     8. FORMULÁRIO
     ------------------------------------------------------------------ */
  const form = $("[data-form]");
  const dateInput = $("#f-date");
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);

  const phone = $("#f-phone");
  phone.addEventListener("input", () => {
    const d = phone.value.replace(/\D/g, "").slice(0, 11);
    let v = d;
    if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    phone.value = v;
  });

  const rules = {
    nome: (v) => (v.trim().length < 2 ? "Como posso te chamar?" : ""),
    whatsapp: (v) => { const n = v.replace(/\D/g, "").length; return n < 10 ? "Confere o número? Inclua o DDD." : ""; },
    tipo: (v) => (!v ? "Escolha o tipo de ensaio." : ""),
    data: (v) => (v && v < dateInput.min ? "Escolha uma data a partir de hoje." : ""),
    mensagem: (v) => (v.trim().length < 10 ? "Escreva um pouquinho mais (mín. 10 caracteres)." : ""),
  };
  function validate(field) {
    const msg = rules[field.name](field.value);
    const wrap = field.closest(".field");
    wrap.classList.toggle("is-invalid", Boolean(msg));
    wrap.classList.toggle("is-valid", !msg && field.value !== "");
    wrap.querySelector(".field__error").textContent = msg;
    field.setAttribute("aria-invalid", String(Boolean(msg)));
    return !msg;
  }
  $$("input, select, textarea", form).forEach((f) => {
    f.addEventListener("blur", () => validate(f));
    f.addEventListener("input", () => f.closest(".field").classList.contains("is-invalid") && validate(f));
    f.addEventListener("change", () => validate(f));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = $$("input, select, textarea", form);
    const ok = fields.map(validate).every(Boolean);
    if (!ok) { fields.find((f) => f.getAttribute("aria-invalid") === "true").focus(); return; }

    const data = Object.fromEntries(new FormData(form));
    const submit = $(".form__submit", form);
    submit.disabled = true;
    $(".btn__roll-inner", submit).textContent = "Enviando…";

    /* ▸ INTEGRAÇÃO: troque este setTimeout por um fetch para Formspree,
       Netlify Forms, Google Apps Script ou seu backend. Ex.:
       fetch("https://formspree.io/f/SEU_ID", { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }) */
    setTimeout(() => {
      const dateTxt = data.data ? ` para ${data.data.split("-").reverse().join("/")}` : "";
      const msg = `Olá, Anna! Sou ${data.nome}. Tenho interesse em: ${data.tipo}${dateTxt}.\n\n${data.mensagem}\n\nMeu WhatsApp: ${data.whatsapp}`;
      $("[data-success-name]").textContent = data.nome.trim().split(" ")[0];
      $("[data-success-wa]").href = waLink(msg);
      form.classList.add("is-sent");
      const success = $("[data-success]");
      success.hidden = false;
      if (hasGSAP && !reduced) gsap.from(success.children, { y: 24, opacity: 0, duration: 0.9, ease: EASE, stagger: 0.08 });
      success.querySelector("h3").setAttribute("tabindex", "-1");
      success.querySelector("h3").focus({ preventScroll: true });
    }, 900);
  });

  /* ------------------------------------------------------------------
     START
     ------------------------------------------------------------------ */
  scrollAnimations();
  intro();
})();
