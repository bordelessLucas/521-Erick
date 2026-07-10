'use client';

import { FormEvent, useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/trancatto.css';

const WHATSAPP_NUMBER = '5517997579903';

const SWATCHES = [
  { color: '#1b3227', name: 'Verde pinho' },
  { color: '#c25e37', name: 'Terracota' },
  { color: '#cebba4', name: 'Areia' },
  { color: '#825247', name: 'Bordô' },
  { color: '#283950', name: 'Azul malta' },
  { color: '#71645d', name: 'Bronze' },
] as const;

export function TrancattoLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const currentYear = new Date().getFullYear();

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

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
            <p className="eyebrow">Fabricação própria · há mais de 15 anos</p>
            <h1>
              Tramas que
              <br />
              transformam.
            </h1>
            <p className="hero-copy">
              Cordas e tricôs náuticos criados para dar forma, resistência e identidade aos seus
              móveis.
            </p>
            <a className="text-link light" href="#produtos">
              Conheça nossos produtos <span>↓</span>
            </a>
          </div>
          <div className="hero-index">
            01 <i /> matéria que inspira
          </div>
        </section>

        <section className="intro section" id="sobre">
          <div>
            <p className="eyebrow dark">Do fio ao acabamento</p>
            <h2>Não entregamos apenas cordas. Entregamos possibilidades.</h2>
          </div>
          <div className="intro-copy">
            <p>
              Todo o processo acontece dentro de casa. Da seleção dos fios ao acabamento final,
              controlamos cada detalhe para garantir cores firmes, medidas padronizadas e
              performance consistente.
            </p>
            <a className="text-link" href="#contato">
              Fale com nossa equipe <span>↗</span>
            </a>
          </div>
        </section>

        <section className="numbers">
          <div>
            <strong>15+</strong>
            <span>anos de experiência</span>
          </div>
          <div>
            <strong>UV</strong>
            <span>proteção para área externa</span>
          </div>
          <div>
            <strong>BR</strong>
            <span>envio para todo o Brasil</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>produção própria</span>
          </div>
        </section>

        <section className="products section" id="produtos">
          <div className="section-head">
            <p className="eyebrow dark">Linhas Trançatto</p>
            <h2>
              Engenharia,
              <br />
              toque e cor.
            </h2>
            <p>
              Materiais desenvolvidos para o setor moveleiro, com resistência estrutural e
              acabamento que valoriza o desenho.
            </p>
          </div>

          <article className="product product-main">
            <Image
              src="/images/trancatto/asset-6.png"
              alt="Detalhe de cordas e tricôs náuticos em terracota"
              width={900}
              height={610}
              loading="lazy"
              sizes="(max-width: 900px) 50vw, 40vw"
            />
            <div className="product-caption">
              <span>01</span>
              <h3>Tricô náutico</h3>
              <p>Robusto, marcante e disponível com ou sem enchimento.</p>
            </div>
          </article>

          <article className="product product-side">
            <Image
              src="/images/trancatto/asset-7.png"
              alt="Detalhe da trama de corda náutica"
              width={720}
              height={430}
              loading="lazy"
              sizes="(max-width: 900px) 50vw, 25vw"
            />
            <div className="product-caption">
              <span>02</span>
              <h3>Corda com alma</h3>
              <p>Firmeza, baixa absorção de umidade e secagem rápida.</p>
            </div>
          </article>
        </section>

        <section className="feature">
          <div className="feature-image">
            <Image
              src="/images/trancatto/asset-9.png"
              alt="Textura de corda náutica Trançatto"
              width={1100}
              height={850}
              loading="lazy"
              sizes="50vw"
            />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">Feita para durar</p>
            <h2>
              Por dentro,
              <br />
              tecnologia.
              <br />
              Por fora, design.
            </h2>
            <p>
              A combinação de EVA e polipropileno entrega estabilidade para assentos e encostos,
              resistência ao uso intenso e a liberdade criativa que cada projeto pede.
            </p>
            <ul>
              <li>
                <span>01</span> Resistência às condições externas
              </li>
              <li>
                <span>02</span> Excelente memória e estabilidade
              </li>
              <li>
                <span>03</span> Acabamento premium
              </li>
            </ul>
          </div>
        </section>

        <section className="gallery-section" aria-labelledby="gallery-title">
          <div className="gallery-heading section">
            <p className="eyebrow dark">Matéria em detalhe</p>
            <h2 id="gallery-title">
              Texturas para
              <br />
              ver de perto.
            </h2>
            <p>
              Tramas, espessuras e cores registradas na nossa produção. Cada linha nasce para
              ganhar escala nas mãos de quem projeta.
            </p>
          </div>

          <div className="gallery-grid">
            <figure className="gallery-wide">
              <Image
                src="/images/trancatto/gallery/verde-1.jpg"
                alt="Linha verde-pinho em detalhe"
                width={1200}
                height={675}
                loading="lazy"
              />
              <figcaption>Verde pinho · corda náutica</figcaption>
            </figure>
            <figure>
              <Image
                src="/images/trancatto/gallery/terra-1.jpg"
                alt="Trama terracota produzida pela Trançatto"
                width={600}
                height={600}
                loading="lazy"
              />
              <figcaption>Terracota · tricô náutico</figcaption>
            </figure>
            <figure>
              <Image
                src="/images/trancatto/gallery/verde-2.jpg"
                alt="Rolos de corda náutica verde-pinho"
                width={600}
                height={600}
                loading="lazy"
              />
              <figcaption>Acabamento e consistência</figcaption>
            </figure>
            <figure className="gallery-tall">
              <Image
                src="/images/trancatto/gallery/terra-2.jpg"
                alt="Detalhe do acabamento terracota"
                width={600}
                height={800}
                loading="lazy"
              />
              <figcaption>Cor firme · toque preciso</figcaption>
            </figure>
            <figure className="gallery-wide">
              <Image
                src="/images/trancatto/gallery/verde-3.jpg"
                alt="Produção de corda verde-pinho"
                width={1200}
                height={675}
                loading="lazy"
              />
              <figcaption>Produção própria · controle em cada etapa</figcaption>
            </figure>
          </div>
        </section>

        <section className="palette section" id="cores">
          <div className="palette-title">
            <p className="eyebrow dark">Paleta Trançatto</p>
            <h2>
              A cor também
              <br />
              constrói o projeto.
            </h2>
          </div>

          <div className="swatches" aria-label="Seleção de cores">
            {SWATCHES.map((swatch) => (
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
            <p className="eyebrow">Seu próximo projeto começa aqui</p>
            <h2>
              Vamos dar
              <br />
              forma
              <br />
              à sua ideia?
            </h2>
            <p>
              Fale com nosso time para receber o catálogo, consultar cores e encontrar a linha
              ideal.
            </p>

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
                Enviar pelo WhatsApp <span aria-hidden="true">↗</span>
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
            Cordas e tricôs náuticos
            <br />
            para móveis e decoração.
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
          <a href="https://www.instagram.com/trancatto.ind/" target="_blank" rel="noopener noreferrer">
            Instagram ↗
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
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
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
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
