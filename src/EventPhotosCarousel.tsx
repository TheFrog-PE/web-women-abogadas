import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Eye, Camera } from 'lucide-react';

interface EventPhotosCarouselProps {
  photos: string[];
  eventTitle: string;
  isPast?: boolean;
  className?: string;
}

const PHOTO_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 24 24' fill='%2394A3B8'%3E%3Crect width='24' height='24' fill='%23CBD5E1'/%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";

export const EventPhotosCarousel: React.FC<EventPhotosCarouselProps> = ({
  photos,
  eventTitle,
  isPast = true,
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag states
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);
  const pauseTimeout = useRef<number | null>(null);

  // Check scroll bounds
  const updateScrollBounds = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Estimate active item
    const itemWidth = 300; // estimated card + gap
    const idx = Math.min(
      photos.length - 1,
      Math.max(0, Math.round(el.scrollLeft / itemWidth))
    );
    setActiveIndex(idx);
  }, [photos.length]);

  // Temporary pause on interaction with smooth resume
  const handleInteractionStart = () => {
    if (pauseTimeout.current) {
      window.clearTimeout(pauseTimeout.current);
      pauseTimeout.current = null;
    }
    setIsPaused(true);
  };

  const handleInteractionEnd = (resumeDelayMs = 2800) => {
    if (pauseTimeout.current) {
      window.clearTimeout(pauseTimeout.current);
    }
    pauseTimeout.current = window.setTimeout(() => {
      setIsPaused(false);
    }, resumeDelayMs);
  };

  // Continuous side-to-side auto-movement ("en constante movimiento de lado a lado")
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || photos.length <= 1) return;

    let animId: number;
    let direction = 1; // 1 = scroll right, -1 = scroll left
    let waitFrames = 0;

    const tick = () => {
      if (!isPaused && lightboxIndex === null && el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 15) {
          if (waitFrames > 0) {
            waitFrames--;
          } else {
            if (direction === 1) {
              el.scrollLeft += 0.85; // smooth gliding speed
              if (el.scrollLeft >= maxScroll - 2) {
                direction = -1; // reverse when reaching the end
                waitFrames = 60; // pause for ~1s at turn-around
              }
            } else {
              el.scrollLeft -= 0.85;
              if (el.scrollLeft <= 2) {
                direction = 1; // reverse when reaching start
                waitFrames = 60; // pause for ~1s at start
              }
            }
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      if (pauseTimeout.current) window.clearTimeout(pauseTimeout.current);
    };
  }, [isPaused, lightboxIndex, photos.length]);

  // Manual scroll with arrow buttons
  const scrollStep = (direction: 'left' | 'right') => {
    handleInteractionStart();
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
    handleInteractionEnd(3500);
  };

  // Scroll to specific index via dot
  const scrollToIndex = (index: number) => {
    handleInteractionStart();
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('.event-carousel-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
    handleInteractionEnd(3500);
  };

  // Desktop drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isMouseDown.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    handleInteractionStart();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.4; // multiplier for pleasant resistance
    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }
    el.scrollLeft = scrollLeftStart.current - walk;
    updateScrollBounds();
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    handleInteractionEnd(2500);
  };

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? photos.length - 1 : prev - 1) : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos.length]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className={`event-photo-carousel-wrapper ${className}`} style={{ width: '100%', marginBottom: '2rem' }}>
      
      {/* ── HEADER DEL CARRUSEL: TÍTULO, BADGE Y CONTROLES ── */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div 
            style={{ 
              backgroundColor: '#f4f4f4', 
              color: '#af1daa', 
              border: '1px solid #e6affc', 
              padding: '0.35rem 0.85rem', 
              borderRadius: '9999px', 
              fontSize: '0.78rem', 
              fontWeight: '800', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem',
              letterSpacing: '0.5px'
            }}
          >
            <Camera size={14} style={{ color: '#af1daa' }} />
            <span>{photos.length} Fotos del Evento</span>
          </div>
          <span 
            style={{ 
              fontSize: '0.8rem', 
              color: '#64748B', 
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={13} style={{ color: '#ec4899' }} />
            Desliza con el dedo o clic para ampliar
          </span>
        </div>

        {/* Flechas de navegación rápida */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => scrollStep('left')}
            aria-label="Foto anterior"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #e6affc',
              color: '#af1daa',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(175, 29, 170, 0.1)',
              transition: 'all 0.2s ease',
              opacity: canScrollLeft ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#af1daa';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#af1daa';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => scrollStep('right')}
            aria-label="Foto siguiente"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #e6affc',
              color: '#af1daa',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(175, 29, 170, 0.1)',
              transition: 'all 0.2s ease',
              opacity: canScrollRight ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#af1daa';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#af1daa';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── TRACK CONTENEDOR CON MOVIMIENTO CONSTANTE Y SWIPE TÁCTIL ── */}
      <div
        ref={scrollRef}
        className="event-carousel-track"
        onScroll={updateScrollBounds}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={() => {
          handleMouseUp();
          handleInteractionEnd(1800);
        }}
        onTouchStart={handleInteractionStart}
        onTouchEnd={() => handleInteractionEnd(2600)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x proximity',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '0.5rem 0.25rem 0.75rem',
          cursor: isMouseDown.current ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'pan-x'
        }}
      >
        {photos.map((src, i) => (
          <div
            key={i}
            className="event-carousel-card card-hover"
            onClick={() => {
              if (!hasMoved.current) {
                setLightboxIndex(i);
              }
            }}
            style={{
              flex: '0 0 auto',
              width: 'min(310px, 78vw)',
              height: '215px',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#F1F5F9',
              border: '1.5px solid #e6affc',
              boxShadow: '0 8px 24px rgba(175, 29, 170, 0.08)',
              position: 'relative',
              scrollSnapAlign: 'start',
              cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
          >
            <img
              src={src}
              alt={`Fotografía ${i + 1} del evento ${eventTitle} - WIC Colombia`}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: '#CBD5E1',
                display: 'block',
                pointerEvents: 'none'
              }}
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.onerror = null;
                t.src = PHOTO_FALLBACK;
              }}
            />

            {/* Gradiente sutil y badge de foto */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.15) 45%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0.85rem'
              }}
            >
              {/* Badge superior con número */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}
                >
                  {String(i + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(175, 29, 170, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  title="Toca para ampliar"
                >
                  <Eye size={14} />
                </span>
              </div>

              {/* Texto inferior */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#FFFFFF', fontSize: '0.82rem', fontWeight: '700', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
                  WIC Colombia
                </span>
                <span style={{ color: '#F472B6', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Ampliar
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── INDICADORES DOTS / PUNTOS DE AVANCE ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          marginTop: '0.85rem'
        }}
      >
        {photos.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToIndex(idx)}
            aria-label={`Ver foto ${idx + 1}`}
            style={{
              width: activeIndex === idx ? '24px' : '7px',
              height: '7px',
              borderRadius: '9999px',
              backgroundColor: activeIndex === idx ? '#af1daa' : '#E2E8F0',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        ))}
      </div>

      {/* ── MODAL LIGHTBOX PANTALLA COMPLETA AL TOCAR / SELECCIONAR CON EL DEDO ── */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          {/* Header Lightbox */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              color: '#FFFFFF'
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', color: '#F472B6', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {eventTitle} · {isPast ? 'Evento Realizado' : 'Galería'}
              </p>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                Fotografía {lightboxIndex + 1} de {photos.length}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Cerrar vista completa"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#af1daa';
                e.currentTarget.style.borderColor = '#eb54ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Imagen Principal en Pantalla Completa */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '1200px',
              width: '100%',
              margin: 'auto',
              maxHeight: '75vh'
            }}
          >
            {/* Flecha Izquierda Modal */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? photos.length - 1 : prev - 1) : 0));
              }}
              aria-label="Foto anterior"
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#af1daa';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={26} />
            </button>

            <img
              src={photos[lightboxIndex]}
              alt={`Fotografía ampliada ${lightboxIndex + 1} de ${eventTitle}`}
              style={{
                maxHeight: '72vh',
                maxWidth: '92vw',
                objectFit: 'contain',
                borderRadius: '16px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.onerror = null;
                t.src = PHOTO_FALLBACK;
              }}
            />

            {/* Flecha Derecha Modal */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
              }}
              aria-label="Foto siguiente"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#af1daa';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={26} />
            </button>
          </div>

          {/* Miniaturas inferiores para saltar a cualquier foto */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              gap: '0.6rem',
              overflowX: 'auto',
              justifyContent: 'center',
              padding: '0.75rem 0',
              maxWidth: '900px',
              margin: '0 auto',
              scrollbarWidth: 'none'
            }}
          >
            {photos.map((thumbSrc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                style={{
                  width: '52px',
                  height: '40px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: lightboxIndex === idx ? '2px solid #eb54ff' : '2px solid rgba(255, 255, 255, 0.25)',
                  opacity: lightboxIndex === idx ? 1 : 0.5,
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: '#1E293B',
                  flexShrink: 0,
                  transform: lightboxIndex === idx ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <img
                  src={thumbSrc}
                  alt={`Miniatura ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.onerror = null;
                    t.src = PHOTO_FALLBACK;
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
