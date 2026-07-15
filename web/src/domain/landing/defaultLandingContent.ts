import type { LandingContent } from '@/domain/entities/LandingContent';

export const DEFAULT_LANDING_CONTENT: LandingContent = {
  whatsappNumber: '5517997579903',
  heroEyebrow: 'Fabricação própria · há mais de 15 anos',
  heroTitleLine1: 'Tramas que',
  heroTitleLine2: 'transformam.',
  heroCopy:
    'Cordas e tricôs náuticos criados para dar forma, resistência e identidade aos seus móveis.',
  heroCta: 'Conheça nossos produtos',
  introEyebrow: 'Do fio ao acabamento',
  introTitle: 'Não entregamos apenas cordas. Entregamos possibilidades.',
  introCopy:
    'Todo o processo acontece dentro de casa. Da seleção dos fios ao acabamento final, controlamos cada detalhe para garantir cores firmes, medidas padronizadas e performance consistente.',
  introCta: 'Fale com nossa equipe',
  stats: [
    { value: '15+', label: 'anos de experiência' },
    { value: 'UV', label: 'proteção para área externa' },
    { value: 'BR', label: 'envio para todo o Brasil' },
    { value: '100%', label: 'produção própria' },
  ],
  productsEyebrow: 'Linhas Trançatto',
  productsTitleLine1: 'Engenharia,',
  productsTitleLine2: 'toque e cor.',
  productsSubtitle:
    'Materiais desenvolvidos para o setor moveleiro, com resistência estrutural e acabamento que valoriza o desenho.',
  products: [
    {
      image: '/images/trancatto/asset-6.png',
      alt: 'Detalhe de cordas e tricôs náuticos em terracota',
      indexLabel: '01',
      title: 'Tricô náutico',
      description: 'Robusto, marcante e disponível com ou sem enchimento.',
    },
    {
      image: '/images/trancatto/asset-7.png',
      alt: 'Detalhe da trama de corda náutica',
      indexLabel: '02',
      title: 'Corda com alma',
      description: 'Firmeza, baixa absorção de umidade e secagem rápida.',
    },
  ],
  featureEyebrow: 'Feita para durar',
  featureTitle: 'Por dentro,\ntecnologia.\nPor fora, design.',
  featureCopy:
    'A combinação de EVA e polipropileno entrega estabilidade para assentos e encostos, resistência ao uso intenso e a liberdade criativa que cada projeto pede.',
  featureBullets: [
    'Resistência às condições externas',
    'Excelente memória e estabilidade',
    'Acabamento premium',
  ],
  featureImage: '/images/trancatto/asset-9.png',
  featureImageAlt: 'Textura de corda náutica Trançatto',
  galleryEyebrow: 'Matéria em detalhe',
  galleryTitleLine1: 'Texturas para',
  galleryTitleLine2: 'ver de perto.',
  gallerySubtitle:
    'Tramas, espessuras e cores registradas na nossa produção. Cada linha nasce para ganhar escala nas mãos de quem projeta.',
  carouselSlides: [
    {
      image: '/images/trancatto/gallery/verde-1.jpg',
      alt: 'Linha verde-pinho em detalhe',
      caption: 'Verde pinho · corda náutica',
      layout: 'wide',
    },
    {
      image: '/images/trancatto/gallery/terra-1.jpg',
      alt: 'Trama terracota produzida pela Trançatto',
      caption: 'Terracota · tricô náutico',
      layout: 'default',
    },
    {
      image: '/images/trancatto/gallery/verde-2.jpg',
      alt: 'Rolos de corda náutica verde-pinho',
      caption: 'Acabamento e consistência',
      layout: 'default',
    },
    {
      image: '/images/trancatto/gallery/terra-2.jpg',
      alt: 'Detalhe do acabamento terracota',
      caption: 'Cor firme · toque preciso',
      layout: 'tall',
    },
    {
      image: '/images/trancatto/gallery/verde-3.jpg',
      alt: 'Produção de corda verde-pinho',
      caption: 'Produção própria · controle em cada etapa',
      layout: 'wide',
    },
  ],
  paletteEyebrow: 'Paleta Trançatto',
  paletteTitleLine1: 'A cor também',
  paletteTitleLine2: 'constrói o projeto.',
  swatches: [
    { color: '#1b3227', name: 'Verde pinho' },
    { color: '#c25e37', name: 'Terracota' },
    { color: '#cebba4', name: 'Areia' },
    { color: '#825247', name: 'Bordô' },
    { color: '#283950', name: 'Azul malta' },
    { color: '#71645d', name: 'Bronze' },
  ],
  contactEyebrow: 'Seu próximo projeto começa aqui',
  contactTitle: 'Vamos dar\nforma\nà sua ideia?',
  contactCopy:
    'Fale com nosso time para receber o catálogo, consultar cores e encontrar a linha ideal.',
  contactButton: 'Enviar pelo WhatsApp',
  footerTagline: 'Cordas e tricôs náuticos\npara móveis e decoração.',
  instagramUrl: 'https://www.instagram.com/trancatto.ind/',
};

export function mergeLandingContent(
  partial: Partial<LandingContent> | null | undefined,
): LandingContent {
  if (!partial) {
    return DEFAULT_LANDING_CONTENT;
  }

  return {
    ...DEFAULT_LANDING_CONTENT,
    ...partial,
    stats: partial.stats?.length ? partial.stats : DEFAULT_LANDING_CONTENT.stats,
    products: partial.products?.length ? partial.products : DEFAULT_LANDING_CONTENT.products,
    featureBullets: partial.featureBullets?.length
      ? partial.featureBullets
      : DEFAULT_LANDING_CONTENT.featureBullets,
    carouselSlides: partial.carouselSlides?.length
      ? partial.carouselSlides
      : DEFAULT_LANDING_CONTENT.carouselSlides,
    swatches: partial.swatches?.length ? partial.swatches : DEFAULT_LANDING_CONTENT.swatches,
  };
}
