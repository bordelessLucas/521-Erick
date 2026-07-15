'use client';

import { FormEvent, useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/trancatto.css';
import type { LandingContent } from '@/domain/entities/LandingContent';
import { DEFAULT_LANDING_CONTENT } from '@/domain/landing/defaultLandingContent';
import { container } from '@/infrastructure/di/container';

function MultlineTitle({ value }: { value: string }) {
  return (
    <>
      {value.split('\n').map((line, index, arr) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

export function TrancattoLanding() {
  const [content, setContent] = useState<LandingContent>(DEFAULT_LANDING_CONTENT);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await container.getLandingContentRepository().get();
        if (!cancelled) {
          setContent(data);
        }
      } catch (error) {
        console.warn('Landing CMS unavailable, using defaults.', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsHeroVisible(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nome = String(formData.get('nome') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const telefone = String(formData.get('telefone') ?? '').trim();

    const message = [
      'Olá, gostaria de receber o catálogo da Trançatto.',
      '',
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Telefone: ${telefone}`,
    ].join('\n');

    const url = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const [mainProduct, sideProduct] = content.products;

  return (
    <div className={`trancatto-page${isMenuOpen ? ' menu-open' : ''}`}>
      <header className="header" id="top">
        <a className="brand" href="#top" aria-label="Trançatto — início" onClick={closeMenu}>
          <Image
            src="/images/trancatto/asset-5.png"
            alt="Trançatto"
            width={176}
            height={52}
            priority
            unoptimized
          />
        </a>

        <nav className={`nav${isMenuOpen ? ' open' : ''}`} aria-label="Navegação principal">
          <a href="#sobre" onClick={closeMenu}>
            A Trançatto
          </a>
          <a href="#produtos" onClick={closeMenu}>
            Produtos
          </a>
          <a href="#cores" onClick={closeMenu}>
            Cores
          </a>
          <a href="#contato" onClick={closeMenu}>
            Contato
          </a>
          <Link href="/login" className="nav-login" onClick={closeMenu}>
            Acessar minha conta
          </Link>
        </nav>

        <Link href="/login" className="header-cta">
          Acessar minha conta <span aria-hidden="true">↗</span>
        </Link>

        <button
          className="menu"
          type="button"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-media" aria-hidden="true" />
          <div className="hero-shade" />
          <div className={`hero-content reveal${isHeroVisible ? ' is-visible' : ''}`}>
            <p className="eyebrow">{content.heroEyebrow}</p>
            <h1>
              {content.heroTitleLine1}
              <br />
              {content.heroTitleLine2}
            </h1>
            <p className="hero-copy">{content.heroCopy}</p>
            <a className="text-link light" href="#produtos">
              {content.heroCta} <span>↓</span>
            </a>
          </div>
          <div className="hero-index">
            01 <i /> matéria que inspira
          </div>
        </section>

        <section className="intro section" id="sobre">
          <div>
            <p className="eyebrow dark">{content.introEyebrow}</p>
            <h2>{content.introTitle}</h2>
          </div>
          <div className="intro-copy">
            <p>{content.introCopy}</p>
            <a className="text-link" href="#contato">
              {content.introCta} <span>↗</span>
            </a>
          </div>
        </section>

        <section className="numbers">
          {content.stats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="products section" id="produtos">
          <div className="section-head">
            <p className="eyebrow dark">{content.productsEyebrow}</p>
            <h2>
              {content.productsTitleLine1}
              <br />
              {content.productsTitleLine2}
            </h2>
            <p>{content.productsSubtitle}</p>
          </div>

          {mainProduct && (
            <article className="product product-main">
              <Image
                src={mainProduct.image}
                alt={mainProduct.alt}
                width={900}
                height={610}
                loading="lazy"
                sizes="(max-width: 900px) 50vw, 40vw"
                unoptimized={mainProduct.image.startsWith('http')}
              />
              <div className="product-caption">
                <span>{mainProduct.indexLabel}</span>
                <h3>{mainProduct.title}</h3>
                <p>{mainProduct.description}</p>
              </div>
            </article>
          )}

          {sideProduct && (
            <article className="product product-side">
              <Image
                src={sideProduct.image}
                alt={sideProduct.alt}
                width={720}
                height={430}
                loading="lazy"
                sizes="(max-width: 900px) 50vw, 25vw"
                unoptimized={sideProduct.image.startsWith('http')}
              />
              <div className="product-caption">
                <span>{sideProduct.indexLabel}</span>
                <h3>{sideProduct.title}</h3>
                <p>{sideProduct.description}</p>
              </div>
            </article>
          )}
        </section>

        <section className="feature">
          <div className="feature-image">
            <Image
              src={content.featureImage}
              alt={content.featureImageAlt}
              width={1100}
              height={850}
              loading="lazy"
              sizes="50vw"
              unoptimized={content.featureImage.startsWith('http')}
            />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">{content.featureEyebrow}</p>
            <h2>
              <MultlineTitle value={content.featureTitle} />
            </h2>
            <p>{content.featureCopy}</p>
            <ul>
              {content.featureBullets.map((bullet, index) => (
                <li key={bullet}>
                  <span>{String(index + 1).padStart(2, '0')}</span> {bullet}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="gallery-section" aria-labelledby="gallery-title">
          <div className="gallery-heading section">
            <p className="eyebrow dark">{content.galleryEyebrow}</p>
            <h2 id="gallery-title">
              {content.galleryTitleLine1}
              <br />
              {content.galleryTitleLine2}
            </h2>
            <p>{content.gallerySubtitle}</p>
          </div>

          <div className="gallery-carousel" aria-label="Carrossel de texturas">
            {content.carouselSlides.map((slide) => (
              <figure
                key={`${slide.image}-${slide.caption}`}
                className={
                  slide.layout === 'wide'
                    ? 'gallery-wide'
                    : slide.layout === 'tall'
                      ? 'gallery-tall'
                      : undefined
                }
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={slide.layout === 'wide' ? 1200 : 600}
                  height={slide.layout === 'tall' ? 800 : slide.layout === 'wide' ? 675 : 600}
                  loading="lazy"
                  unoptimized={slide.image.startsWith('http')}
                />
                <figcaption>{slide.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="palette section" id="cores">
          <div className="palette-title">
            <p className="eyebrow dark">{content.paletteEyebrow}</p>
            <h2>
              {content.paletteTitleLine1}
              <br />
              {content.paletteTitleLine2}
            </h2>
          </div>

          <div className="swatches" aria-label="Seleção de cores">
            {content.swatches.map((swatch) => (
              <div key={swatch.name} style={{ '--c': swatch.color } as CSSProperties}>
                <i />
                <span>{swatch.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cta" id="contato">
          <div className="cta-bg" />
          <div className="cta-content">
            <p className="eyebrow">{content.contactEyebrow}</p>
            <h2>
              <MultlineTitle value={content.contactTitle} />
            </h2>
            <p>{content.contactCopy}</p>

            <form className="contact-form" id="contact-form" onSubmit={handleContactSubmit}>
              <div className="contact-form-row">
                <label>
                  <span>Nome</span>
                  <input
                    type="text"
                    name="nome"
                    autoComplete="name"
                    placeholder="Seu nome"
                    required
                  />
                </label>
                <label>
                  <span>E-mail</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="voce@empresa.com.br"
                    required
                  />
                </label>
              </div>
              <label>
                <span>Telefone</span>
                <input
                  type="tel"
                  name="telefone"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  required
                />
              </label>
              <button className="button" type="submit">
                {content.contactButton} <span aria-hidden="true">↗</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <Image
            src="/images/trancatto/asset-5.png"
            alt="Trançatto"
            width={200}
            height={59}
            unoptimized
          />
          <p>
            <MultlineTitle value={content.footerTagline} />
          </p>
        </div>

        <div>
          <small>Navegue</small>
          <a href="#sobre">A Trançatto</a>
          <a href="#produtos">Produtos</a>
          <a href="#cores">Cores</a>
        </div>

        <div>
          <small>Conecte-se</small>
          <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer">
            Instagram ↗
          </a>
          <a
            href={`https://wa.me/${content.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ↗
          </a>
        </div>

        <p className="copyright">
          © {currentYear} Trançatto. Todos os direitos reservados.{' '}
          <span>
            Desenvolvido por{' '}
            <a href="https://metry.cc/" target="_blank" rel="noopener noreferrer">
              metry.cc ↗
            </a>{' '}
            e{' '}
            <a href="https://bemseutipo.com.br/" target="_blank" rel="noopener noreferrer">
              BST ↗
            </a>
          </span>
        </p>
      </footer>

      <a
        className="whatsapp"
        href={`https://wa.me/${content.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
          />
        </svg>
      </a>
    </div>
  );
}
