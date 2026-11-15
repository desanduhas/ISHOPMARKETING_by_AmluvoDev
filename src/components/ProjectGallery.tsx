import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react';
import './project-gallery.css';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  tags: string[];
  gallery: string[];
};

const artworkTitles: Record<string, string> = {
  'devii-identity': 'Brand identity', 'devii-brandmark': 'The brand mark',
  'devii-brand-story': 'The story behind the identity',
  'buygenuine-primary': 'Primary brand identity', 'buygenuine-variations': 'Logo variations',
  'buygenuine-stacked': 'The stacked logo', 'buygenuine-symbol': 'The brand symbol',
  'buygenuine-wordmark': 'The wordmark',
  'island-tea-oreo': 'Oreo cream cheese milk tea', 'island-tea-coffee': 'Ceylon coffee',
  'island-tea-takeaway': 'Tea, on the go', 'lbk-cinnamon-honey': 'Cinnamon & bee honey',
  'lbk-dates-honey': 'Honey, ghee & dates', 'lbk-sathpanguwa': 'Sathpanguwa',
  'seedevi-roast': 'Roasted chicken promotion', 'seedevi-biryani': 'A taste of biryani',
  'seedevi-family-pack': 'Family pack creative', 'cafe89-brownie': 'Chocolate brownie',
  'cafe89-coffee': 'The perfect coffee break', 'cafe89-avocado': 'Avocado milkshake',
  'devii-oil-label': 'Miracle Marigold skincare oil', 'devii-bodywash-label': 'Herbal body wash',
  'devii-conditioner-label': 'Herbal hair conditioner', 'devii-facialwash-label': 'Facial wash',
  'reel-hotel-creston': 'Hotel Creston Park reel preview',
  'reel-heritage-cars': 'Heritage Wedding Cars reel preview',
};

function artworkTitle(path: string) {
  return artworkTitles[path.split('/').pop()!.replace(/\.[^.]+$/, '')] || 'Selected creative';
}

export default function ProjectGallery({ project, onClose, returnFocus }: {
  project: Project;
  onClose: () => void;
  returnFocus: HTMLElement | null;
}) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = project.gallery.length;
  const image = project.gallery[active];
  const title = artworkTitle(image);
  const step = (direction: number) => setActive((index) => (index + direction + total) % total);

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocus?.focus({ preventScroll: true });
    };
  }, [returnFocus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (expanded) setExpanded(false); else onClose();
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        setActive((index) => (index + (event.key === 'ArrowRight' ? 1 : -1) + total) % total);
      }
      if (event.key === 'Tab') {
        const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || [])]
          .filter((element) => element.getClientRects().length > 0);
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expanded, total, onClose]);

  return (
    <div className="modal-backdrop gallery-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div ref={dialogRef} className={`project-modal gallery-modal${expanded ? ' is-expanded' : ''}`}
        role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <header className="viewer-topbar">
          <div className="viewer-brand"><img src="/res/img/ism-logo-official-white.png" alt="I Shop Marketing" /><span>THE CREATIVE COLLECTION</span></div>
          <div className="viewer-topline"><span>{project.category}</span><button ref={closeRef} type="button" className="viewer-close" onClick={onClose} aria-label="Close project details"><X size={20} /></button></div>
        </header>
        <div className="viewer-layout">
          <div className="viewer-main">
            <div className={`viewer-stage${project.id === 'buygenuine' ? ' viewer-stage-light' : ''}`}
              onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
              onTouchEnd={(event) => {
                if (!touchStart.current) return;
                const dx = event.changedTouches[0].clientX - touchStart.current.x;
                const dy = event.changedTouches[0].clientY - touchStart.current.y;
                if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
                touchStart.current = null;
              }}>
              <img key={image} className="viewer-image" src={image} alt={`${project.title} — ${title}`} />
              <button type="button" className="viewer-zoom" aria-label={expanded ? 'Return to gallery view' : 'Enlarge artwork'} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>
                {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>
            </div>
            <div className="viewer-toolbar">
              <div className="viewer-caption"><small>THE ARTWORK</small><strong>{title}</strong></div>
              <div className="viewer-controls">
                <button className="viewer-arrow" type="button" onClick={() => step(-1)} aria-label="Previous artwork"><ChevronLeft size={19} /></button>
                <span className="viewer-count" aria-live="polite" aria-atomic="true"><b>{String(active + 1).padStart(2, '0')}</b><span> / {String(total).padStart(2, '0')}</span></span>
                <button className="viewer-arrow" type="button" onClick={() => step(1)} aria-label="Next artwork"><ChevronRight size={19} /></button>
              </div>
            </div>
            <div className="modal-gallery viewer-thumbnails" aria-label="Choose an artwork">
              {project.gallery.map((path, index) => <button className="viewer-thumbnail" key={path} type="button" aria-pressed={active === index} aria-label={`View ${artworkTitle(path)}`} onClick={() => setActive(index)}>
                <img src={path} alt="" /><span>{String(index + 1).padStart(2, '0')}</span>
              </button>)}
            </div>
          </div>
          <aside className="viewer-info">
            <span className="viewer-kicker">{project.category} / SELECTED WORK</span>
            <h2 id="project-modal-title">{project.title}</h2>
            <p className="viewer-subtitle">{project.subtitle}</p>
            <p className="viewer-description">{project.description}</p>
            <div className="viewer-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="viewer-credit"><span>CREATIVE PARTNER</span><strong>I Shop Marketing</strong><small>Thoughtfully created. Always on time.</small></div>
          </aside>
        </div>
        <footer className="viewer-footer"><span>CREATIVE SOLUTIONS. MEANINGFUL CONNECTIONS.</span><span>I SHOP MARKETING (PVT) LTD</span></footer>
      </div>
    </div>
  );
}
