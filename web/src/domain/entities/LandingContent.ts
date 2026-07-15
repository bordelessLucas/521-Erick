export interface LandingSwatch {
  color: string;
  name: string;
}

export interface LandingProduct {
  image: string;
  alt: string;
  indexLabel: string;
  title: string;
  description: string;
}

export interface LandingCarouselSlide {
  image: string;
  alt: string;
  caption: string;
  layout: 'wide' | 'tall' | 'default';
}

export interface LandingStat {
  value: string;
  label: string;
}

export interface LandingContent {
  whatsappNumber: string;
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroCopy: string;
  heroCta: string;
  introEyebrow: string;
  introTitle: string;
  introCopy: string;
  introCta: string;
  stats: LandingStat[];
  productsEyebrow: string;
  productsTitleLine1: string;
  productsTitleLine2: string;
  productsSubtitle: string;
  products: LandingProduct[];
  featureEyebrow: string;
  featureTitle: string;
  featureCopy: string;
  featureBullets: string[];
  featureImage: string;
  featureImageAlt: string;
  galleryEyebrow: string;
  galleryTitleLine1: string;
  galleryTitleLine2: string;
  gallerySubtitle: string;
  /** Carousel slides shown in the gallery section (admin-editable). */
  carouselSlides: LandingCarouselSlide[];
  paletteEyebrow: string;
  paletteTitleLine1: string;
  paletteTitleLine2: string;
  swatches: LandingSwatch[];
  contactEyebrow: string;
  contactTitle: string;
  contactCopy: string;
  contactButton: string;
  footerTagline: string;
  instagramUrl: string;
  updatedAt?: string;
}

export const LANDING_CONTENT_DOC_ID = 'main';
