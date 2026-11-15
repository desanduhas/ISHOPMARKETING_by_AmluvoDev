import { useCallback, useRef, useState, type FormEvent } from 'react';
import { useSiteMotion } from './hooks/use-site-motion';
import ScrollStory from './components/ScrollStory';
import AmbientBackground from './components/AmbientBackground';
import ProjectGallery from './components/ProjectGallery';
import FloatingNav from './components/FloatingNav';
import HeroVisual from './components/HeroVisual';
import SriLankaMap from './components/SriLankaMap';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Film,
  Globe2,
  HelpCircle,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Palette,
  Phone,
  Play,
  Shield,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

const services = [
  {
    name: 'Strategy & growth',
    icon: Compass,
    intro: 'Thoughtful strategy that gives your brand a clear direction and your marketing a purpose.',
    items: [
      'Digital marketing strategy',
      'Marketing consultancy',
      'Campaign planning and promotional strategy',
      'Search engine optimization (SEO)',
    ],
  },
  {
    name: 'Social & digital',
    icon: Globe2,
    intro: 'Create meaningful connections with the people who matter to your business.',
    items: [
      'Social media management',
      'Social media advertising and boosting',
      'Influencer-led promotional campaigns',
      'Influencer marketing coordination',
    ],
  },
  {
    name: 'Brand & design',
    icon: Palette,
    intro: 'Distinctive visual identities and creative work that bring your brand to life.',
    items: [
      'Branding and visual communication',
      'Logo design',
      'Graphic design',
      'Marketing and promotional creatives',
      'Label and packaging design',
    ],
  },
  {
    name: 'Content & production',
    icon: Film,
    intro: 'Tell your story through engaging visuals, photography and moving image.',
    items: [
      'Photography',
      'Video production',
      'Documentary production',
      'Live presenting reels',
    ],
  },
  {
    name: 'Events & activations',
    icon: Megaphone,
    intro: 'Bring your brand into the real world with memorable experiences and promotions.',
    items: [
      'Event marketing',
      'Promotional activations',
      'Brand engagement activities',
      'Offline promotional campaigns',
      'Physical marketing activities',
    ],
  },
];

const projects = [
  {
    id: 'devii',
    category: 'Branding',
    title: 'DEVII Ayurvedic Products',
    subtitle: 'An identity rooted in nature',
    description:
      'A brand identity inspired by Ayurvedic heritage, combining an expressive goddess motif, a peacock feather and a natural green and gold palette.',
    cover: '/res/projects/devii-brandmark.png',
    gallery: [
      '/res/projects/devii-identity.png',
      '/res/projects/devii-brandmark.png',
      '/res/projects/devii-brand-story.png',
    ],
    tags: ['Brand identity', 'Logo design'],
  },
  {
    id: 'island-tea',
    category: 'Social media',
    title: 'Island Tea Co.',
    subtitle: 'A fresh take on everyday favourites',
    description:
      'Social media creatives for Island Tea Company and Ceylon Coffee Club, Dambulla, bringing their drinks and café experience to the forefront.',
    cover: '/res/projects/island-tea-oreo.png',
    gallery: [
      '/res/projects/island-tea-oreo.png',
      '/res/projects/island-tea-coffee.png',
      '/res/projects/island-tea-takeaway.png',
    ],
    tags: ['Social media', 'Creative design'],
  },
  {
    id: 'buygenuine',
    category: 'Branding',
    title: 'BuyGenuine LK',
    subtitle: 'Building a recognisable mark',
    description:
      'A visual identity that brings together a vehicle silhouette, a shield and a check mark to communicate protection and authenticity.',
    cover: '/res/projects/buygenuine-primary.png',
    gallery: [
      '/res/projects/buygenuine-primary.png',
      '/res/projects/buygenuine-stacked.png',
      '/res/projects/buygenuine-symbol.png',
      '/res/projects/buygenuine-wordmark.png',
    ],
    tags: ['Brand identity', 'Logo design'],
  },
  {
    id: 'devii-labels',
    category: 'Packaging',
    title: 'DEVII Skincare',
    subtitle: 'Tradition, thoughtfully packaged',
    description:
      'Label design for DEVII skincare products, bringing together intricate details and a consistent Ayurvedic-inspired visual language.',
    cover: '/res/projects/devii-bodywash-label.png',
    gallery: [
      '/res/projects/devii-bodywash-label.png',
      '/res/projects/devii-oil-label.png',
      '/res/projects/devii-conditioner-label.png',
      '/res/projects/devii-facialwash-label.png',
    ],
    tags: ['Label design', 'Packaging'],
  },
  {
    id: 'lbk',
    category: 'Social media',
    title: 'LBK Natural',
    subtitle: 'Everyday products, naturally presented',
    description:
      'Promotional social media creative showcasing LBK honey, ghee and traditional products.',
    cover: '/res/projects/lbk-cinnamon-honey.png',
    gallery: [
      '/res/projects/lbk-cinnamon-honey.png',
      '/res/projects/lbk-dates-honey.png',
      '/res/projects/lbk-sathpanguwa.png',
    ],
    tags: ['Social media', 'Creative design'],
  },
  {
    id: 'seedevi',
    category: 'Social media',
    title: 'Seedevi Family Restaurant',
    subtitle: 'Making the moment appetising',
    description:
      'Food-focused promotional creatives for Seedevi Family Restaurant, featuring its meals and family offers.',
    cover: '/res/projects/seedevi-roast.png',
    gallery: [
      '/res/projects/seedevi-roast.png',
      '/res/projects/seedevi-biryani.png',
      '/res/projects/seedevi-family-pack.png',
    ],
    tags: ['Social media', 'Food & beverage'],
  },
  {
    id: 'cafe89',
    category: 'Social media',
    title: 'Café 89',
    subtitle: 'A little more than coffee',
    description:
      'Warm, lifestyle-led café creatives showcasing drinks, desserts and seasonal promotions.',
    cover: '/res/projects/cafe89-brownie.png',
    gallery: [
      '/res/projects/cafe89-brownie.png',
      '/res/projects/cafe89-coffee.png',
      '/res/projects/cafe89-avocado.png',
    ],
    tags: ['Social media', 'Food & beverage'],
  },
  {
    id: 'reels',
    category: 'Production',
    title: 'Live Presenting Reels',
    subtitle: 'Stories made to be seen',
    description:
      'Presenter-led promotional videos that introduce businesses, showcase products and communicate brand stories across social media.',
    cover: '/res/projects/reel-hotel-creston.png',
    gallery: ['/res/projects/reel-hotel-creston.png', '/res/projects/reel-heritage-cars.png'],
    tags: ['Video production', 'Live presenting'],
  },
];

const team = [
  { name: 'I K S Ilangakoon', role: 'Managing Director', initials: 'IK' },
  { name: 'I Y R Ilangakoon', role: 'General Manager', initials: 'IY' },
  { name: 'Sanjana Prasad', role: 'Chief Executive Officer', initials: 'SP' },
  { name: 'Chamathka Wijesinghe', role: 'Assistant Operations Manager', initials: 'CW' },
  { name: 'Isanga Sathsara', role: 'Assistant Operations Manager', initials: 'IS' },
];

const partners = [
  'DEVII AYURVEDIC',
  'ISLAND TEA CO.',
  'BUYGENUINE LK',
  'LBK NATURAL',
  'SEEDEVI RESTAURANT',
  'CAFÉ 89',
  'HOTEL CRESTON PARK',
  'HERITAGE WEDDING CARS',
];

const processSteps = [
  {
    step: '01',
    title: 'Discovery & Market Audit',
    desc: 'Deep diagnostic analyzing your market position, unit economics, audience psychology, and growth bottlenecks.',
  },
  {
    step: '02',
    title: 'Strategic Blueprint',
    desc: 'Crafting tailored omnichannel media plans, messaging architecture, and creative assets designed for conversions.',
  },
  {
    step: '03',
    title: 'Execution & Deployment',
    desc: 'Rapid tactical rollout across paid digital channels, content production, and provincial on-ground activations.',
  },
  {
    step: '04',
    title: 'Attribution & Revenue Scale',
    desc: 'Continuous real-time optimization, conversion rate enhancement, and scaling profitable client acquisition loops.',
  },
];

const faqs = [
  {
    q: 'What is the "Always On Time" philosophy?',
    a: 'Operating under "Always On Time" means we treat deadlines, campaign launches, and client deliverables with absolute precision. We combine strategic discipline with agile execution so your business never misses a market window.',
  },
  {
    q: 'What industries and client tiers do you specialize in?',
    a: 'We work with Sri Lankan and international brands across FMCG, Ayurvedic & personal care, food & beverage, automotive platforms, retail chains, hospitality resorts, and corporate technology enterprises.',
  },
  {
    q: 'Can you coordinate on-ground activations across the island?',
    a: 'Yes. With our central headquarters in Colombo and regional office hubs in Kandy, Anuradhapura, and Polonnaruwa, we deploy dedicated on-ground field marketing, event management, and retail activations nationwide.',
  },
  {
    q: 'How do we begin a project or marketing retainer with ISM?',
    a: 'Simply call our direct hotline at 071 7000 779 or submit our contact form. Our senior management reviews your requirements and schedules a strategic discovery session within one business cycle.',
  },
];

const filters = ['All projects', 'Branding', 'Social media', 'Packaging', 'Production'];
const navLinks = [
  ['About', '#about'],
  ['Services', '#services'],
  ['Process', '#process'],
  ['Our work', '#work'],
  ['Locations', '#locations'],
  ['Team', '#team'],
  ['FAQ', '#faq'],
];

function App() {
  const siteRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [filter, setFilter] = useState('All projects');
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeProject = useCallback(() => setSelectedProject(null), []);
  const currentService = services[activeService];
  const visibleProjects =
    filter === 'All projects' ? projects : projects.filter((project) => project.category === filter);

  useSiteMotion(siteRef, filter, menuOpen || !!selectedProject, activeService);

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`New project enquiry from ${data.get('name')}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nCompany: ${data.get('company') || 'Not provided'}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone') || 'Not provided'}\nService: ${data.get('service')}\n\nProject details:\n${data.get('message')}`,
    );
    window.location.href = `mailto:info.ishopmarketing@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div ref={siteRef} className="company-site" id="top">
      <div className="page-intro" aria-hidden="true">
        <span className="page-intro-panel page-intro-panel-left" />
        <span className="page-intro-panel page-intro-panel-right" />
        <div className="page-intro-mark">
          <img src="/res/img/ism-logo-official-white.png" alt="" />
          <span>CREATIVE THINKING · ALWAYS ON TIME</span>
        </div>
      </div>
      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress-fill" />
      </div>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* ============================================================== */}
      {/* TOP INFORMATION BAR (Envato Elements Clean Style)             */}
      {/* ============================================================== */}
      <div className="top-info-bar">
        <div className="shell top-info-inner">
          <div className="top-info-left">
            <span className="top-info-item">
              <Phone size={13} />
              <a href="tel:0717000779">+94 71 7000 779</a>
            </span>
            <span className="top-info-item">
              <Mail size={13} />
              <a href="mailto:info.ishopmarketing@gmail.com">info.ishopmarketing@gmail.com</a>
            </span>
            <span className="top-info-item">
              <MapPin size={13} />
              <span>No 33, Collingwood Place, Wellawatta, Colombo 06</span>
            </span>
          </div>
          <div className="top-info-right">
            <span className="top-info-item">
              <Clock size={13} />
              <span>PHILOSOPHY: ALWAYS ON TIME</span>
            </span>
            <span className="top-info-item">
              <Shield size={13} />
              <span>ESTABLISHED 2020 • SRI LANKA</span>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SITE HEADER (Sticky Navigation)                               */}
      {/* ============================================================== */}
      <header className="site-header">
        <div className="shell header-inner">
          <a
            className="brand"
            href="#top"
            aria-label="I Shop Marketing home"
            onClick={() => setMenuOpen(false)}
          >
            <img src="/res/img/ism-logo-official-white.png" alt="iSM" />
            <span className="brand-copy">
              <strong>I SHOP MARKETING</strong>
              <small>ALWAYS ON TIME</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href="#contact">
            Let's talk <ArrowUpRight size={15} />
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={17} />
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Let's talk
              <ArrowUpRight size={17} />
            </a>
          </nav>
        )}
      </header>

      <main id="main">
        {/* ============================================================ */}
        {/* HERO SECTION (Clean, Box-Free, Prestigious Split Layout)    */}
        {/* ============================================================ */}
        <section className="hero section-shell ambient-section" aria-labelledby="hero-title">
          <AmbientBackground />
          <div className="shell hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="hero-status-dot" />
                <span>SRI LANKA'S GROWTH PARTNER</span>
              </div>
              <h1 id="hero-title" aria-label="Big ambition. Sharper strategy. Growth that works.">
                <span className="hero-heading-main">Big ambition.</span>
                <span className="hero-heading-main">Sharper strategy.</span>
                <span className="hero-heading-sub">Growth that <br className="hero-mobile-break" />works.</span>
              </h1>
              <p>
                I Shop Marketing brings brand strategy, creative production and field marketing together to move
                businesses forward—online and on the ground.
              </p>
              <div className="hero-actions">
                <a className="button button-gold" href="#contact">
                  Build your growth plan <ArrowUpRight size={17} />
                </a>
                <a className="text-link" href="#services">
                  Explore our services <ArrowRight size={16} />
                </a>
              </div>
              <div className="hero-proof">
                <div>
                  <strong>2020</strong>
                  <span>ESTABLISHED</span>
                </div>
                <div>
                  <strong>04</strong>
                  <span>REGIONAL OFFICES</span>
                </div>
                <div>
                  <strong>Full service</strong>
                  <span>STRATEGY TO EXECUTION</span>
                </div>
              </div>
            </div>

            {/* Frameless, Box-Free, Ultra-Clean Logo Stage */}
            <div className="hero-visual" aria-label="I Shop Marketing — Always on time">
              <HeroVisual />
            </div>
          </div>
          <div className="shell hero-end">
            <a href="#about">
              <ArrowDown size={14} /> SCROLL TO DISCOVER
            </a>
            <span>CREATIVE THINKING. ALWAYS ON TIME.</span>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PARTNER / CLIENT TRUST MARQUEE                               */}
        {/* ============================================================ */}
        <section className="partner-marquee-section" aria-label="Client brands and partners">
          <div className="partner-marquee-track">
            {[...partners, ...partners].map((name, i) => (
              <span className="partner-item" key={i}>
                <span>{name}</span>
                <i>✦</i>
              </span>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* ABOUT US SECTION (Envato Structured Agency Layout)          */}
        {/* ============================================================ */}
        <section className="about-section section-pad ambient-section" id="about">
          <AmbientBackground reverse />
          <div className="shell about-grid">
            <div className="envato-about-visual">
              <div className="section-label">
                <span>01</span> ABOUT OUR AGENCY
              </div>
              <h2>
                Creativity with
                <br />
                <em>a purpose.</em>
              </h2>
              <div className="mt-4">
                <SriLankaMap />
              </div>
            </div>

            <div className="about-content">
              <p className="lead">
                We're a Sri Lankan marketing and creative agency helping businesses turn ambitious ideas into
                sustainable revenue and meaningful connections.
              </p>
              <p>
                Established in 2020 and headquartered in Colombo, I Shop Marketing (Pvt) Ltd operates under the
                philosophy “Always On Time.” As a full-service partner, we integrate research, brand identity, performance
                media, video cinematography, and on-ground activations into unified growth engines.
              </p>
              <p>
                Whether scaling nationwide retail footfall, launching export-grade Ayurvedic packaging, or deploying
                high-yield digital funnels, our focus remains on reliability, creativity, and effective execution.
              </p>
              <div className="about-signature">
                <div className="signature-mark">
                  i<span>SM</span>
                </div>
                <div>
                  <strong>Always on time.</strong>
                  <span>Our core commitment to every enterprise partner.</span>
                </div>
              </div>
              <div className="profile-stats">
                <div>
                  <strong>05+</strong>
                  <span>YEARS EXCELLENCE</span>
                </div>
                <div>
                  <strong>100+</strong>
                  <span>CLIENTS SERVED</span>
                </div>
                <div>
                  <strong>250+</strong>
                  <span>PROJECTS COMPLETED</span>
                </div>
                <div>
                  <strong>04</strong>
                  <span>PROVINCIAL HUBS</span>
                </div>
                <small>Official verified metrics from I Shop Marketing Corporate Profile.</small>
              </div>
            </div>
          </div>

          <div className="shell vision-grid">
            <div className="vision-item">
              <span>OUR VISION</span>
              <p>
                To become a trusted and recognized marketing and creative agency in Sri Lanka, empowering businesses to
                grow through innovation, strategic thinking, and meaningful brand communication.
              </p>
            </div>
            <div className="vision-item">
              <span>OUR MISSION</span>
              <p>
                To deliver strategic, creative, and results-oriented marketing solutions that help our clients strengthen
                their brands, connect with their audiences, and achieve their business objectives through reliable
                service and effective execution.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SERVICES SECTION (Envato Clean Interactive Layout)          */}
        {/* ============================================================ */}
        <section className="services-section section-pad ambient-section" id="services">
          <AmbientBackground />
          <div className="shell">
            <div className="section-heading">
              <div>
                <div className="section-label">
                  <span>02</span> WHAT WE DO
                </div>
                <h2>
                  Big picture thinking.
                  <br />
                  <em>Thoughtful execution.</em>
                </h2>
              </div>
              <p>
                From foundational brand identity systems to high-velocity ad campaigns, our 19 in-house services cover
                every touchpoint of modern growth.
              </p>
            </div>

            {/* Interactive Tabbed Detail */}
            <div className="services-layout">
              <div
                className="service-list"
                role="tablist"
                aria-label="Service categories"
                aria-orientation="vertical"
              >
                {services.map((service, index) => (
                  <button
                    key={service.name}
                    type="button"
                    role="tab"
                    id={`service-tab-${index}`}
                    aria-selected={activeService === index}
                    aria-controls={`service-panel-${index}`}
                    tabIndex={activeService === index ? 0 : -1}
                    className={activeService === index ? 'service-tab active' : 'service-tab'}
                    onClick={() => setActiveService(index)}
                  >
                    <span className="service-number">0{index + 1}</span>
                    <span>{service.name}</span>
                    <ArrowUpRight size={18} />
                  </button>
                ))}
              </div>
              <div
                className="service-detail"
                role="tabpanel"
                id={`service-panel-${activeService}`}
                aria-labelledby={`service-tab-${activeService}`}
              >
                <div className="service-icon">
                  <currentService.icon size={25} strokeWidth={1.4} />
                </div>
                <span className="detail-overline">OUR EXPERTISE / 0{activeService + 1}</span>
                <h3>{currentService.name}</h3>
                <p>{currentService.intro}</p>
                <ul>
                  {currentService.items.map((item) => (
                    <li key={item}>
                      <Check size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="detail-link">
                  Start a conversation <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pinned Cinematic Narrative Scene */}
        <ScrollStory />

        {/* ============================================================ */}
        {/* 4-STEP WORKING PROCESS (Envato Style Clean Step Cards)       */}
        {/* ============================================================ */}
        <section className="process-section section-pad ambient-section" id="process">
          <AmbientBackground />
          <div className="shell">
            <div className="section-heading">
              <div>
                <div className="section-label">
                  <span>03</span> HOW WE OPERATE
                </div>
                <h2>
                  Strategic clarity.
                  <br />
                  <em>Measured results.</em>
                </h2>
              </div>
              <p>
                Our 4-step execution framework bridges data-driven market diagnostics with high-velocity creative
                deployment.
              </p>
            </div>

            <div className="process-grid">
              {processSteps.map((s, idx) => (
                <div className="process-card" key={idx}>
                  <div className="process-number">{s.step}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SELECTED WORK / PORTFOLIO (Interactive Modal Gallery)       */}
        {/* ============================================================ */}
        <section className="work-section section-pad ambient-section" id="work">
          <AmbientBackground reverse />
          <div className="shell">
            <div className="section-heading">
              <div>
                <div className="section-label">
                  <span>04</span> SELECTED WORK
                </div>
                <h2>
                  Made with intention.
                  <br />
                  <em>Made to connect.</em>
                </h2>
              </div>
              <p>
                A curated look at verified client campaigns, brand identities, product packaging, and video productions
                from our corporate profile.
              </p>
            </div>
            <div className="filter-list" aria-label="Filter portfolio projects">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={filter === item ? 'filter active' : 'filter'}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="project-grid">
              {visibleProjects.map((project, index) => (
                <button
                  className="project-card"
                  type="button"
                  key={project.id}
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setSelectedProject(project);
                  }}
                >
                  <div className={`project-image project-${project.id}`}>
                    <img src={project.cover} alt="" loading="lazy" />
                    <span className="project-arrow">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                  <div className="project-meta">
                    <div>
                      <span>
                        {project.category} / {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3>{project.title}</h3>
                      <p>{project.subtitle}</p>
                    </div>
                    <ArrowUpRight size={19} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CINEMATIC BRAND FILM REEL                                    */}
        {/* ============================================================ */}
        <section className="video-reel-section">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="video-reel-bg"
          >
            <source src="/res/img/videopalyback.mp4" type="video/mp4" />
          </video>
          <div className="video-reel-overlay" />
          <div className="video-reel-content">
            <div className="video-reel-badge">
              <Sparkles size={12} />
              <span>PHILOSOPHY IN ACTION</span>
            </div>
            <h2>
              “Always On Time.
              <br />
              <em>Precision In Every Execution.”</em>
            </h2>
            <p>
              From Colombo’s commercial hub to regional corridors across Kandy, Anuradhapura, and Polonnaruwa, we
              empower brands to lead with confidence.
            </p>
            <a href="#contact" className="button button-gold">
              Commission your campaign <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        {/* Statement Bar */}
        <section className="statement">
          <div className="shell statement-inner">
            <span>OUR PROMISE</span>
            <p>
              Good work. Good people.
              <br />
              <em>Always on time.</em>
            </p>
            <a href="#contact">
              LET'S CREATE SOMETHING <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        {/* ============================================================ */}
        {/* REGIONAL OFFICES & PROVINCIAL FOOTPRINT                     */}
        {/* ============================================================ */}
        <section className="locations-section section-pad ambient-section" id="locations">
          <AmbientBackground />
          <div className="shell location-grid">
            <div>
              <div className="section-label">
                <span>05</span> WHERE TO FIND US
              </div>
              <h2>
                Rooted in Sri Lanka.
                <br />
                <em>Ready to connect.</em>
              </h2>
              <p className="location-intro">
                Headquartered in Wellawatta, Colombo, with active regional outposts across Central and North Central
                provinces. Wherever your business is headed, let's start a conversation.
              </p>
              <a className="text-link gold-link" href="#contact">
                Get in touch <ArrowRight size={16} />
              </a>
            </div>
            <div className="location-list">
              {[
                { city: 'Colombo', note: 'WELLAWATTA HEAD OFFICE', address: 'No 33, Collingwood Place, Wellawatta, Colombo 06' },
                { city: 'Kandy', note: 'CENTRAL PROVINCE OFFICE', address: 'Central Highlands Regional Command' },
                { city: 'Anuradhapura', note: 'NORTH CENTRAL REGIONAL OFFICE', address: 'North Central Provincial Command' },
                { city: 'Polonnaruwa', note: 'EASTERN GATEWAY COMMERCIAL BASE', address: 'Eastern Corridor Regional Office' },
              ].map((loc, index) => (
                <div className="location-row" key={loc.city}>
                  <div>
                    <span>0{index + 1}</span>
                    <strong>{loc.city}</strong>
                  </div>
                  <small>{loc.note}</small>
                  <MapPin size={17} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="team-section section-pad ambient-section" id="team">
          <AmbientBackground reverse />
          <div className="shell">
            <div className="section-heading">
              <div>
                <div className="section-label">
                  <span>06</span> OUR LEADERSHIP
                </div>
                <h2>
                  Meet the people
                  <br />
                  <em>behind the ideas.</em>
                </h2>
              </div>
              <p>
                Our leadership and operations team brings care, strategic insight, and dependable commitment to every
                enterprise partnership.
              </p>
            </div>
            <div className="team-grid">
              {team.map((person) => (
                <div className="team-card" key={person.name}>
                  <div className="team-monogram">{person.initials}</div>
                  <span>{person.role}</span>
                  <h3>{person.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FAQ ACCORDION SECTION (Envato Clean Q&A Style)              */}
        {/* ============================================================ */}
        <section className="faq-section section-pad ambient-section" id="faq">
          <AmbientBackground />
          <div className="shell faq-layout">
            <div>
              <div className="section-label">
                <span>07</span> FREQUENTLY ASKED QUESTIONS
              </div>
              <h2>
                Common questions.
                <br />
                <em>Clear answers.</em>
              </h2>
              <p className="mt-4 text-xs text-[#a3a096] leading-relaxed">
                Learn more about our methodology, engagement tiers, and how our “Always On Time” standard protects your
                marketing investments.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div className={`faq-item ${openFaq === idx ? 'open' : ''}`} key={idx}>
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    aria-expanded={openFaq === idx}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} />
                  </button>
                  {openFaq === idx && <div className="faq-answer">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* HIGH-IMPACT CTA BANNER                                       */}
        {/* ============================================================ */}
        <section className="cta-banner-section">
          <div className="shell cta-banner-inner">
            <div className="cta-banner-copy">
              <h2>
                Ready to accelerate your brand?
                <br />
                <em>Let's build something exceptional.</em>
              </h2>
              <p>
                Partner with Sri Lanka's trusted marketing and creative agency. Operating under our “Always On Time”
                philosophy.
              </p>
            </div>
            <div className="cta-banner-actions">
              <a href="tel:0717000779" className="cta-phone-btn">
                <Phone size={15} /> 071 7000 779
              </a>
              <a href="#contact" className="button button-gold">
                Start your project <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CONTACT SECTION (Direct Channels + Form)                     */}
        {/* ============================================================ */}
        <section className="contact-section section-pad ambient-section" id="contact">
          <AmbientBackground />
          <div className="shell contact-grid">
            <div className="contact-copy">
              <div className="section-label">
                <span>08</span> START A CONVERSATION
              </div>
              <h2>
                Have an ambitious idea?
                <br />
                <em>Let's make it happen.</em>
              </h2>
              <p>
                Tell us about your brand, current challenges, and revenue goals. Operating under our “Always On Time”
                commitment, our senior team will connect with you promptly.
              </p>
              <div className="contact-details">
                <a href="tel:0717000779">
                  <Phone size={17} />
                  <span>
                    <small>OFFICIAL PROFILE LINE</small>071 7000 779
                  </span>
                  <ArrowUpRight size={16} />
                </a>
                <a href="mailto:info.ishopmarketing@gmail.com">
                  <Mail size={17} />
                  <span>
                    <small>DIRECT ELECTRONIC DISPATCH</small>info.ishopmarketing@gmail.com
                  </span>
                  <ArrowUpRight size={16} />
                </a>
                <div>
                  <MapPin size={17} />
                  <span>
                    <small>HEADQUARTERS</small>No 33, Collingwood Place, Wellawatta,
                    <br />
                    Colombo 06, Sri Lanka
                  </span>
                </div>
              </div>
              <div className="other-contacts">
                Direct telephone lines:{' '}
                <a href="tel:0773482002">077 348 2002</a> · <a href="tel:0767772002">076 777 2002</a> ·{' '}
                <a href="tel:0112582002">011 258 2002</a>
                <br />
                <a href="mailto:info@ishopmarketing.lk">info@ishopmarketing.lk</a>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContact}>
              <div className="form-heading">
                <span>YOUR NEXT CHAPTER STARTS HERE</span>
                <Sparkles size={20} />
              </div>
              <div className="form-grid">
                <label>
                  Your name{' '}
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Kasun Perera"
                    required
                  />
                </label>
                <label>
                  Company / brand{' '}
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your enterprise name"
                  />
                </label>
                <label>
                  Email address{' '}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.lk"
                    required
                  />
                </label>
                <label>
                  Phone number{' '}
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="07X XXX XXXX"
                  />
                </label>
              </div>
              <label>
                Primary Service Required{' '}
                <select name="service" defaultValue="" required>
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                  <option value="Full Retainer">Comprehensive Full Retainer</option>
                  <option value="Other">Something else</option>
                </select>
              </label>
              <label>
                Tell us about your project{' '}
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your objectives, timeline, target audience, and marketing goals..."
                  required
                />
              </label>
              <button className="button button-gold form-submit" type="submit">
                Submit project enquiry <ArrowUpRight size={17} />
              </button>
              <p className="form-note">
                Prepares your email directly to our managing team with full inquiry specifications.
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* ============================================================== */}
      {/* MULTI-COLUMN ARCHIVAL FOOTER                                   */}
      {/* ============================================================== */}
      <footer className="site-footer">
        <div className="shell">
          <div className="footer-top">
            <div>
              <a className="brand footer-brand" href="#top">
                <img src="/res/img/ism-logo-official-white.png" alt="iSM" />
                <span className="brand-copy">
                  <strong>I SHOP MARKETING</strong>
                  <small>ALWAYS ON TIME</small>
                </span>
              </a>
              <p>
                Creative solutions. Integrated marketing.
                <br />
                Engineered for sustainable enterprise growth.
              </p>
            </div>
            <div className="footer-links">
              <span>EXPLORE</span>
              {navLinks.map(([label, href]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </div>
            <div className="footer-links">
              <span>DIRECT CONTACT</span>
              <a href="tel:0717000779">071 7000 779</a>
              <a href="mailto:info.ishopmarketing@gmail.com">info.ishopmarketing@gmail.com</a>
              <a href="https://www.ishopmarketing.com" target="_blank" rel="noreferrer">
                www.ishopmarketing.com <ArrowUpRight size={13} />
              </a>
              <span className="text-[10px] text-[#777] mt-2">
                COLOMBO • KANDY • ANURADHAPURA • POLONNARUWA
              </span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2020 - {new Date().getFullYear()} I SHOP MARKETING (PVT) LTD. ALL RIGHTS RESERVED.</span>
            <a href="#top">BACK TO TOP ↑</a>
            <span>ESTABLISHED 2020 • COLOMBO, SRI LANKA</span>
          </div>
        </div>
      </footer>

      <FloatingNav hidden={menuOpen || !!selectedProject} />
      {selectedProject && (
        <ProjectGallery
          key={selectedProject.id}
          project={selectedProject}
          onClose={closeProject}
          returnFocus={triggerRef.current}
        />
      )}
    </div>
  );
}

export default App;
