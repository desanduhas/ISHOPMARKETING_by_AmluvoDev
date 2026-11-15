import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './hero-visual.css';

const showcase = [
  { src: '/res/projects/devii-identity.png', client: 'DEVII AYURVEDIC', discipline: 'BRAND IDENTITY' },
  { src: '/res/projects/island-tea-oreo.png', client: 'ISLAND TEA CO.', discipline: 'SOCIAL CREATIVE' },
  { src: '/res/projects/cafe89-brownie.png', client: 'CAFÉ 89', discipline: 'CAMPAIGN DESIGN' },
];

export default function HeroVisual() {
  return (
    <div className="hero-showcase" aria-label="Selected work by I Shop Marketing">
      <div className="hero-showcase-topline">
        <span>SELECTED WORK</span>
        <span>01 — 03</span>
      </div>

      <div className="hero-showcase-media">
        {showcase.map((item, index) => (
          <figure className="hero-showcase-slide" style={{ '--slide-index': index } as CSSProperties} key={item.client}>
            <img src={item.src} alt="" />
            <figcaption>
              <strong>{item.client}</strong>
              <span>{item.discipline}</span>
            </figcaption>
          </figure>
        ))}
        <div className="hero-showcase-index" aria-hidden="true">
          <span>01</span><span>02</span><span>03</span>
        </div>
      </div>

      <div className="hero-showcase-bottomline">
        <span>BRANDS · STORIES · EXPERIENCES</span>
        <a href="#work">VIEW OUR WORK <ArrowUpRight size={11} aria-hidden="true" /></a>
      </div>
    </div>
  );
}
