/* ==========================================================================
   CONFIGURAÇÃO DO SITE
   --------------------------------------------------------------------------
   Tudo o que muda com frequência mora aqui: contatos, fotos, categorias,
   pacotes, depoimentos e números. Edite este arquivo e recarregue a página.

   FOTOS
   - `src` aceita:
       • um ID do Unsplash (ex.: "1519741497674-611481863552"), ou
       • um caminho local (ex.: "img/casamento-01.jpg") ou URL completa.
   - `ratio` define o formato do card: "4/5" (retrato), "3/2" (paisagem)
     ou "1/1" (quadrado). Isso evita salto de layout (CLS).
   - `cat` precisa bater com um `id` da lista `categories`.
   ========================================================================== */

window.SITE = {
  brand: {
    name: "Anna Valente",
    role: "Fotógrafa",
    city: "São Paulo",
    // Somente dígitos, com DDI + DDD (ex.: 55 11 999999999)
    whatsapp: "5511999999999",
    whatsappLabel: "(11) 99999-9999",
    whatsappMessage: "Olá, Anna! Vi seu portfólio e gostaria de saber mais sobre um ensaio.",
    instagram: "annavalente.foto",
    email: "contato@annavalente.com.br",
    since: 2017,
    hours: "Seg a sáb · 9h às 19h",
  },

  /* Perguntas frequentes (seção "Dúvidas") */
  faq: [
    { q: "Com quanto tempo de antecedência devo reservar?", a: "Para casamentos, o ideal é de 6 a 12 meses, porque as datas mais procuradas esgotam rápido. Ensaios e newborn costumam ser agendados com 2 a 4 semanas — no caso do newborn, reservamos pela data prevista do parto." },
    { q: "Você fotografa fora de São Paulo?", a: "Sim! Atendo em todo o Brasil e também destination weddings. Os custos de deslocamento e hospedagem são combinados com transparência no orçamento." },
    { q: "Não sei posar. Isso é um problema?", a: "De jeito nenhum — a maioria das minhas clientes diz o mesmo. Conduzo com direção leve, conversa e muito tempo, para que você esqueça a câmera e apareça como é." },
    { q: "Como e quando recebo as fotos?", a: "Em uma galeria online privada, em alta resolução e prontas para download. Ensaios em até 15 dias; casamentos em até 45 dias, com uma prévia na mesma semana." },
    { q: "Como funciona o pagamento?", a: "Um sinal de 30% garante a sua data e o restante pode ser parcelado até a entrega. Aceito Pix, transferência e cartão de crédito." },
    { q: "O ensaio newborn é seguro para o bebê?", a: "Segurança vem antes de qualquer foto. Sigo protocolos de fotografia neonatal, com ambiente aquecido, materiais higienizados e poses sempre apoiadas pelas mãos dos pais." },
  ],

  /* Categorias do filtro do portfólio (a primeira, "todos", é automática) */
  categories: [
    { id: "casamentos", label: "Casamentos" },
    { id: "ensaios", label: "Ensaios" },
    { id: "familia", label: "Gestante & Newborn" },
    { id: "corporativo", label: "Corporativo" },
  ],

  /* Imagem principal do topo */
  hero: {
    src: "1537633552985-df8429e8048b",
    alt: "Noiva de véu longo caminhando à beira-mar sob luz natural suave",
  },

  /* Duas imagens flutuantes ao lado do manifesto (camadas de parallax) */
  manifesto: [
    { src: "1525258946800-98cfd641d0de", alt: "Detalhe de buquê de rosas em tons pastel", ratio: "4/5" },
    { src: "1555252333-9f8e92e65df9", alt: "Recém-nascido dormindo sobre manta clara", ratio: "1/1" },
  ],

  /* Portfólio / catálogo */
  portfolio: [
    { src: "1519741497674-611481863552", cat: "casamentos", ratio: "4/5", title: "Marina & Lucas", alt: "Casal de noivos abraçado sob luzes quentes ao entardecer" },
    { src: "1524504388940-b1c1722653e1", cat: "ensaios", ratio: "4/5", title: "Helena", alt: "Retrato feminino em luz baixa, olhar sereno para a câmera" },
    { src: "1493894473891-10fc1e5dbd22", cat: "familia", ratio: "3/2", title: "À espera de Theo", alt: "Gestante formando um coração com as mãos sobre a barriga" },
    { src: "1532712938310-34cb3982ef74", cat: "casamentos", ratio: "3/2", title: "Serra da Mantiqueira", alt: "Noivos em campo aberto com montanhas e névoa ao fundo" },
    { src: "1573496359142-b8d87734a5a2", cat: "corporativo", ratio: "4/5", title: "Carla Mendes, CEO", alt: "Retrato corporativo de mulher de braços cruzados em escritório claro" },
    { src: "1494955870715-979ca4f13bf0", cat: "casamentos", ratio: "1/1", title: "O buquê", alt: "Noiva segurando buquê de flores claras próximo ao vestido" },
    { src: "1502823403499-6ccfcf4fb453", cat: "ensaios", ratio: "1/1", title: "Rosa antigo", alt: "Retrato feminino de perfil em tons rosados" },
    { src: "1544126592-807ade215a0b", cat: "familia", ratio: "4/5", title: "Primeiros dias", alt: "Bebê recém-nascido dormindo tranquilo em lençol branco" },
    { src: "1583939003579-730e3918a45a", cat: "casamentos", ratio: "4/5", title: "Ana & Pedro", alt: "Noivos sorrindo juntos durante a celebração" },
    { src: "1438761681033-6461ffad8d80", cat: "ensaios", ratio: "4/5", title: "Luíza", alt: "Retrato feminino natural com luz difusa" },
    { src: "1560250097-0b93528c311a", cat: "corporativo", ratio: "1/1", title: "Rafael Torres", alt: "Retrato corporativo masculino de terno em fundo neutro" },
    { src: "1519225421980-715cb0215aed", cat: "casamentos", ratio: "3/2", title: "Recepção no jardim", alt: "Mesa de recepção de casamento decorada com flores ao ar livre" },
    { src: "1470116945706-e6bf5d5a53ca", cat: "familia", ratio: "3/2", title: "Mãozinhas", alt: "Mãos de adulto segurando delicadamente a mão de um bebê" },
    { src: "1500917293891-ef795e70e1f6", cat: "ensaios", ratio: "4/5", title: "Vento leve", alt: "Mulher com cabelos ao vento em fundo claro" },
    { src: "1604017011826-d3b4c23f8914", cat: "casamentos", ratio: "4/5", title: "Elopement", alt: "Casal de noivos em paisagem aberta ao pôr do sol" },
    { src: "1580489944761-15a19d654956", cat: "corporativo", ratio: "4/5", title: "Juliana Prado", alt: "Retrato profissional de mulher sorridente em fundo claro" },
    { src: "1584515933487-779824d29309", cat: "familia", ratio: "1/1", title: "Colo", alt: "Detalhe de mãos acolhendo um recém-nascido" },
    { src: "1531746020798-e6953c6e8e04", cat: "ensaios", ratio: "3/2", title: "Estúdio", alt: "Retrato feminino em estúdio com fundo rosado" },
  ],

  /* Faixa horizontal em destaque (seção "pinned") */
  featured: [
    { src: "1511285560929-80b456fea0bc", ratio: "3/2", title: "Casamento no campo", place: "Campos do Jordão" },
    { src: "1591604466107-ec97de577aff", ratio: "4/5", title: "Bianca & Rafa", place: "Ilhabela" },
    { src: "1513279922550-250c2129b13a", ratio: "3/2", title: "Última luz", place: "Cunha" },
    { src: "1520854221256-17451cc331bf", ratio: "4/5", title: "Mãos dadas", place: "São Paulo" },
    { src: "1606216794074-735e91aa2c92", ratio: "3/2", title: "Floresta", place: "Monte Verde" },
    { src: "1465495976277-4387d4b0b4c6", ratio: "4/5", title: "As alianças", place: "Holambra" },
  ],

  /* Sobre */
  about: {
    src: "1544005313-94ddf0286df2",
    alt: "Retrato de Anna Valente, fotógrafa, em luz natural suave",
    stats: [
      { value: 300, prefix: "+", suffix: "", label: "ensaios realizados" },
      { value: 120, prefix: "", suffix: "", label: "casamentos fotografados" },
      { value: 8, prefix: "", suffix: "", label: "anos de fotografia autoral" },
    ],
  },

  /* Pacotes. `featured: true` recebe o selo "Mais escolhido" */
  services: [
    {
      name: "Ensaio",
      tagline: "Retratos, gestante ou corporativo",
      price: "890",
      items: ["2 horas de ensaio", "1 locação à escolha", "40 fotos tratadas", "Galeria online privada", "Entrega em até 15 dias"],
      cta: "Quero um ensaio",
    },
    {
      name: "Casamento Essencial",
      tagline: "Cerimônia + recepção",
      price: "6.900",
      items: ["Até 8 horas de cobertura", "Making of da noiva", "500+ fotos tratadas", "Álbum fine art 30×30", "Ensaio pré-wedding incluso"],
      cta: "Pedir orçamento",
      featured: true,
    },
    {
      name: "Newborn & Família",
      tagline: "No conforto da sua casa",
      price: "1.200",
      items: ["Sessão de até 3 horas", "Figurinos e props inclusos", "50 fotos tratadas", "Caixa com 15 impressões", "Protocolo de segurança neonatal"],
      cta: "Agendar sessão",
    },
  ],

  /* Como funciona */
  process: [
    { title: "Primeira conversa", text: "Você me conta sua história, a data e o que imagina. Respondo em até 24h, sem compromisso." },
    { title: "Planejamento", text: "Escolhemos juntas locação, horário de luz, figurino e cada detalhe para que tudo flua com leveza." },
    { title: "O dia", text: "Conduzo com calma e naturalidade. Você só precisa estar presente — eu cuido do resto." },
    { title: "Entrega", text: "Fotos tratadas uma a uma, em galeria online privada e, se quiser, em álbum fine art." },
  ],

  /* Depoimentos (seção escura) */
  testimonials: [
    { quote: "A Anna tem um olhar que enxerga o que a gente sente. Cada foto do nosso casamento me devolve exatamente a emoção daquele dia.", name: "Marina Alves", detail: "Casamento em Campos do Jordão", src: "1494790108377-be9c29b29330" },
    { quote: "Eu morria de vergonha de câmera. Saí do ensaio me sentindo linda e com as fotos mais verdadeiras que já tive.", name: "Helena Souza", detail: "Ensaio feminino", src: "1487412720507-e7ab37603c6f" },
    { quote: "Delicadeza do começo ao fim. O cuidado com nosso bebê de dez dias foi algo que nunca vamos esquecer.", name: "Camila Rocha", detail: "Newborn em casa", src: "1531746020798-e6953c6e8e04" },
  ],

  /* Prova social logo após o topo */
  press: ["Revista Lume", "Casar Bem", "Atelier Noivas", "Ensaio Mag", "Vestida de Noiva"],
  rating: { score: "5,0", count: 180, source: "Google" },

  /* Faixa do Instagram (marquee) */
  instagram: [
    "1522673607200-164d1b6ce486",
    "1487412720507-e7ab37603c6f",
    "1555252333-9f8e92e65df9",
    "1609220136736-443140cffec6",
    "1519741497674-611481863552",
    "1524504388940-b1c1722653e1",
  ],
};
