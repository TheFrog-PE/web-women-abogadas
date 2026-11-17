import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Sparkles, Camera } from 'lucide-react';

interface EventPhotosCarouselProps {
  photos: string[];
  eventTitle: string;
  isPast?: boolean;
  className?: string;
  hideHeader?: boolean;
}

const PHOTO_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 24 24' fill='%2394A3B8'%3E%3Crect width='24' height='24' fill='%23CBD5E1'/%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";

export const EventPhotosCarousel: React.FC<EventPhotosCarouselProps> = ({
  photos,
  eventTitle,
  isPast = true,
  className = '',
  hideHeader = false
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag & touch gesture states
  const isMouseDown = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);
  const dragDistance = useRef(0);
  const pauseTimeout = useRef<number | null>(null);
  const resetMovedTimeout = useRef<number | null>(null);
  const DRAG_THRESHOLD = 8; // movement threshold to distinguish click/tap from drag/swipe

  // Check scroll bounds and determine active index accurately
  const updateScrollBounds = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    const cards = el.querySelectorAll<HTMLElement>('.event-carousel-card');
    if (cards.length > 0) {
      let closestIdx = 0;
      let minDiff = Infinity;
      const containerLeft = el.getBoundingClientRect().left;
      cards.forEach((card, idx) => {
        const diff = Math.abs(card.getBoundingClientRect().left - containerLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    }
  }, []);

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

  // Scroll strictly within container without ever triggering window scroll
  const scrollToCard = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('.event-carousel-card');
    const targetCard = cards[index];
    if (!targetCard) return;

    const containerRect = el.getBoundingClientRect();
    const cardRect = targetCard.getBoundingClientRect();
    const targetScrollLeft = el.scrollLeft + (cardRect.left - containerRect.left);

    el.scrollTo({
      left: targetScrollLeft,
      behavior
    });
  }, []);

  // Feature F1: Sequential one-by-one periodic autoplay (right-to-left every ~3.5s)
  // Autoplay pauses on touch/hover and while lightbox modal is open, resuming after interaction ends.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || photos.length <= 1) return;
    if (isPaused || lightboxIndex !== null) return;

    const timer = window.setInterval(() => {
      const currentEl = scrollRef.current;
      if (!currentEl) return;

      // Crucial: Only autoplay when the carousel is actually in the viewport!
      // This prevents the carousel from stealing page focus or causing window scroll jumps when scrolled past it.
      const rect = currentEl.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      const cards = currentEl.querySelectorAll<HTMLElement>('.event-carousel-card');
      if (cards.length === 0) return;

      setActiveIndex((prev) => {
        const nextIdx = (prev + 1) % photos.length;
        const targetCard = cards[nextIdx];
        if (targetCard) {
          const containerRect = currentEl.getBoundingClientRect();
          const cardRect = targetCard.getBoundingClientRect();
          const targetScrollLeft = currentEl.scrollLeft + (cardRect.left - containerRect.left);
          currentEl.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        }
        return nextIdx;
      });
    }, 3500);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, lightboxIndex, photos.length]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeout.current) window.clearTimeout(pauseTimeout.current);
      if (resetMovedTimeout.current) window.clearTimeout(resetMovedTimeout.current);
    };
  }, []);

  // Feature F2: Smooth card-by-card arrow navigation with wrapping
  const scrollStep = (direction: 'left' | 'right') => {
    handleInteractionStart();
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('.event-carousel-card');
    if (cards.length === 0) return;

    let targetIndex = direction === 'right' ? activeIndex + 1 : activeIndex - 1;
    if (targetIndex >= photos.length) {
      targetIndex = 0; // wrap around to first photo
    } else if (targetIndex < 0) {
      targetIndex = photos.length - 1; // wrap around to last photo
    }

    scrollToCard(targetIndex);
    setActiveIndex(targetIndex);
    handleInteractionEnd(3500);
  };

  // Scroll to specific index via dot
  const scrollToIndex = (index: number) => {
    handleInteractionStart();
    scrollToCard(index);
    setActiveIndex(index);
    handleInteractionEnd(3500);
  };

  // Feature F4: Mouse drag handlers with strict movement threshold and reset
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isMouseDown.current = true;
    hasMoved.current = false;
    dragDistance.current = 0;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    scrollLeftStart.current = el.scrollLeft;
    handleInteractionStart();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - dragStartY.current;
    const dist = Math.hypot(deltaX, deltaY);
    dragDistance.current = dist;

    if (dist > DRAG_THRESHOLD) {
      hasMoved.current = true;
      e.preventDefault();
      el.scrollLeft = scrollLeftStart.current - deltaX;
      updateScrollBounds();
    }
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    handleInteractionEnd(2500);

    if (hasMoved.current) {
      if (resetMovedTimeout.current) window.clearTimeout(resetMovedTimeout.current);
      resetMovedTimeout.current = window.setTimeout(() => {
        hasMoved.current = false;
      }, 60);
    } else {
      hasMoved.current = false;
    }
  };

  // Feature F4: Touch swipe handlers with distance tracking and reset
  const handleTouchStart = (e: React.TouchEvent) => {
    handleInteractionStart();
    const touch = e.touches[0];
    if (touch) {
      dragStartX.current = touch.clientX;
      dragStartY.current = touch.clientY;
      dragDistance.current = 0;
      hasMoved.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      const deltaX = touch.clientX - dragStartX.current;
      const deltaY = touch.clientY - dragStartY.current;
      const dist = Math.hypot(deltaX, deltaY);
      dragDistance.current = dist;
      if (dist > DRAG_THRESHOLD) {
        hasMoved.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    handleInteractionEnd(2600);
    if (hasMoved.current) {
      if (resetMovedTimeout.current) window.clearTimeout(resetMovedTimeout.current);
      resetMovedTimeout.current = window.setTimeout(() => {
        hasMoved.current = false;
      }, 80);
    } else {
      hasMoved.current = false;
    }
  };

  // Lightbox: bloqueo de scroll de pantalla completa y navegación por teclado (ESC, flechas)
  useEffect(() => {
    if (lightboxIndex === null) return;

    // Bloquear scroll de toda la pantalla hasta cerrar el lightbox
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? photos.length - 1 : prev - 1) : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, photos.length]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className={`event-photo-carousel-wrapper ${className}`} style={{ width: '100%', marginBottom: '2rem' }}>
      
      {/* ── HEADER DEL CARRUSEL: TÍTULO, BADGE Y CONTROLES ── */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: hideHeader ? 'flex-end' : 'space-between', 
          gap: '0.75rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {!hideHeader && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
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
        )}

        {/* Flechas de navegación rápida */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: hideHeader ? 'auto' : undefined }}>
          <button
            type="button"
            className="carousel-nav-btn"
            onClick={() => scrollStep('left')}
            aria-label="Foto anterior"
            style={{
              width: '36px',
              height: '36px',
              minWidth: '36px',
              minHeight: '36px',
              padding: '0 !important',
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
              opacity: canScrollLeft ? 1 : 0.7
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
            className="carousel-nav-btn"
            onClick={() => scrollStep('right')}
            aria-label="Foto siguiente"
            style={{
              width: '36px',
              height: '36px',
              minWidth: '36px',
              minHeight: '36px',
              padding: '0 !important',
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
              opacity: canScrollRight ? 1 : 0.7
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

      {/* ── TRACK CONTENEDOR CON MOVIMIENTO PERIÓDICO Y SWIPE TÁCTIL ── */}
      <div
        ref={scrollRef}
        className="event-carousel-track"
        onScroll={updateScrollBounds}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={() => {
          handleMouseUp();
          handleInteractionEnd(1800);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
                padding: '0.85rem',
                pointerEvents: 'none'
              }}
            >
              {/* Badge superior con número */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
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
              </div>

              {/* Texto inferior */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <span style={{ color: '#FFFFFF', fontSize: '0.82rem', fontWeight: '700', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
                  WIC Colombia
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
            className="carousel-dot-btn"
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

      {/* ── MODAL LIGHTBOX PANTALLA COMPLETA DIRECTO EN BODY (PORTAL) ── */}
      {lightboxIndex !== null && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999999,
            backgroundColor: 'rgba(5, 5, 10, 0.96)',
            backdropFilter: 'blur(18px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Header Lightbox Superior */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '1300px',
              margin: '0 auto',
              padding: '0.25rem 0.5rem',
              color: '#FFFFFF',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ 
                backgroundColor: 'rgba(235, 84, 255, 0.16)', 
                border: '1px solid rgba(235, 84, 255, 0.45)', 
                color: '#F472B6', 
                padding: '0.35rem 0.85rem', 
                borderRadius: '9999px', 
                fontSize: '0.75rem', 
                fontWeight: '800', 
                letterSpacing: '1px', 
                textTransform: 'uppercase' 
              }}>
                {eventTitle} · {isPast ? 'Evento Realizado' : 'Galería'}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#E2E8F0' }}>
                Fotografía {lightboxIndex + 1} de {photos.length}
              </span>
            </div>

            <button
              type="button"
              className="lightbox-btn"
              onClick={() => setLightboxIndex(null)}
              aria-label="Cerrar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                padding: '0 !important',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#af1daa';
                e.currentTarget.style.borderColor = '#eb54ff';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Imagen Principal en Pantalla Completa Centrada */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '1300px',
              width: '100%',
              margin: 'auto',
              flex: 1,
              maxHeight: '78vh'
            }}
          >
            {/* Flecha Izquierda Modal */}
            <button
              type="button"
              className="lightbox-btn"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? photos.length - 1 : prev - 1) : 0));
              }}
              aria-label="Foto anterior"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                minWidth: '52px',
                minHeight: '52px',
                padding: '0 !important',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.82)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#af1daa';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.82)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={28} />
            </button>

            <img
              src={photos[lightboxIndex]}
              alt={`Fotografía ampliada ${lightboxIndex + 1} de ${eventTitle}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: '75vh',
                maxWidth: '88vw',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                userSelect: 'none'
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
              className="lightbox-btn"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
              }}
              aria-label="Foto siguiente"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                minWidth: '52px',
                minHeight: '52px',
                padding: '0 !important',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.82)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#af1daa';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.82)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Miniaturas inferiores para saltar a cualquier foto */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              gap: '0.65rem',
              overflowX: 'auto',
              justifyContent: 'center',
              padding: '0.6rem 0.5rem',
              maxWidth: '900px',
              margin: '0 auto',
              scrollbarWidth: 'none',
              zIndex: 10
            }}
          >
            {photos.map((thumbSrc, idx) => (
              <button
                key={idx}
                type="button"
                className="lightbox-btn"
                onClick={() => setLightboxIndex(idx)}
                style={{
                  width: '56px',
                  height: '42px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: lightboxIndex === idx ? '2px solid #eb54ff' : '2px solid rgba(255, 255, 255, 0.25)',
                  opacity: lightboxIndex === idx ? 1 : 0.45,
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: '#1E293B',
                  flexShrink: 0,
                  transform: lightboxIndex === idx ? 'scale(1.12)' : 'scale(1)',
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
        </div>,
        document.body
      )}
    </div>
  );
};
