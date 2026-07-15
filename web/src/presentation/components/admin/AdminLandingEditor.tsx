'use client';

import { useEffect, useState } from 'react';
import type {
  LandingCarouselSlide,
  LandingContent,
  LandingProduct,
  LandingStat,
  LandingSwatch,
} from '@/domain/entities/LandingContent';
import { DEFAULT_LANDING_CONTENT } from '@/domain/landing/defaultLandingContent';
import { container } from '@/infrastructure/di/container';

function MultilineHint({ text }: { text: string }) {
  return <span className="landing-cms__hint">{text}</span>;
}

export function AdminLandingEditor() {
  const [content, setContent] = useState<LandingContent>(DEFAULT_LANDING_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusKind, setStatusKind] = useState<'ok' | 'err' | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await container.getLandingContentRepository().get();
        if (!cancelled) {
          setContent(data);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setStatus('Não foi possível carregar a landing. Usando conteúdo padrão.');
          setStatusKind('err');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = <K extends keyof LandingContent>(key: K, value: LandingContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const updateSlide = (index: number, patch: Partial<LandingCarouselSlide>) => {
    setContent((prev) => ({
      ...prev,
      carouselSlides: prev.carouselSlides.map((slide, i) =>
        i === index ? { ...slide, ...patch } : slide,
      ),
    }));
  };

  const addSlide = () => {
    setContent((prev) => ({
      ...prev,
      carouselSlides: [
        ...prev.carouselSlides,
        {
          image: '/images/trancatto/gallery/verde-1.jpg',
          alt: 'Nova imagem',
          caption: 'Nova legenda',
          layout: 'default',
        },
      ],
    }));
  };

  const removeSlide = (index: number) => {
    setContent((prev) => ({
      ...prev,
      carouselSlides: prev.carouselSlides.filter((_, i) => i !== index),
    }));
  };

  const updateProduct = (index: number, patch: Partial<LandingProduct>) => {
    setContent((prev) => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, ...patch } : product,
      ),
    }));
  };

  const updateStat = (index: number, patch: Partial<LandingStat>) => {
    setContent((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)),
    }));
  };

  const updateSwatch = (index: number, patch: Partial<LandingSwatch>) => {
    setContent((prev) => ({
      ...prev,
      swatches: prev.swatches.map((swatch, i) =>
        i === index ? { ...swatch, ...patch } : swatch,
      ),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    setStatusKind(null);
    try {
      await container.getLandingContentRepository().save(content);
      setStatus('Landing page salva. As alterações já aparecem no site público.');
      setStatusKind('ok');
    } catch (error) {
      console.error(error);
      setStatus('Erro ao salvar. Verifique se a sua conta tem perfil admin no Firestore.');
      setStatusKind('err');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="orders-timeline-loading">
        <p>Carregando conteúdo da landing...</p>
      </div>
    );
  }

  return (
    <div className="landing-cms">
      <div className="landing-cms__toolbar">
        <div>
          <p className="kanban-toolbar__summary">
            Edite textos, produtos, cores e o carrossel da landing sem alterar código.
          </p>
          {status && (
            <p
              className={`landing-cms__status${statusKind ? ` landing-cms__status--${statusKind}` : ''}`}
            >
              {status}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-cms__preview-link"
          >
            Ver landing page ↗
          </a>
          <button
            type="button"
            className="kanban-toolbar__action"
            onClick={() => void handleSave()}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar landing'}
          </button>
        </div>
      </div>

      <div className="landing-cms__grid">
        <section className="landing-cms__panel">
          <h3>Hero</h3>
          <label>
            Eyebrow
            <input
              value={content.heroEyebrow}
              onChange={(e) => updateField('heroEyebrow', e.target.value)}
            />
          </label>
          <label>
            Título (linha 1)
            <input
              value={content.heroTitleLine1}
              onChange={(e) => updateField('heroTitleLine1', e.target.value)}
            />
          </label>
          <label>
            Título (linha 2)
            <input
              value={content.heroTitleLine2}
              onChange={(e) => updateField('heroTitleLine2', e.target.value)}
            />
          </label>
          <label>
            Texto
            <textarea
              rows={3}
              value={content.heroCopy}
              onChange={(e) => updateField('heroCopy', e.target.value)}
            />
          </label>
          <label>
            CTA
            <input
              value={content.heroCta}
              onChange={(e) => updateField('heroCta', e.target.value)}
            />
          </label>
        </section>

        <section className="landing-cms__panel">
          <h3>Introdução</h3>
          <label>
            Eyebrow
            <input
              value={content.introEyebrow}
              onChange={(e) => updateField('introEyebrow', e.target.value)}
            />
          </label>
          <label>
            Título
            <input
              value={content.introTitle}
              onChange={(e) => updateField('introTitle', e.target.value)}
            />
          </label>
          <label>
            Texto
            <textarea
              rows={4}
              value={content.introCopy}
              onChange={(e) => updateField('introCopy', e.target.value)}
            />
          </label>
          <label>
            CTA
            <input
              value={content.introCta}
              onChange={(e) => updateField('introCta', e.target.value)}
            />
          </label>
          <label>
            WhatsApp (somente números, com DDI)
            <input
              value={content.whatsappNumber}
              onChange={(e) => updateField('whatsappNumber', e.target.value)}
            />
          </label>
          <label>
            Instagram URL
            <input
              value={content.instagramUrl}
              onChange={(e) => updateField('instagramUrl', e.target.value)}
            />
          </label>
        </section>

        <section className="landing-cms__panel">
          <h3>Números</h3>
          {content.stats.map((stat, index) => (
            <div key={`stat-${index}`} className="landing-cms__slide">
              <label>
                Valor
                <input
                  value={stat.value}
                  onChange={(e) => updateStat(index, { value: e.target.value })}
                />
              </label>
              <label>
                Rótulo
                <input
                  value={stat.label}
                  onChange={(e) => updateStat(index, { label: e.target.value })}
                />
              </label>
            </div>
          ))}
        </section>

        <section className="landing-cms__panel">
          <h3>Contato</h3>
          <label>
            Eyebrow
            <input
              value={content.contactEyebrow}
              onChange={(e) => updateField('contactEyebrow', e.target.value)}
            />
          </label>
          <label>
            Título (use Enter para quebrar linha)
            <textarea
              rows={3}
              value={content.contactTitle}
              onChange={(e) => updateField('contactTitle', e.target.value)}
            />
          </label>
          <label>
            Texto
            <textarea
              rows={3}
              value={content.contactCopy}
              onChange={(e) => updateField('contactCopy', e.target.value)}
            />
          </label>
          <label>
            Botão
            <input
              value={content.contactButton}
              onChange={(e) => updateField('contactButton', e.target.value)}
            />
          </label>
        </section>
      </div>

      <section className="landing-cms__panel">
        <h3>Produtos</h3>
        <label>
          Eyebrow
          <input
            value={content.productsEyebrow}
            onChange={(e) => updateField('productsEyebrow', e.target.value)}
          />
        </label>
        <div className="landing-cms__grid">
          <label>
            Título linha 1
            <input
              value={content.productsTitleLine1}
              onChange={(e) => updateField('productsTitleLine1', e.target.value)}
            />
          </label>
          <label>
            Título linha 2
            <input
              value={content.productsTitleLine2}
              onChange={(e) => updateField('productsTitleLine2', e.target.value)}
            />
          </label>
        </div>
        <label>
          Subtítulo
          <textarea
            rows={2}
            value={content.productsSubtitle}
            onChange={(e) => updateField('productsSubtitle', e.target.value)}
          />
        </label>
        {content.products.map((product, index) => (
          <div key={`product-${index}`} className="landing-cms__slide">
            <strong>Produto {index + 1}</strong>
            <label>
              Título
              <input
                value={product.title}
                onChange={(e) => updateProduct(index, { title: e.target.value })}
              />
            </label>
            <label>
              Descrição
              <textarea
                rows={2}
                value={product.description}
                onChange={(e) => updateProduct(index, { description: e.target.value })}
              />
            </label>
            <label>
              URL da imagem
              <input
                value={product.image}
                onChange={(e) => updateProduct(index, { image: e.target.value })}
              />
            </label>
            <label>
              Alt
              <input
                value={product.alt}
                onChange={(e) => updateProduct(index, { alt: e.target.value })}
              />
            </label>
          </div>
        ))}
      </section>

      <section className="landing-cms__panel">
        <div className="landing-cms__toolbar">
          <h3>Carrossel / galeria</h3>
          <button type="button" className="kanban-modal__secondary" onClick={addSlide}>
            + Slide
          </button>
        </div>
        <MultilineHint text="Cada slide aparece no carrossel da landing. Pode usar URLs públicas ou caminhos /images/..." />
        {content.carouselSlides.map((slide, index) => (
          <div key={`slide-${index}`} className="landing-cms__slide">
            <strong>Slide {index + 1}</strong>
            <label>
              URL da imagem
              <input
                value={slide.image}
                onChange={(e) => updateSlide(index, { image: e.target.value })}
              />
            </label>
            <label>
              Alt
              <input
                value={slide.alt}
                onChange={(e) => updateSlide(index, { alt: e.target.value })}
              />
            </label>
            <label>
              Legenda
              <input
                value={slide.caption}
                onChange={(e) => updateSlide(index, { caption: e.target.value })}
              />
            </label>
            <label>
              Layout
              <select
                value={slide.layout}
                onChange={(e) =>
                  updateSlide(index, {
                    layout: e.target.value as LandingCarouselSlide['layout'],
                  })
                }
              >
                <option value="default">Padrão</option>
                <option value="wide">Largo</option>
                <option value="tall">Alto</option>
              </select>
            </label>
            <div className="landing-cms__slide-actions">
              <button
                type="button"
                className="text-red-600 text-sm font-medium"
                onClick={() => removeSlide(index)}
              >
                Remover slide
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="landing-cms__panel">
        <h3>Paleta de cores</h3>
        <div className="landing-cms__grid">
          {content.swatches.map((swatch, index) => (
            <div key={`swatch-${index}`} className="landing-cms__slide">
              <label>
                Nome
                <input
                  value={swatch.name}
                  onChange={(e) => updateSwatch(index, { name: e.target.value })}
                />
              </label>
              <label>
                Cor (hex)
                <input
                  value={swatch.color}
                  onChange={(e) => updateSwatch(index, { color: e.target.value })}
                />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
