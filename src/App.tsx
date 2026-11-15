import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  Eye,
  Film,
  Globe,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Palette,
  Phone,
  Play,
  Radio,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

// ============================================================================
// DATA EXTRACTED FROM OFFICIAL 2026 COMPANY PROFILE PDF
// ============================================================================

// 19 Official Services from PDF Page 4 categorized into 5 Core Pillars
const serviceCategories = [
  {
    id: 'digital',
    pillar: 'DIGITAL & PERFORMANCE',
    icon: BarChart3,
    highlight: 'Strategy & ROI',
    description:
      'Data-driven digital marketing infrastructure, multi-channel growth funnels, and organic search dominance.',
    services: [
      { name: 'Digital Marketing Strategy', desc: 'Holistic digital roadmaps aligning acquisition channels with unit economics.' },
      { name: 'Marketing Consultancy', desc: 'Expert advisory for brand positioning, commercial scaling, and market entry.' },
      { name: 'Campaign Planning & Promotional Strategy', desc: 'End-to-end tactical campaign blueprints designed for peak conversion seasons.' },
      { name: 'Search Engine Optimization (SEO)', desc: 'Technical, on-page, and authority SEO driving sustainable high-intent search traffic.' },
    ],
  },
  {
    id: 'social',
    pillar: 'SOCIAL MEDIA & ADS',
    icon: Share2,
    highlight: 'Audience Reach',
    description:
      'High-impact social media management, algorithmic paid advertising, and high-converting influencer collaborations.',
    services: [
      { name: 'Social Media Management', desc: 'Consistent, aesthetic daily brand curation across Instagram, TikTok, Facebook, & LinkedIn.' },
      { name: 'Social Media Advertising & Boosting', desc: 'Precision audience targeting, retargeting funnels, and budget optimization for maximum ROAS.' },
      { name: 'Influencer-Led Promotional Campaigns', desc: 'Strategic creator partnerships delivering authentic reach and social proof.' },
      { name: 'Influencer Marketing Coordination', desc: 'Contracting, briefing, content approvals, and performance attribution for influencer tiers.' },
    ],
  },
  {
    id: 'branding',
    pillar: 'BRANDING & DESIGN',
    icon: Palette,
    highlight: 'Visual Identity',
    description:
      'Enduring brand identity systems, packaging artwork, and bespoke marketing collateral that command respect.',
    services: [
      { name: 'Branding & Visual Communication', desc: 'Complete brand guidelines, design languages, typography hierarchies, and color palettes.' },
      { name: 'Logo Design', desc: 'Timeless trademark symbols, monograms, and wordmarks built with conceptual depth.' },
      { name: 'Label & Packaging Design', desc: 'Export-grade FMCG and luxury packaging artwork engineered for shelf appeal.' },
      { name: 'Graphic Design', desc: 'Sleek promotional layouts, digital assets, and editorial print production.' },
      { name: 'Marketing & Promotional Creatives', desc: 'Direct-response banners, carousel ads, and high-converting visual assets.' },
    ],
  },
  {
    id: 'production',
    pillar: 'MEDIA PRODUCTION',
    icon: Film,
    highlight: 'Cinematography',
    description:
      'Cinematic commercials, documentary storytelling, professional product photography, and viral presenter reels.',
    services: [
      { name: 'Video Production', desc: 'High-definition brand commercials, promotional videos, and corporate showreels.' },
      { name: 'Documentary Production', desc: 'In-depth corporate narratives capturing founder journeys and heritage milestones.' },
      { name: 'Commercial Photography', desc: 'Studio product shoots, culinary captures, and executive corporate portraits.' },
      { name: 'Live Presenting Reels', desc: 'Presenter-led promotional video series designed specifically for TikTok, IG Reels, and Shorts.' },
    ],
  },
  {
    id: 'activations',
    pillar: 'ON-GROUND & EVENTS',
    icon: Megaphone,
    highlight: 'Physical Agility',
    description:
      'Connecting digital funnels with tangible consumer experiences through island-wide physical marketing deployments.',
    services: [
      { name: 'Event Marketing', desc: 'Experiential event design, press launches, and high-visibility corporate showcases.' },
      { name: 'Promotional Activations', desc: 'Mall activations, roadshows, and interactive product sampling installations.' },
      { name: 'Brand Engagement Activities', desc: 'Community building campaigns and experiential touchpoints that build loyalty.' },
      { name: 'Offline Promotional Campaigns', desc: 'Billboards, print media, and traditional cross-channel broadcast strategies.' },
      { name: 'Physical Marketing Activities', desc: 'Direct-to-consumer field marketing teams deployed across Sri Lankan provinces.' },
    ],
  },
];

// Portfolio & Case Studies Extracted from PDF Pages 6-15
const portfolioItems = [
  {
    id: 'devi-brand',
    category: 'branding',
    title: 'DEVII Ayurvedic Products',
    scope: 'Brand Identity & Visual System',
    tags: ['Logo Design', 'Brand Guidelines', 'Ayurvedic Heritage'],
    image: '/res/portfolio/p6_img1.jpeg',
    crop: '/res/crops/devi_artwork.jpg',
    colorScheme: '#355145 / #EEE49F',
    description:
      'Complete brand identity for DEVII Ayurvedic Products inspired by authentic Ayurvedic wisdom. Features the Goddess Face symbolizing care, nurturing, and natural power, combined with the sacred Peacock Feather representing beauty, spirituality, and holistic healing.',
    highlights: [
      'Custom typography: Ravane Trial paired with Montserrat SemiBold',
      'Organic natural color palette: #355145 (Deep Forest Green) and #EEE49F (Soft Gold/Cream)',
      'Tagline development: "Change your health with Ayurvedic Lifestyle"',
    ],
  },
  {
    id: 'buygenuine',
    category: 'branding',
    title: 'BuyGenuine LK',
    scope: 'Automotive Verification Brand System',
    tags: ['Logo Variations', 'Trademark Design', 'Automotive Trust'],
    image: '/res/portfolio/p7_img1.jpeg',
    crop: '/res/crops/buygenuine_mark.jpg',
    colorScheme: '#E11D48 / #0F172A',
    description:
      'A comprehensive brand system for Sri Lanka’s premier vehicle auction verification platform. Incorporates a dynamic vehicle silhouette, protective shield, and the True Mark Check representing verified authenticity and confidence.',
    highlights: [
      'Shield motif: represents safety, protection, and trusted vehicle documentation',
      'True Mark Check: symbolizes authenticity and verification accuracy',
      'Red accent: inspired by Japan and official Japanese vehicle auction sheets',
    ],
  },
  {
    id: 'island-tea',
    category: 'social',
    title: 'Island Tea Co. & Ceylon Coffee Club',
    scope: 'F&B Social Media & Product Launch',
    tags: ['Social Media Flyers', 'F&B Creative', 'Dambulla Branch'],
    image: '/res/portfolio/p8_img1.jpeg',
    crop: '/res/crops/island_tea_oreo.jpg',
    colorScheme: '#6F4E37 / #D4AF37',
    description:
      'Mouth-watering social media campaign promoting specialty beverages, including the signature Oreo Cream Cheese Milk Tea, Single-Origin Ceylon Coffee Beans, and health benefit infographics for the Dambulla branch.',
    highlights: [
      'Sensory product photography & dynamic splash composition',
      'Multi-touch social media campaign across Instagram and Facebook',
      'Footfall driving promotional flyers for local cafe patrons',
    ],
  },
  {
    id: 'lbk-honey',
    category: 'social',
    title: 'LBK Natural Bee Honey & Ghee',
    scope: 'Ayurvedic FMCG Social Media Campaigns',
    tags: ['Social Media Creatives', 'Ayurvedic FMCG', 'Direct Sales'],
    image: '/res/portfolio/p9_img1.jpeg',
    crop: '/res/crops/lbk_honey_jar.jpg',
    colorScheme: '#D97706 / #78350F',
    description:
      'Direct-response promotional campaigns for 100% natural Ceylon Cinnamon & Bee Honey, Mee Panee Elagitel Rata Idhi (Bees’ Honey & Ghee with Dates), and Sathpanguwa traditional herbal formulas with Cash on Delivery nationwide.',
    highlights: [
      'High-conversion direct-response creatives with dedicated hotline callouts',
      'Authentic herbal recipe visual styling and ingredient breakdowns',
      'Nationwide 2-day delivery logistics coordination marketing',
    ],
  },
  {
    id: 'devi-labels',
    category: 'packaging',
    title: 'DEVII Herbal Skincare Range',
    scope: 'Export-Grade Label & Packaging Design',
    tags: ['Packaging Design', 'Bottle Labels', 'Gold Foil Motifs'],
    image: '/res/portfolio/p13_img1.jpeg',
    crop: '/res/crops/devi_bodywash_bottle.jpg',
    colorScheme: '#C5A059 / #355145',
    description:
      'Intricate packaging and label design for DEVII Miracle Marigold Skin Care Oil, Herbal Body Wash, Hair Conditioner, and Facial Wash. Featuring traditional intricate gold mandalas and peacock feather flourishes on embossed metallic substrate.',
    highlights: [
      'Complete regulatory and batch information layouts on 100ml and 200ml bottles',
      'Harmonious golden filigree patterns conveying purity, luxury, and holistic heritage',
      'Consistent shelf presence across an expanding personal care product line',
    ],
  },
  {
    id: 'seedevi',
    category: 'social',
    title: 'Seedevi Family Restaurant',
    scope: 'Culinary Promotion & Offer Strategy',
    tags: ['Restaurant Marketing', 'Offer Strategy', 'Anuradhapura'],
    image: '/res/portfolio/p11_img1.jpeg',
    crop: '/res/crops/seedevi_roasted_chicken.jpg',
    colorScheme: '#DC2626 / #F59E0B',
    description:
      'High-impact promotional campaign in Anuradhapura featuring Roasted Chicken with Free Kottu combos, Dum Biryani Family Packs, and Master Indian Chef specialties with multi-bottle Coke partner promotions.',
    highlights: [
      'Appetite-driven food photography and vibrant price point callouts',
      'Strategic family pack combo architectures increasing average bill values',
      'Targeted local social advertising driving peak weekend dine-in and takeaways',
    ],
  },
  {
    id: 'cafe89',
    category: 'social',
    title: 'Café 89 Anuradhapura',
    scope: 'Cafe Branding & Lifestyle Social Media',
    tags: ['Cafe Culture', 'Beverage Promotion', 'Youth Lifestyle'],
    image: '/res/portfolio/p12_img1.jpeg',
    crop: '/res/crops/cafe89_brownie.jpg',
    colorScheme: '#451A03 / #92400E',
    description:
      'Rich, cozy lifestyle marketing for Café 89 ("It’s coffee time"). Campaigns highlighting fresh cappuccino, decadent chocolate brownies, creamy avocado milkshakes, and themed Valentine’s Day date promotions.',
    highlights: [
      'Warm earthy tone aesthetic matching contemporary artisanal coffee culture',
      'Seasonal activation campaigns ("Choose Love... Choose Cafe 89")',
      'Youth-centric social media engagement boosting youth hangout footfall',
    ],
  },
  {
    id: 'live-reels',
    category: 'production',
    title: 'Live Presenting Video Reels',
    scope: 'On-Camera Presenter Video Production',
    tags: ['Live Presenter', 'TikTok & Reels', 'Brand Ambassador'],
    image: '/res/portfolio/p15_img1.jpeg',
    crop: '/res/crops/reel_hotel_creston.jpg',
    colorScheme: '#2563EB / #059669',
    description:
      'Professionally produced promotional video series featuring on-camera live presenters who introduce businesses, showcase products, and communicate brand narratives in an authentic, high-converting vertical video format.',
    highlights: [
      'Hotel Creston Park promotional feature introducing boutique hospitality amenities',
      'Heritage Wedding Cars vintage vehicle fleet showcase for prospective couples',
      'Turnkey production: scripting, teleprompter, lighting, filming, and kinetic editing',
    ],
  },
];

// Preserved Team Members (As Requested)
const teamMembers = [
  {
    name: 'I K S Ilangakoon',
    role: 'Managing Director',
    domain: 'Enterprise Sovereign Strategy & Growth Architecture',
    bio: 'Oversees overall company governance, enterprise partnerships, and long-term expansion across Sri Lanka.',
  },
  {
    name: 'I Y R Ilangakoon',
    role: 'General Manager',
    domain: 'Operational Stewardship & Client Delivery',
    bio: 'Directs daily agency operations, cross-department logistics, and ensures the "Always On Time" promise.',
  },
  {
    name: 'Sanjana Prasad',
    role: 'Chief Executive Officer',
    domain: 'Growth Systems & Performance Media',
    bio: 'Leads digital innovation, algorithmic paid media execution, and omnichannel conversion optimization.',
  },
  {
    name: 'Chamathka Wijesinghe',
    role: 'Assistant Operations Manager',
    domain: 'Client Onboarding & Quality Control Protocols',
    bio: 'Ensures flawless campaign onboarding, creative quality assurance, and seamless client communication.',
  },
  {
    name: 'Isanga Sathsara',
    role: 'Assistant Operations Manager',
    domain: 'Analytics & Campaign Execution',
    bio: 'Specializes in real-time attribution data, audience analytics, and multi-channel campaign deployment.',
  },
];

// 4 Strategic Regional Offices from PDF Page 5
const regionalOffices = [
  {
    city: 'Colombo',
    role: 'Headquarters & Executive Command',
    address: 'No 33, Collingwood Place, Wellawatta, Colombo 06',
    status: 'MAIN OFFICE',
    detail: 'Strategic consulting, brand identity studio, and central executive command.',
  },
  {
    city: 'Kandy',
    role: 'Central Highlands Regional Office',
    address: 'Central Province Regional Command, Kandy',
    status: 'REGIONAL HUB',
    detail: 'Serving the central hill country, plantation enterprises, and regional hospitality brands.',
  },
  {
    city: 'Anuradhapura',
    role: 'North Central Regional Office',
    address: 'North Central Territorial Base, Anuradhapura',
    status: 'REGIONAL HUB',
    detail: 'Empowering North Central commerce, retail franchises, and food & beverage leaders.',
  },
  {
    city: 'Polonnaruwa',
    role: 'Eastern Gateway Operations',
    address: 'Eastern Corridor Commercial Center, Polonnaruwa',
    status: 'REGIONAL HUB',
    detail: 'Connecting agricultural, commercial, and tourism ventures across the eastern gateway.',
  },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeServiceTab, setActiveServiceTab] = useState<string>('digital');
  const [selectedPortfolioModal, setSelectedPortfolioModal] = useState<(typeof portfolioItems)[0] | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAtmosphere, setIsPlayingAtmosphere] = useState(false);
  const [scrolledNav, setScrolledNav] = useState(false);
  const [submittedForm, setSubmittedForm] = useState(false);

  // Audio synthesis ref for atmospheric dunnage warehouse drone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  // Lenis smooth inertia scrolling initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    const handleScroll = () => {
      setScrolledNav(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // Atmospheric Sound Synthesizer (Warm Scotch dunnage resonance)
  const toggleAtmosphere = () => {
    try {
      if (!isPlayingAtmosphere) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 3);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110.2, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
        setIsPlayingAtmosphere(true);
      } else {
        if (gainNodeRef.current && audioCtxRef.current) {
          gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1.2);
          setTimeout(() => {
            osc1Ref.current?.stop();
            osc2Ref.current?.stop();
            audioCtxRef.current?.close();
            setIsPlayingAtmosphere(false);
          }, 1200);
        } else {
          setIsPlayingAtmosphere(false);
        }
      }
    } catch (err) {
      console.warn('Atmosphere audio unavailable:', err);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedForm(true);
  };

  const filteredPortfolio =
    activeCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#f5f2eb] font-sans-clean overflow-hidden selection:bg-[#c5a059] selection:text-black">
      {/* Film Grain Texture Overlay */}
      <div className="film-grain" />

      {/* ============================================================== */}
      {/* NAVIGATION: Sleek, Architectural, Luxury Finn Thomson Style   */}
      {/* ============================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolledNav
            ? 'bg-[#080808]/95 backdrop-blur-md border-b border-[#c5a059]/20 py-3.5 shadow-[0_15px_30px_rgba(0,0,0,0.85)]'
            : 'bg-transparent border-b border-white/[0.07] py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo & Provenance */}
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/res/img/ism-logo-official-white.png"
              alt="iSM I Shop Marketing (Pvt) Ltd"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col border-l border-white/[0.1] pl-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a059] font-cinzel font-semibold">
                ALWAYS ON TIME
              </span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-[#a8a49c]">
                ESTABLISHED 2020 • SRI LANKA
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-[0.2em] uppercase text-[#a8a49c]">
            <button onClick={() => scrollToSection('about')} className="hover:text-[#c5a059] transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('services')} className="hover:text-[#c5a059] transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection('work')} className="hover:text-[#c5a059] transition-colors">
              Portfolio
            </button>
            <button onClick={() => scrollToSection('offices')} className="hover:text-[#c5a059] transition-colors">
              Offices
            </button>
            <button onClick={() => scrollToSection('team')} className="hover:text-[#c5a059] transition-colors">
              Leadership
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Atmosphere toggle */}
            <button
              onClick={toggleAtmosphere}
              aria-label="Toggle atmospheric sound"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/5 hover:border-[#c5a059] text-[#c5a059] text-[9px] tracking-[0.2em] uppercase transition-all"
            >
              {isPlayingAtmosphere ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#c5a059]" />
                  <span>ATMOSPHERE ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 opacity-60" />
                  <span className="opacity-70">ATMOSPHERE OFF</span>
                </>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => scrollToSection('contact')}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#c5a059] bg-[#c5a059] hover:bg-[#e6ca85] text-black text-[11px] tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_20px_rgba(197,160,89,0.25)]"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#c5a059]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0c0c0e] border-b border-[#c5a059]/20 px-6 py-8 flex flex-col gap-5 text-sm tracking-[0.2em] uppercase">
            <button onClick={() => scrollToSection('about')} className="text-left py-2 border-b border-white/[0.05]">
              About Us
            </button>
            <button onClick={() => scrollToSection('services')} className="text-left py-2 border-b border-white/[0.05]">
              Our Services (19)
            </button>
            <button onClick={() => scrollToSection('work')} className="text-left py-2 border-b border-white/[0.05]">
              Client Portfolio
            </button>
            <button onClick={() => scrollToSection('offices')} className="text-left py-2 border-b border-white/[0.05]">
              Regional Offices (4)
            </button>
            <button onClick={() => scrollToSection('team')} className="text-left py-2 border-b border-white/[0.05]">
              Executive Team
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-left py-2 text-[#c5a059] font-bold">
              Contact & Inquiries
            </button>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* HERO SECTION: Monolithic, Cinematic Editorial Presentation     */}
      {/* ============================================================== */}
      <section className="relative min-h-screen pt-36 pb-24 flex flex-col justify-center items-center px-6 lg:px-12 overflow-hidden">
        {/* Amber Glow Lighting */}
        <div className="amber-glow-hero absolute inset-0 pointer-events-none" />
        <div className="amber-glow-spot top-1/4 left-1/2 -translate-x-1/2" />

        {/* Provenance Badge */}
        <div className="relative mb-6 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#c5a059]/35 bg-[#c5a059]/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a059] font-cinzel font-semibold">
              I SHOP MARKETING (PVT) LTD • CORPORATE PROFILE
            </span>
          </div>
        </div>

        {/* Monolithic Serif Headline */}
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em] leading-[1.05] text-[#f5f2eb]">
            Always On Time. <br />
            <span className="italic text-gold-gradient">Built For Growth.</span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-[#a8a49c] font-light leading-relaxed">
            Established in 2020 in Colombo, Sri Lanka, I Shop Marketing is a full-service marketing and creative agency
            uniting strategy, design, technology, and reliable execution to drive measurable enterprise growth.
          </p>

          {/* Core Pillars Banner from Page 1 */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-cinzel tracking-[0.25em] text-[#a8a49c]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
              <span className="text-[#f5f2eb]">CREATIVE SOLUTIONS</span>
            </div>
            <span className="text-[#c5a059]/50">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
              <span className="text-[#f5f2eb]">INTEGRATED MARKETING</span>
            </div>
            <span className="text-[#c5a059]/50">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
              <span className="text-[#f5f2eb]">BUSINESS GROWTH</span>
            </div>
          </div>

          {/* Official Metrics Bar from PDF Page 2 */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto p-4 rounded-xl border border-[#c5a059]/20 bg-[#121215]/70 backdrop-blur-md">
            <div className="text-left px-4 py-2 border-r border-white/[0.06]">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-cinzel">CLIENTS SERVED</div>
              <div className="text-2xl font-serif-luxury font-bold text-[#f5f2eb] mt-0.5">100+</div>
              <div className="text-[8px] text-[#a8a49c]">Verified corporate base</div>
            </div>
            <div className="text-left px-4 py-2 border-r border-white/[0.06]">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-cinzel">PROJECTS DELIVERED</div>
              <div className="text-2xl font-serif-luxury font-bold text-[#f5f2eb] mt-0.5">250+</div>
              <div className="text-[8px] text-[#a8a49c]">Completed on time</div>
            </div>
            <div className="text-left px-4 py-2 border-r border-white/[0.06]">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-cinzel">REGIONAL OFFICES</div>
              <div className="text-2xl font-serif-luxury font-bold text-[#f5f2eb] mt-0.5">04</div>
              <div className="text-[8px] text-[#a8a49c]">Island-wide presence</div>
            </div>
            <div className="text-left px-4 py-2">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-cinzel">ESTABLISHED</div>
              <div className="text-2xl font-serif-luxury font-bold text-[#f5f2eb] mt-0.5">2020</div>
              <div className="text-[8px] text-[#a8a49c]">Colombo, Sri Lanka</div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => scrollToSection('work')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#c5a059] text-black font-semibold text-xs tracking-[0.22em] uppercase hover:bg-[#e6ca85] transition-all duration-300 shadow-[0_10px_35px_rgba(197,160,89,0.3)] flex items-center justify-center gap-3"
            >
              <span>VIEW PORTFOLIO & WORK</span>
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/[0.15] bg-white/[0.03] hover:border-[#c5a059] text-[#f5f2eb] hover:text-[#c5a059] font-medium text-xs tracking-[0.22em] uppercase transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>OUR 19 SERVICES</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-60">
          <span className="text-[8px] uppercase tracking-[0.3em] text-[#c5a059] font-cinzel">SCROLL TO DISCOVER</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#c5a059] to-transparent animate-pulse" />
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: ABOUT US & PHILOSOPHY (From PDF Page 2)               */}
      {/* ============================================================== */}
      <section id="about" className="py-28 px-6 lg:px-12 relative border-t border-b border-[#c5a059]/15 bg-[#0a0a0d]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059]">
                  ABOUT I SHOP MARKETING
                </span>
                <div className="h-[1px] w-16 bg-[#c5a059]/40" />
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#f5f2eb] leading-tight mb-8">
                Operating Under The Philosophy <br />
                <span className="italic text-gold-gradient">“Always On Time”</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#a8a49c] font-light leading-relaxed">
                <p>
                  <strong className="text-[#f5f2eb] font-semibold">I Shop Marketing (Pvt) Ltd</strong> is a Sri Lankan
                  marketing and creative agency established in 2020, with its headquarters in Colombo, Sri Lanka.
                </p>
                <p>
                  Operating under the philosophy “Always On Time,” the company aims to help businesses strengthen their
                  market presence, communicate effectively with their target audiences, and pursue sustainable business
                  growth through strategic marketing and creative solutions.
                </p>
                <p>
                  As a full-service marketing and creative agency, I Shop Marketing seeks to bring strategy, creativity,
                  technology, and execution together to support the evolving marketing needs of local businesses and
                  corporate organizations.
                </p>
                <p>
                  Through a focus on reliability, creativity, and effective execution, I Shop Marketing aims to build
                  lasting client relationships and become a trusted marketing partner for businesses seeking to grow and
                  compete in an increasingly digital marketplace.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-6 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-xs text-[#f5f2eb]">Strategic Reliability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-xs text-[#f5f2eb]">Creative Execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-xs text-[#f5f2eb]">Measurable Results</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="luxury-card rounded-2xl p-8 relative overflow-hidden border border-[#c5a059]/25">
                <div className="text-[10px] font-cinzel tracking-[0.25em] text-[#c5a059] uppercase mb-4">
                  PROVEN AGENCY TRACK RECORD
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-[#080808]/70 border border-white/[0.06]">
                    <div className="text-3xl font-serif-luxury font-bold text-[#f5f2eb]">100+</div>
                    <div className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider mt-1">
                      CLIENTS SERVED
                    </div>
                    <p className="text-[11px] text-[#a8a49c] mt-1">
                      Spanning healthcare, F&B, automotive, luxury apparel, real estate, and consumer brands.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#080808]/70 border border-white/[0.06]">
                    <div className="text-3xl font-serif-luxury font-bold text-[#f5f2eb]">250+</div>
                    <div className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider mt-1">
                      PROJECTS COMPLETED
                    </div>
                    <p className="text-[11px] text-[#a8a49c] mt-1">
                      From brand identity design to high-yield digital ad campaigns and video productions.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#080808]/70 border border-white/[0.06]">
                    <div className="text-3xl font-serif-luxury font-bold text-[#f5f2eb]">04 Hubs</div>
                    <div className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider mt-1">
                      STRATEGIC REGIONAL OFFICES
                    </div>
                    <p className="text-[11px] text-[#a8a49c] mt-1">
                      Colombo (Headquarters), Kandy, Anuradhapura, and Polonnaruwa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: VISION & MISSION (From PDF Page 3)                    */}
      {/* ============================================================== */}
      <section className="py-24 px-6 lg:px-12 relative bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="luxury-card rounded-2xl p-10 relative overflow-hidden border border-[#c5a059]/20 group hover:border-[#c5a059]/50 transition-all">
              <div className="w-12 h-12 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] mb-6">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059] mb-2">OUR PURPOSE</div>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#f5f2eb] font-normal mb-5">VISION</h3>
              <p className="text-[#a8a49c] text-sm sm:text-base font-light leading-relaxed">
                “To become a trusted and recognized marketing and creative agency in Sri Lanka, empowering businesses to
                grow through innovation, strategic thinking, and meaningful brand communication.”
              </p>
            </div>

            {/* Mission Card */}
            <div className="luxury-card rounded-2xl p-10 relative overflow-hidden border border-[#c5a059]/20 group hover:border-[#c5a059]/50 transition-all">
              <div className="w-12 h-12 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059] mb-2">OUR MANDATE</div>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#f5f2eb] font-normal mb-5">MISSION</h3>
              <p className="text-[#a8a49c] text-sm sm:text-base font-light leading-relaxed">
                “To deliver strategic, creative, and results-oriented marketing solutions that help our clients strengthen
                their brands, connect with their audiences, and achieve their business objectives through reliable service
                and effective execution.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: 19 SERVICES (From PDF Page 4)                          */}
      {/* ============================================================== */}
      <section id="services" className="py-32 px-6 lg:px-12 relative border-t border-white/[0.06] bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059] mb-3">
                OFFICIAL SERVICE CAPABILITIES
              </div>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-light">
                Our 19 Comprehensive Services
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#a8a49c] font-light leading-relaxed">
              Every discipline is executed in-house with dedicated specialists across strategy, graphic design, copywriting,
              cinematography, and performance media buying.
            </p>
          </div>

          {/* Service Pillar Tabs */}
          <div className="flex flex-wrap gap-2.5 mb-12 border-b border-white/[0.08] pb-6">
            {serviceCategories.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setActiveServiceTab(pillar.id)}
                className={`px-5 py-3 rounded-full text-xs font-cinzel tracking-[0.18em] uppercase transition-all duration-300 flex items-center gap-2 ${
                  activeServiceTab === pillar.id
                    ? 'bg-[#c5a059] text-black font-bold shadow-[0_0_20px_rgba(197,160,89,0.3)]'
                    : 'bg-[#141417] text-[#a8a49c] hover:text-[#f5f2eb] border border-white/[0.06] hover:border-[#c5a059]/30'
                }`}
              >
                <pillar.icon className="w-3.5 h-3.5" />
                <span>{pillar.pillar}</span>
              </button>
            ))}
          </div>

          {/* Active Pillar Details Card */}
          {(() => {
            const currentPillar = serviceCategories.find((c) => c.id === activeServiceTab) || serviceCategories[0];
            return (
              <div className="luxury-card rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/[0.08] mb-8 gap-4">
                  <div>
                    <span className="text-[10px] font-cinzel tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
                      PILLAR FOCUS: {currentPillar.highlight}
                    </span>
                    <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#f5f2eb] font-normal">
                      {currentPillar.pillar}
                    </h3>
                  </div>
                  <p className="max-w-md text-xs sm:text-sm text-[#a8a49c] font-light">
                    {currentPillar.description}
                  </p>
                </div>

                {/* Sub-services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPillar.services.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-xl bg-[#080808]/70 border border-white/[0.06] hover:border-[#c5a059]/40 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/5 flex items-center justify-center text-[#c5a059] text-xs font-cinzel mb-4">
                        0{idx + 1}
                      </div>
                      <h4 className="font-serif-luxury text-xl text-[#f5f2eb] font-normal mb-2 group-hover:text-[#c5a059] transition-colors">
                        {srv.name}
                      </h4>
                      <p className="text-xs text-[#a8a49c] font-light leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: CLIENT PORTFOLIO (From PDF Pages 6-15)                */}
      {/* ============================================================== */}
      <section id="work" className="py-32 px-6 lg:px-12 relative bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059] mb-3">
                VERIFIED COMPANY ARCHIVES
              </div>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-light">
                Featured Client Portfolio
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#a8a49c] font-light leading-relaxed">
              Real client campaigns, brand identity systems, product packaging labels, and viral presenter video reels
              delivered by I Shop Marketing.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2.5 mb-12">
            {[
              { id: 'all', label: 'All Projects (8)' },
              { id: 'branding', label: 'Brand & Logo Design' },
              { id: 'packaging', label: 'Packaging & Labels' },
              { id: 'social', label: 'Social Media Campaigns' },
              { id: 'production', label: 'Live Presenter Reels' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-cinzel tracking-[0.18em] uppercase transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[#c5a059] text-black font-bold'
                    : 'bg-[#141417] text-[#a8a49c] hover:text-[#f5f2eb] border border-white/[0.06] hover:border-[#c5a059]/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPortfolioModal(item)}
                className="luxury-card rounded-2xl overflow-hidden cursor-pointer group hover:border-[#c5a059]/50 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#080808]/80 backdrop-blur-md border border-[#c5a059]/30 text-[9px] font-cinzel tracking-[0.2em] text-[#c5a059]">
                      {item.scope}
                    </div>

                    <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#c5a059] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[8px] font-cinzel tracking-[0.15em] uppercase bg-white/[0.04] text-[#a8a49c] border border-white/[0.05]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif-luxury text-2xl text-[#f5f2eb] font-normal mb-2 group-hover:text-[#c5a059] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#a8a49c] font-light leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-cinzel tracking-wider text-[#c5a059]">
                  <span>INSPECT DETAILS</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PORTFOLIO MODAL (Detailed High-Res Showcase)                  */}
      {/* ============================================================== */}
      {selectedPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0d0d10] border border-[#c5a059]/40 rounded-2xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            {/* Close button */}
            <button
              onClick={() => setSelectedPortfolioModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/[0.1] hover:border-[#c5a059] text-[#a8a49c] hover:text-[#f5f2eb] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scope badge */}
            <div className="text-[10px] font-cinzel uppercase tracking-[0.25em] text-[#c5a059] mb-2">
              {selectedPortfolioModal.scope}
            </div>

            <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#f5f2eb] font-normal mb-6">
              {selectedPortfolioModal.title}
            </h3>

            {/* Full-res Image */}
            <div className="w-full rounded-xl overflow-hidden border border-white/[0.1] mb-6 bg-black">
              <img
                src={selectedPortfolioModal.image}
                alt={selectedPortfolioModal.title}
                className="w-full h-auto max-h-[500px] object-contain mx-auto"
              />
            </div>

            <p className="text-sm sm:text-base text-[#a8a49c] font-light leading-relaxed mb-6">
              {selectedPortfolioModal.description}
            </p>

            {/* Key Deliverables */}
            <div className="p-5 rounded-xl bg-[#080808] border border-[#c5a059]/20 mb-6">
              <div className="text-xs font-cinzel uppercase tracking-[0.2em] text-[#c5a059] mb-3">
                PROJECT HIGHLIGHTS & ARCHIVE NOTES
              </div>
              <ul className="space-y-2">
                {selectedPortfolioModal.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-[#f5f2eb] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPortfolioModal(null)}
                className="px-6 py-2.5 rounded-full bg-[#c5a059] text-black text-xs font-cinzel tracking-[0.2em] uppercase font-bold hover:bg-[#e6ca85] transition-colors"
              >
                CLOSE INSPECTION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION: CINEMATIC BRAND FILM                                  */}
      {/* ============================================================== */}
      <section className="relative min-h-[550px] lg:min-h-[650px] flex items-center justify-center overflow-hidden border-t border-b border-[#c5a059]/20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] contrast-[1.2]"
        >
          <source src="/res/img/videopalyback.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/90" />
        <div className="amber-glow-spot top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-[#080808]/60 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
            <span className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059]">
              PHILOSOPHY IN MOTION
            </span>
          </div>

          <h2 className="font-serif-luxury text-4xl sm:text-6xl text-[#f5f2eb] font-light leading-tight">
            “Always On Time. <br />
            <span className="italic text-gold-gradient">Execution Without Compromise.”</span>
          </h2>

          <p className="mt-8 max-w-xl mx-auto text-sm sm:text-base text-[#a8a49c] font-light leading-relaxed">
            Bringing strategy, creativity, technology, and execution together to support the evolving marketing needs of
            Sri Lankan businesses and corporate enterprises.
          </p>

          <div className="mt-10">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3.5 rounded-full border border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-black font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300"
            >
              COMMISSION A CAMPAIGN
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: STRATEGIC REGIONAL OFFICES (From PDF Page 5)          */}
      {/* ============================================================== */}
      <section id="offices" className="py-32 px-6 lg:px-12 relative bg-[#0a0a0d] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059] mb-3">
                ISLAND-WIDE OPERATIONAL NETWORK
              </div>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-light">
                4 Strategic Regional Offices
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#a8a49c] font-light leading-relaxed">
              With our central headquarters in Colombo and regional command bases in Kandy, Anuradhapura, and Polonnaruwa,
              we ensure physical agility and local market mastery.
            </p>
          </div>

          {/* Map + Offices Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Cropped Map of Sri Lanka from Page 5 */}
            <div className="lg:col-span-5 luxury-card rounded-2xl p-6 relative overflow-hidden flex flex-col items-center">
              <div className="text-[10px] font-cinzel tracking-[0.25em] text-[#c5a059] uppercase mb-4 text-center">
                OFFICIAL SRI LANKA FOOTPRINT
              </div>
              <div className="w-full max-w-sm rounded-xl overflow-hidden border border-white/[0.08] bg-black/40">
                <img
                  src="/res/crops/srilanka_offices_map.jpg"
                  alt="I Shop Marketing Regional Offices Map"
                  className="w-full h-auto object-contain filter contrast-[1.05]"
                />
              </div>
              <div className="mt-4 text-center text-[10px] text-[#a8a49c] font-cinzel tracking-wider">
                COLOMBO • KANDY • ANURADHAPURA • POLONNARUWA
              </div>
            </div>

            {/* Right: Office Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {regionalOffices.map((off, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-[#121215] border border-white/[0.07] hover:border-[#c5a059]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[9px] font-cinzel tracking-[0.2em] text-[#c5a059] mb-3">
                      <span>{off.status}</span>
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                    </div>

                    <h3 className="font-serif-luxury text-2xl text-[#f5f2eb] font-normal mb-1">
                      {off.city}
                    </h3>
                    <div className="text-[11px] text-[#c5a059]/80 font-cinzel tracking-wider mb-3">
                      {off.role}
                    </div>

                    <p className="text-xs text-[#a8a49c] font-light leading-relaxed mb-4">
                      {off.address}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] text-[10px] text-[#a8a49c]/70">
                    {off.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: LEADERSHIP & TEAM (User: "team ek thiya gnna")         */}
      {/* ============================================================== */}
      <section id="team" className="py-32 px-6 lg:px-12 relative bg-[#080808] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059] mb-3">
                EXECUTIVE STEWARDSHIP
              </div>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-light">
                Leadership & Operations Team
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#a8a49c] font-light leading-relaxed">
              Experienced directors and marketing practitioners combining enterprise strategic vision with rigorous
              tactical execution.
            </p>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="luxury-card rounded-xl p-6 flex flex-col justify-between group hover:border-[#c5a059]/50 transition-colors"
              >
                <div>
                  {/* Monogram Badge */}
                  <div className="w-14 h-14 rounded-full border border-[#c5a059]/35 bg-[#c5a059]/5 flex items-center justify-center mb-6 group-hover:border-[#c5a059] transition-colors">
                    <span className="font-serif-luxury text-lg text-[#c5a059] italic font-semibold">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                  </div>

                  <span className="text-[9px] font-cinzel uppercase tracking-[0.25em] text-[#c5a059] block mb-1">
                    {member.role}
                  </span>
                  <h3 className="font-serif-luxury text-xl text-[#f5f2eb] font-normal mb-2">
                    {member.name}
                  </h3>
                  <div className="text-[10px] text-[#c5a059]/80 font-cinzel tracking-wider mb-3">
                    {member.domain}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] text-[11px] text-[#a8a49c] font-light leading-relaxed">
                  {member.bio}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: CONTACT & INQUIRY (From PDF Page 16)                  */}
      {/* ============================================================== */}
      <section id="contact" className="py-32 px-6 lg:px-12 relative border-t border-[#c5a059]/20 bg-[#0b0b0e]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: Official Contact Ledger */}
            <div className="lg:col-span-5">
              <div className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-[#c5a059] mb-3">
                OFFICIAL AGENCY INQUIRIES
              </div>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#f5f2eb] font-light leading-tight mb-6">
                Let's Build Your Growth
              </h2>

              <p className="text-sm text-[#a8a49c] font-light leading-relaxed mb-8">
                Connect directly with our Colombo headquarters to discuss strategic marketing consultancy, full brand
                overhauls, or high-yield digital campaign execution.
              </p>

              {/* Verified Details from PDF Page 16 */}
              <div className="space-y-6 border-t border-white/[0.08] pt-8">
                <div>
                  <span className="text-[9px] font-cinzel uppercase tracking-[0.25em] text-[#c5a059] block mb-2">
                    DIRECT VOICE HOTLINE
                  </span>
                  <div className="space-y-1.5 text-sm font-cinzel tracking-wider text-[#f5f2eb]">
                    <div>
                      <a href="tel:0717000779" className="hover:text-[#c5a059] transition-colors font-bold text-base text-[#c5a059]">
                        071 7000 779 <span className="text-[10px] font-normal text-[#a8a49c]">(Official Profile Line)</span>
                      </a>
                    </div>
                    <div>
                      <a href="tel:0773482002" className="hover:text-[#c5a059] transition-colors">
                        +94 77 348 2002
                      </a>
                    </div>
                    <div>
                      <a href="tel:0767772002" className="hover:text-[#c5a059] transition-colors">
                        +94 76 777 2002
                      </a>
                    </div>
                    <div>
                      <a href="tel:0112582002" className="hover:text-[#c5a059] transition-colors">
                        +94 11 258 2002 (Colombo Head Office)
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-cinzel uppercase tracking-[0.25em] text-[#c5a059] block mb-2">
                    ELECTRONIC MAIL DISPATCH
                  </span>
                  <div className="space-y-1 text-sm font-cinzel tracking-wider text-[#f5f2eb]">
                    <div>
                      <a href="mailto:info.ishopmarketing@gmail.com" className="hover:text-[#c5a059] transition-colors text-[#c5a059]">
                        info.ishopmarketing@gmail.com
                      </a>
                    </div>
                    <div>
                      <a href="mailto:info@ishopmarketing.lk" className="hover:text-[#c5a059] transition-colors">
                        info@ishopmarketing.lk
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-cinzel uppercase tracking-[0.25em] text-[#c5a059] block mb-2">
                    OFFICIAL DOMAIN
                  </span>
                  <a
                    href="https://www.ishopmarketing.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-cinzel tracking-wider text-[#f5f2eb] hover:text-[#c5a059] transition-colors"
                  >
                    www.ishopmarketing.com
                  </a>
                </div>

                <div>
                  <span className="text-[9px] font-cinzel uppercase tracking-[0.25em] text-[#c5a059] block mb-2">
                    COLOMBO REGISTERED HEAD OFFICE
                  </span>
                  <p className="text-xs text-[#a8a49c] font-light leading-relaxed">
                    No 33, Collingwood Place, Wellawatta, Colombo 06, Sri Lanka
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Inquiries Form */}
            <div className="lg:col-span-7">
              <div className="luxury-card rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-[#c5a059]/30">
                {submittedForm ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full border border-[#c5a059] mx-auto flex items-center justify-center text-[#c5a059] mb-6 bg-[#c5a059]/10">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif-luxury text-3xl text-[#f5f2eb] font-normal mb-3">
                      Inquiry Successfully Received
                    </h3>
                    <p className="text-sm text-[#a8a49c] font-light max-w-md mx-auto leading-relaxed mb-8">
                      Thank you for contacting I Shop Marketing (Pvt) Ltd. Operating under our “Always On Time”
                      philosophy, our team will review your requirements and respond within one business day.
                    </p>
                    <button
                      onClick={() => setSubmittedForm(false)}
                      className="px-6 py-2.5 rounded-full border border-[#c5a059]/40 text-[#c5a059] text-xs font-cinzel tracking-[0.2em] uppercase hover:bg-[#c5a059]/10 transition-colors"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#c5a059] block mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kasun Perera"
                          className="w-full bg-[#080808]/90 border border-white/[0.1] rounded-lg px-4 py-3 text-xs text-[#f5f2eb] focus:border-[#c5a059] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#c5a059] block mb-2">
                          Company / Brand
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ceylon Holdings"
                          className="w-full bg-[#080808]/90 border border-white/[0.1] rounded-lg px-4 py-3 text-xs text-[#f5f2eb] focus:border-[#c5a059] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#c5a059] block mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="contact@company.lk"
                          className="w-full bg-[#080808]/90 border border-white/[0.1] rounded-lg px-4 py-3 text-xs text-[#f5f2eb] focus:border-[#c5a059] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#c5a059] block mb-2">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="07X XXX XXXX"
                          className="w-full bg-[#080808]/90 border border-white/[0.1] rounded-lg px-4 py-3 text-xs text-[#f5f2eb] focus:border-[#c5a059] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#c5a059] block mb-2">
                        Primary Service Required
                      </label>
                      <select
                        defaultValue="digital"
                        className="w-full bg-[#080808] border border-white/[0.1] rounded-lg px-4 py-3 text-xs text-[#f5f2eb] focus:border-[#c5a059] focus:outline-none transition-colors"
                      >
                        <option value="digital">Digital Marketing Strategy & SEO</option>
                        <option value="social">Social Media Advertising & Management</option>
                        <option value="branding">Branding, Logo & Label Packaging Design</option>
                        <option value="production">Video Production & Live Presenter Reels</option>
                        <option value="activations">Event Marketing & On-Ground Activations</option>
                        <option value="consultancy">Full-Service Comprehensive Agency Retainer</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#c5a059] block mb-2">
                        Project Scope & Goals
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us about your brand, current bottlenecks, target audience, and marketing objectives..."
                        className="w-full bg-[#080808]/90 border border-white/[0.1] rounded-lg px-4 py-3 text-xs text-[#f5f2eb] focus:border-[#c5a059] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-[#c5a059] text-black font-semibold text-xs font-cinzel tracking-[0.25em] uppercase hover:bg-[#e6ca85] transition-all duration-300 shadow-[0_10px_30px_rgba(197,160,89,0.3)] flex items-center justify-center gap-3"
                    >
                      <span>SEND INQUIRY TO ISM</span>
                      <Send className="w-4 h-4" />
                    </button>

                    <div className="text-center text-[9px] font-cinzel tracking-wider text-[#a8a49c]/60">
                      I SHOP MARKETING (PVT) LTD • PHILOSOPHY: ALWAYS ON TIME
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MONUMENTAL ARCHIVAL FOOTER                                     */}
      {/* ============================================================== */}
      <footer className="relative pt-20 pb-14 px-6 lg:px-12 border-t border-white/[0.08] overflow-hidden bg-[#050505]">
        {/* Colombo Skyline Graphic from PDF Page 1 */}
        <div className="max-w-7xl mx-auto mb-12 opacity-25 filter invert">
          <img
            src="/res/crops/colombo_skyline.jpg"
            alt="Colombo Skyline Sri Lanka"
            className="w-full h-auto object-cover max-h-24 mix-blend-screen"
          />
        </div>

        {/* Giant Monolithic Typographic Watermark */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none select-none text-[11vw] font-serif-luxury tracking-[-0.05em] text-white/[0.02] whitespace-nowrap leading-none font-bold">
          I SHOP MARKETING
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-10 border-b border-white/[0.08] gap-8">
            <div className="flex items-center gap-4">
              <img
                src="/res/img/ism-logo-official-white.png"
                alt="iSM"
                className="h-10 w-auto object-contain"
              />
              <div className="border-l border-white/[0.1] pl-4">
                <div className="font-serif-luxury text-lg text-[#f5f2eb]">I SHOP MARKETING (PVT) LTD</div>
                <div className="text-[9px] font-cinzel tracking-[0.25em] text-[#c5a059]">
                  ALWAYS ON TIME • ESTABLISHED 2020
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-cinzel tracking-[0.2em] text-[#a8a49c]">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-[#c5a059] transition-colors"
              >
                BACK TO TOP ↑
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-cinzel tracking-[0.18em] text-[#a8a49c]/60">
            <div>
              © 2020 - {new Date().getFullYear()} I SHOP MARKETING (PVT) LTD. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-5">
              <span>COLOMBO SRI LANKA</span>
              <span>•</span>
              <span>ESTABLISHED 2020</span>
              <span>•</span>
              <span className="text-[#c5a059]">ALWAYS ON TIME</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
