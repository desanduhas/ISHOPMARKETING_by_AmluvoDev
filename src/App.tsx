import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Compass,
  Gem,
  House,
  Megaphone,
  RefreshCw,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  Sparkles,
  Sun,
  Users,
  X,
} from 'lucide-react';

type CaseCategory = 'all' | 'ecommerce' | 'retail' | 'leadgen' | 'turnaround';

const services = [
  {
    visualIcon: Megaphone,
    icon: '01',
    title: 'Performance marketing',
    copy: 'Paid media systems built around measurable growth, not vanity metrics.',
    bullets: ['Meta & Google campaigns', 'Conversion-focused funnels', 'Reporting & optimisation'],
  },
  {
    visualIcon: Gem,
    icon: '02',
    title: 'Brand acceleration',
    copy: 'A sharper position, stronger creative direction and a brand people remember.',
    bullets: ['Brand identity systems', 'Content strategy', 'Creative production'],
    featured: true,
  },
  {
    visualIcon: RefreshCw,
    icon: '03',
    title: 'Business turnaround',
    copy: 'Practical strategy for brands that need momentum, clarity and healthier revenue.',
    bullets: ['Growth diagnostics', 'Omnichannel planning', 'Retention & recovery'],
  },
];

const team = [
  ['I K S Ilangakoon', 'Managing Director', 'Enterprise strategy & partnerships'],
  ['I Y R Ilangakoon', 'General Manager', 'Operations & client delivery'],
  ['Sanjana Prasad', 'Chief Executive Officer', 'Growth systems & performance media'],
  ['Chamathka Wijesinghe', 'Assistant Operations Manager', 'Onboarding & quality control'],
  ['Isanga Sathsara', 'Assistant Operations Manager', 'Analytics & campaign execution'],
];

const cases = [
  {
    category: 'ecommerce',
    number: '01',
    title: 'Ceylon Luxury Apparel',
    result: '+340% ROAS',
    copy: 'A segmented retargeting ecosystem that lowered acquisition cost while scaling monthly orders.',
    detail: 'Meta + Google Ads',
  },
  {
    category: 'retail',
    number: '02',
    title: 'Nationwide Retail Network',
    result: '+48% footfall',
    copy: 'Digital offers connected to on-ground activations across Colombo and Western Province stores.',
    detail: 'Local + Field Marketing',
  },
  {
    category: 'leadgen',
    number: '03',
    title: 'Enterprise Technology',
    result: '5.2x leads',
    copy: 'A high-intent search and LinkedIn system designed for C-suite decision makers.',
    detail: 'B2B Lead Engine',
  },
  {
    category: 'turnaround',
    number: '04',
    title: 'Island Villa Resort',
    result: '84% occupancy',
    copy: 'Brand repositioning and a direct-booking campaign that reversed an off-peak slump.',
    detail: 'Business Turnaround',
  },
];

const locations = [
  ['Colombo', 'Wellawatta Head Office', 'No 33, Collingwood Place, Wellawatta'],
  ['Anuradhapura', 'Regional Office', 'North Central Province'],
  ['Kandy', 'Regional Office', 'Central Province'],
  ['Polonnaruwa', 'Regional Office', 'Eastern Gateway'],
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('ism-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeCategory, setActiveCategory] = useState<CaseCategory>('all');
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('ism-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 420);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    const exitTimer = window.setTimeout(() => setSplashExiting(true), 2600);
    const finishTimer = window.setTimeout(() => {
      setSplashVisible(false);
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }, 3100);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.section-head, .service-grid article, .proof-strip div, .statement, .brand-film-copy, .team-grid article, .filters, .case-grid article, .locations > div, .location-list article, .contact-copy, .contact form',
    );
    elements.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
    });
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -55px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Growth brief from ${data.get('name')}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nPhone: ${data.get('phone')}\nEmail: ${data.get('email')}\nService: ${data.get('service')}\n\nProject goal:\n${data.get('message')}`,
    );
    setSubmitted(true);
    window.location.href = `mailto:info.ishopmarketing@gmail.com?subject=${subject}&body=${body}`;
  };

  const visibleCases = activeCategory === 'all'
    ? cases
    : cases.filter((item) => item.category === activeCategory);
  const logoSrc = dark ? '/res/img/ism-logo-official-white.png' : '/res/img/ism-logo-official-black.png';

  return (
    <div className="site-shell">
      {splashVisible && (
        <div className={`splash-screen ${splashExiting ? 'splash-exit' : ''}`} role="status" aria-label="Loading I Shop Marketing">
          <div className="splash-content">
            <p className="splash-eyebrow">CREATIVE · STRATEGIC · RESULTS DRIVEN</p>
            <div className="splash-name-line" aria-label="I Shop Marketing">
              {Array.from('I Shop Marketing').map((character, index) => (
                <span
                  className={`splash-name-char ${character === ' ' ? 'space' : ''} ${index >= 7 ? 'accent' : ''}`}
                  style={{ animationDelay: `${0.3 + index * 0.07}s` }}
                  key={`${character}-${index}`}
                  aria-hidden="true"
                >
                  {character === ' ' ? '\u00A0' : character}
                </span>
              ))}
            </div>
            <div className="splash-rule" />
            <p className="splash-tagline">ALWAYS ON TIME.</p>
          </div>
        </div>
      )}
      <header className={`topbar ${scrolled ? 'topbar-hidden' : ''} ${splashVisible ? 'topbar-splash-hidden' : ''}`}>
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-mark"><img src={logoSrc} alt="I Shop Marketing (Pvt) Ltd" /></span>
        </button>

        <nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">
          <button onClick={() => goTo('services')}>Services</button>
          <button onClick={() => goTo('about')}>Our approach</button>
          <button onClick={() => goTo('team')}>Team</button>
          <button onClick={() => goTo('work')}>Our work</button>
          <button className="mobile-nav-only" onClick={() => goTo('locations')}>Locations</button>
          <button className="mobile-nav-only" onClick={() => goTo('contact')}>Contact</button>
        </nav>

        <div className="nav-tools">
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle colour theme">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="nav-cta" onClick={() => goTo('contact')}>Let's talk <ArrowUpRight size={15} /></button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className={`scroll-dock ${scrolled ? 'scroll-dock-visible' : ''}`} aria-label="Quick navigation">
        <button onClick={() => goTo('home')} aria-label="Home" data-label="Home"><House size={17} /></button>
        <button onClick={() => goTo('services')} aria-label="Services" data-label="Services"><Megaphone size={17} /></button>
        <button onClick={() => goTo('about')} aria-label="Our approach" data-label="Approach"><Compass size={17} /></button>
        <button onClick={() => goTo('team')} aria-label="Team" data-label="Team"><Users size={17} /></button>
        <button onClick={() => goTo('work')} aria-label="Our work" data-label="Work"><BriefcaseBusiness size={17} /></button>
        <button onClick={() => goTo('locations')} aria-label="Locations" data-label="Locations"><MapPin size={17} /></button>
        <button onClick={() => goTo('contact')} aria-label="Contact" data-label="Contact"><Send size={17} /></button>
      </div>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><i /> SRI LANKA'S GROWTH PARTNER</div>
            <h1>Big ambition.<br />Sharper strategy.<br /><span>Growth that works.</span></h1>
            <p>We bring brand, performance and field marketing together to move businesses forward—online and on the ground.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => goTo('contact')}>Build your growth plan <ArrowUpRight size={16} /></button>
              <button className="text-link" onClick={() => goTo('services')}>Explore our services <ChevronDown size={15} /></button>
            </div>
            <div className="hero-note"><Sparkles size={14} /> Strategy with clarity. Execution with urgency.</div>
          </div>

          <div className="hero-art" aria-label="I Shop Marketing creative growth card">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="float-tag tag-one"><i /> Brand to business growth</div>
            <div className="identity-card">
              <div className="card-top">
                <span>ISM / 2026</span>
                <div className="card-hero-logo">
                  <img src={logoSrc} alt="I Shop Marketing (Pvt) Ltd" />
                </div>
                <small>THE GROWTH STUDIO</small>
              </div>
              <div className="card-bottom">
                <h2>Growth Partner <b>✦</b></h2>
                <p>Ideas that perform. Campaigns that convert.</p>
                <div className="card-specs">
                  <span><small>OUR CRAFT</small><b>Strategy + Marketing</b></span>
                  <span><small>OUR PROMISE</small><b>Always on time</b></span>
                </div>
                <div className="card-code">GROWTH → DELIVERED</div>
              </div>
            </div>
            <div className="float-tag tag-two">Performance meets creativity ↗</div>
            <span className="drag-hint">BUILT FOR BRANDS READY TO MOVE</span>
          </div>
        </section>

        <div className="capability-strip">
          <span>STRATEGY TO EXECUTION.</span>
          <b>Meta Ads <i>✳</i></b>
          <b>Google <i>↗</i></b>
          <b>SEO <i>◎</i></b>
          <b>Branding <i>✦</i></b>
          <b>Field Marketing <i>＋</i></b>
        </div>

        <section className="proof-strip" aria-label="Company facts">
          <div><strong>2019</strong><span>Established in Sri Lanka</span></div>
          <div><strong>04</strong><span>Operational locations</span></div>
          <div><strong>360°</strong><span>Digital + physical marketing</span></div>
          <div><strong>Local → Global</strong><span>Built for ambitious businesses</span></div>
        </section>

        <section className="section" id="services">
          <div className="section-head">
            <div><div className="eyebrow">01 / WHAT WE DO</div><h2>Creativity meets<br /><span>commercial thinking.</span></h2></div>
            <p>One growth partner for the full journey.<br />From positioning to performance.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => {
              const ServiceIcon = service.visualIcon;
              return (
                <article className={service.featured ? 'featured' : ''} key={service.title}>
                  <div className="service-icon"><ServiceIcon size={19} strokeWidth={1.6} /></div><span className="number">{service.icon}</span>
                  <h3>{service.title}</h3><p>{service.copy}</p>
                  <ul>{service.bullets.map((bullet) => <li key={bullet}><Check size={13} /> {bullet}</li>)}</ul>
                  <button onClick={() => goTo('contact')}>Plan this service <ArrowUpRight size={14} /></button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="statement" id="about">
          <div className="statement-copy">
            <div className="eyebrow">BUILT FOR BUSINESS MOVEMENT</div>
            <h2>Less campaign noise.<br /><span>More forward motion.</span></h2>
            <p>Since 2019, we have connected insight, creative thinking and disciplined execution into one practical growth system—built for digital channels and the real world.</p>
            <button className="text-link" onClick={() => goTo('contact')}>Build your growth system <ArrowUpRight size={15} /></button>
          </div>
          <div className="growth-system" aria-label="The ISM growth system: insight, direction and momentum">
            <div className="growth-system-head"><span>ISM / GROWTH SYSTEM</span><b>2019—NOW</b></div>
            <div className="growth-route">
              <div><span>01</span><strong>Insight</strong><small>Find the real opportunity</small></div>
              <div><span>02</span><strong>Direction</strong><small>Turn clarity into a plan</small></div>
              <div><span>03</span><strong>Momentum</strong><small>Execute, learn and scale</small></div>
            </div>
            <div className="growth-output"><span>BUSINESS OUTPUT</span><strong>Measured movement, not marketing theatre.</strong><ArrowUpRight size={18} /></div>
          </div>
        </section>

        <section className="brand-film" aria-label="I Shop Marketing in Sri Lanka">
          <video autoPlay muted loop playsInline preload="metadata" poster="/res/img/ism-sri-lanka-poster.jpg" aria-hidden="true">
            <source src="/res/img/videopalyback.mp4" type="video/mp4" />
          </video>
          <div className="brand-film-shade" />
          <div className="brand-film-copy">
            <span className="film-label"><i /> BORN IN SRI LANKA · BUILT TO GO FURTHER</span>
            <h2>Local insight.<br />Global ambition.</h2>
            <p>Four operational locations. One connected team. Digital precision with real-world reach.</p>
            <button onClick={() => goTo('locations')}>Explore our locations <ArrowUpRight size={15} /></button>
          </div>
          <div className="film-monogram"><img src="/res/img/ism-logo-official-white.png" alt="I Shop Marketing (Pvt) Ltd" /></div>
        </section>

        <section className="section" id="team">
          <div className="section-head">
            <div><div className="eyebrow">02 / THE PEOPLE BEHIND THE WORK</div><h2>Senior thinking.<br /><span>Hands-on execution.</span></h2></div>
            <p>A focused leadership team combining<br />strategy, operations and creative delivery.</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <article key={member[0]}>
                <span>0{index + 1}</span>
                <div className="member-avatar">{member[0].split(' ').map((word) => word[0]).slice(0, 2).join('')}</div>
                <h3>{member[0]}</h3><b>{member[1]}</b><p>{member[2]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section work-section" id="work">
          <div className="section-head">
            <div><div className="eyebrow">03 / PROOF IN THE NUMBERS</div><h2>Work designed to<br /><span>make a difference.</span></h2></div>
            <p>Selected growth outcomes across<br />digital, retail and hospitality.</p>
          </div>
          <div className="filters">
            {(['all', 'ecommerce', 'retail', 'leadgen', 'turnaround'] as CaseCategory[]).map((filter) => (
              <button className={activeCategory === filter ? 'active' : ''} onClick={() => setActiveCategory(filter)} key={filter}>
                {filter === 'all' ? 'All work' : filter}
              </button>
            ))}
          </div>
          <div className="case-grid">
            {visibleCases.map((item) => (
              <article key={item.title}>
                <div className={`case-visual case-${item.category}`}>
                  <span>{item.detail}</span><strong>{item.result}</strong><i>{item.number}</i>
                  <div className="case-lines"><b /><b /><b /><b /><b /><b /></div>
                </div>
                <div className="case-caption"><div><h3>{item.title}</h3><p>{item.copy}</p></div><ArrowUpRight size={20} /></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section locations" id="locations">
          <div><div className="eyebrow">04 / ISLAND-WIDE PRESENCE</div><h2>Close to the work.<br /><span>Wherever it happens.</span></h2></div>
          <div className="location-list">
            {locations.map((location, index) => (
              <article key={location[0]}><span>0{index + 1}</span><div><h3>{location[0]}</h3><b>{location[1]}</b><p>{location[2]}</p></div><MapPin size={19} /></article>
            ))}
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="contact-copy">
            <div className="eyebrow"><i /> LET'S MAKE IT HAPPEN</div>
            <h2>Your next stage of growth<br />starts with <span>a conversation.</span></h2>
            <p>Have a sales target, a stalled brand or an idea ready to launch? Tell us what needs to move.</p>
            <div className="contact-links">
              <div className="contact-method">
                <span className="contact-icon"><Phone size={18} strokeWidth={1.6} /></span>
                <div className="contact-detail">
                  <small>PHONE</small>
                  <div className="contact-number-list">
                    <a href="tel:+94717000779">071 700 0779</a>
                    <a href="tel:+94702000779">070 200 0779</a>
                    <a href="tel:+94716758700">071 675 8700</a>
                  </div>
                </div>
              </div>
              <a className="contact-method" href="mailto:info.ishopmarketing@gmail.com"><span className="contact-icon"><Mail size={18} strokeWidth={1.6} /></span><span className="contact-detail"><small>EMAIL</small><strong>info.ishopmarketing@gmail.com</strong></span><ArrowUpRight size={15} /></a>
              <div className="contact-method contact-address"><span className="contact-icon"><MapPin size={18} strokeWidth={1.6} /></span><span className="contact-detail"><small>HEAD OFFICE</small><strong>No 33, Collingwood Place, Wellawatta</strong></span></div>
            </div>
            <div className="contact-note"><Sparkles size={13} /> Big goals. Thoughtful strategy. On-time delivery.</div>
          </div>

          <form onSubmit={submitForm}>
            {submitted ? (
              <div className="form-success"><div><Check size={22} /></div><h3>Thanks for reaching out.</h3><p>Your brief is ready. Please call or email us to confirm your appointment.</p><button type="button" className="button primary" onClick={() => setSubmitted(false)}>Send another brief</button></div>
            ) : (
              <>
                <h3>Start your growth brief <ArrowUpRight size={17} /></h3>
                <p>Give us the essentials and our strategy team will take it from there.</p>
                <div className="form-row"><label>Your name<input name="name" placeholder="Kasun Fernando" required /></label><label>Phone number<input name="phone" type="tel" placeholder="071 234 5678" required /></label></div>
                <label>Email address<input name="email" type="email" placeholder="you@company.com" required /></label>
                <label>What do you need?<select name="service"><option>Performance marketing</option><option>Brand strategy</option><option>Business turnaround</option><option>Let's figure it out together</option></select></label>
                <label>A little about your goal<textarea name="message" placeholder="Tell us what you want to achieve…" rows={3} required /></label>
                <button className="button primary submit-button" type="submit">Submit growth brief <Send size={15} /></button>
                <small>We usually respond within two business hours.</small>
              </>
            )}
          </form>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark"><img src={logoSrc} alt="I Shop Marketing (Pvt) Ltd" /></span></div>
        <div className="footer-socials">
          <a href="https://www.facebook.com/Ishop.Marketing001" target="_blank" rel="noreferrer"><img src="/res/img/facebook.png" alt="" /> Facebook</a>
          <a href="https://x.com/IShopMarke001" target="_blank" rel="noreferrer"><img src="/res/img/twitter.png" alt="" /> X</a>
          <a href="https://www.linkedin.com/in/i-shop-marketing-8038332a1" target="_blank" rel="noreferrer"><img src="/res/img/linkedin.png" alt="" /> LinkedIn</a>
          <a href="https://wa.me/94717000779" target="_blank" rel="noreferrer"><img src="/res/img/whatsapp.png" alt="" /> WhatsApp</a>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
        <p><span>© 2026 I Shop Marketing (PVT) LTD · Established 2019</span><span>Strategy · Creative · Performance · Field</span></p>
      </footer>
    </div>
  );
}
