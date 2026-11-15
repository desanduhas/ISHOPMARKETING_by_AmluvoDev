import { useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  Clock,
  Compass,
  HelpCircle,
  Home,
  MapPin,
  Megaphone,
  Send,
  Users,
} from 'lucide-react';
import './floating-nav.css';

const items = [
  { id: 'top', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: Compass },
  { id: 'services', label: 'Services', icon: Megaphone },
  { id: 'process', label: 'Process', icon: Clock },
  { id: 'work', label: 'Our work', icon: BriefcaseBusiness },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'contact', label: 'Contact', icon: Send },
];

export default function FloatingNav({ hidden = false }: { hidden?: boolean }) {
  const [pastIntro, setPastIntro] = useState(false);
  const [active, setActive] = useState('top');
  const visible = pastIntro && !hidden;

  useEffect(() => {
    let frame = 0;
    const sections = items.map((item) => ({ id: item.id, element: document.getElementById(item.id) }));
    const update = () => {
      frame = 0;
      setPastIntro(window.scrollY > 360);
      const marker = Math.min(window.innerHeight * .35, 240);
      let current = 'top';
      let nearest = -Infinity;
      for (const section of sections) {
        if (!section.element) continue;
        const top = section.element.getBoundingClientRect().top;
        if (top <= marker && top > nearest) {
          current = section.id;
          nearest = top;
        }
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <nav className={`floating-nav${visible ? ' is-visible' : ''}`} aria-label="Quick navigation" aria-hidden={!visible} inert={!visible}>
      {items.map(({ id, label, icon: Icon }) => (
        <a key={id} className="floating-nav-link" href={`#${id}`} aria-label={label}
          aria-current={active === id ? 'location' : undefined} tabIndex={visible ? 0 : -1}>
          <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
          <span className="floating-nav-tooltip" aria-hidden="true">{label}</span>
        </a>
      ))}
    </nav>
  );
}
