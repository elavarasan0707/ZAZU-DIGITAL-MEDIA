import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { Project, ServiceItem, PricingPlan, Testimonial, BlogPost, SiteSettings } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'seo-optimization',
    name: 'Search Engine Optimization (SEO)',
    slug: 'seo',
    icon: 'Search',
    imageUrl: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Dominate search rankings, drive high-intent organic traffic, and secure top spots on Google with technical and on-page mastery.',
    fullDesc: 'Our full-funnel SEO service combines deep technical audits, semantic keyword targeting, high-authority backlink outreach, and content architecture to outrank competitors and capture sustainable organic revenue.',
    deliverables: ['Comprehensive Technical SEO Audit', 'Keyword & Competitor Strategy', 'On-Page Optimization & Schema', 'High-Authority Backlink Acquisition', 'Monthly KPI & Ranking Reports'],
    order: 1,
    active: true,
  },
  {
    id: 'social-media-marketing',
    name: 'Social Media Marketing',
    slug: 'social-media-marketing',
    icon: 'Share2',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'High-converting paid social campaigns across Instagram, Facebook, and LinkedIn engineered for maximal return on ad spend (ROAS).',
    fullDesc: 'We craft viral hooks, thumb-stopping creatives, and granular algorithmic audience targeting to turn scrolling audiences into paying loyal customers.',
    deliverables: ['Custom Audience Segmentation', 'High-converting Ad Creatives', 'A/B Split Copy Testing', 'Pixel & CAPI Tracking Setup', 'ROAS Optimization & Weekly Sprints'],
    order: 2,
    active: true,
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    slug: 'social-media-management',
    icon: 'Instagram',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'End-to-end community building, aesthetic grid curation, reels production, and daily audience engagement for brand authority.',
    fullDesc: 'Build an enviable social presence. We handle editorial calendars, short-form video scripting, graphic design, caption copywriting, and real-time community engagement.',
    deliverables: ['Monthly Content Calendar', '15-30 Custom Visual Posts/Reels', 'Community & DM Management', 'Hashtag & Trend Optimization', 'Engagement & Growth Analytics'],
    order: 3,
    active: true,
  },
  {
    id: 'content-marketing',
    name: 'Content Marketing',
    slug: 'content-marketing',
    icon: 'FileText',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Compelling storytelling, thought leadership articles, and lead-nurturing assets that position your brand as the industry leader.',
    fullDesc: 'Great content builds trust before the sale. We create high-authority articles, downloadable lead magnets, case studies, and email sequences that educate, persuade, and convert.',
    deliverables: ['Authority Blog Articles', 'Ebooks & Whitepapers', 'Email Newsletters & Drips', 'Case Study Storytelling', 'Content Repurposing Framework'],
    order: 4,
    active: true,
  },
  {
    id: 'google-ads-ppc',
    name: 'Google Ads / PPC',
    slug: 'google-ads-ppc',
    icon: 'Target',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'High-intent search ads, Performance Max campaigns, and YouTube video ads engineered to capture buyers at peak purchase intent.',
    fullDesc: 'Capture prospective customers actively searching for your solutions. We eliminate wasted ad spend through negative keyword sculpting, precise bid management, and conversion-optimized landing pages.',
    deliverables: ['Google Search & Shopping Ads', 'Performance Max (PMax) Campaigns', 'Negative Keyword Sculpting', 'Conversion Tracking Calibration', 'Real-time Budget Optimization'],
    order: 5,
    active: true,
  },
  {
    id: 'branding-identity',
    name: 'Branding & Visual Identity',
    slug: 'branding',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Memorable brand identity systems, custom iconography, typography guidelines, and brand narratives that command industry prestige.',
    fullDesc: 'Your brand is your greatest asset. We engineer memorable identities with custom logo systems, color theory palettes, typographic rules, and comprehensive brand books that resonate deeply.',
    deliverables: ['Logo System & Mark Variations', 'Color Palette & Typography System', 'Complete Brand Style Guidelines', 'Brand Voice & Messaging Manifesto', 'Stationery & Digital Assets Kit'],
    order: 6,
    active: true,
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    slug: 'graphic-design',
    icon: 'Palette',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Bespoke marketing collateral, pitch decks, ad creatives, packaging, and digital banners that captivate attention.',
    fullDesc: 'Visual elegance meets marketing psychology. Our graphic designers craft pixel-perfect assets tailored to modern consumer aesthetics and brand guidelines.',
    deliverables: ['Social Media Post Kits', 'Pitch Decks & Presentations', 'Marketing Banners & Brochures', 'Packaging & Merch Design', 'Vector Illustration & Assets'],
    order: 7,
    active: true,
  },
  {
    id: 'website-development',
    name: 'Website Development',
    slug: 'website-development',
    icon: 'Code2',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Blazing fast, ultra-responsive modern websites engineered for seamless user experience and maximum conversion rates.',
    fullDesc: 'We build lightning-fast, mobile-first websites with sleek interactions, flawless SEO architecture, and intuitive content management to turn visitors into buyers.',
    deliverables: ['Custom Next.js/React Architecture', 'Responsive Mobile-First UI/UX', 'Conversion-Optimized Funnels', 'Technical SEO & Speed Score 95+', 'Analytics & CRM Integrations'],
    order: 8,
    active: true,
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    slug: 'lead-generation',
    icon: 'Zap',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Predictable B2B & B2C pipeline development combining cold outreach, interactive funnels, and automated qualification.',
    fullDesc: 'Fill your sales pipeline with qualified decision-makers. We build multi-channel lead funnels, automated follow-up sequences, and booking systems that deliver high-intent sales calls.',
    deliverables: ['Outbound Lead Prospecting', 'Lead Magnet Funnel Architecture', 'Automated Email Nurture Flows', 'Calendar Booking Integration', 'Lead Qualification Workflows'],
    order: 9,
    active: true,
  },
  {
    id: 'digital-marketing-strategy',
    name: 'Digital Marketing Strategy',
    slug: 'digital-marketing-strategy',
    icon: 'Compass',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Holistic 360° growth roadmaps tailored to your industry, budget, market gaps, and revenue goals.',
    fullDesc: 'Stop guessing what marketing works. We analyze your customer journey, competitive landscape, and unit economics to architect a foolproof omnichannel growth blueprint.',
    deliverables: ['Comprehensive Market & Competitor Audit', 'Customer Persona & Journey Mapping', 'Omnichannel Channel Prioritization', 'Unit Economics & ROI Modeling', 'Quarterly Growth Sprints'],
    order: 10,
    active: true,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'fintech-saas-scale',
    title: 'FinTech SaaS Scale: 420% Organic Traffic Surge',
    clientName: 'NovaPay Global',
    category: 'SEO',
    service: 'Search Engine Optimization (SEO)',
    description: 'Executed technical overhaul, programmatic SEO landing pages, and authority pillar pages for an enterprise B2B payments platform, scaling organic keyword rankings from page 5 to position #1.',
    results: 'Scaled organic search revenue from $45k/mo to $230k/mo within 7 months.',
    metrics: '+420% Organic Traffic | #1 Google Rankings for 34 High-Intent Keywords | 3.8x Pipeline Growth',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: ['SEO', 'B2B SaaS', 'Technical Audit', 'Content Architecture'],
    featured: true,
  },
  {
    id: 'luxury-fashion-roas',
    title: 'Luxury Streetwear Brand: 6.8x ROAS on Meta & TikTok',
    clientName: 'Aethel Clothing',
    category: 'Social Media',
    service: 'Social Media Marketing',
    description: 'Transformed an emerging apparel brand with cinematic short-form video ads, dynamic product catalogs, and retargeting funnels across Instagram and TikTok.',
    results: 'Generated over $1.2M in sales in Q4 with a consistent 6.8x Return on Ad Spend.',
    metrics: '6.8x ROAS | $1.2M+ Revenue | 48,000 New Customer Acquisitions',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Meta Ads', 'TikTok Ads', 'E-commerce', 'Creative Production'],
    featured: true,
  },
  {
    id: 'healthcare-lead-engine',
    title: 'Private Healthcare Network: 850+ Monthly Patient Bookings',
    clientName: 'Apex Medical Clinics',
    category: 'PPC & Ads',
    service: 'Google Ads / PPC',
    description: 'Designed hyper-localized Google Search & Performance Max campaigns with click-to-call extensions and responsive appointment booking pages.',
    results: 'Cut cost per acquisition (CPA) by 54% while tripling qualified consultation bookings.',
    metrics: '-54% CPA | 850+ Monthly Bookings | 99.4% Impression Share on Core Services',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Google Ads', 'Local PPC', 'Conversion Rate Optimization', 'Healthcare'],
    featured: true,
  },
  {
    id: 'eco-lifestyle-rebrand',
    title: 'Sustainable Home Goods: Complete Identity & Brand System',
    clientName: 'Verdant Earth Living',
    category: 'Branding',
    service: 'Branding & Visual Identity',
    description: 'Crafted full brand identity system including 3D logo guidelines, sustainable packaging design, custom typography, and aesthetic social media templates.',
    results: 'Brand recognition increased 300% leading to direct wholesale partnerships with national retailers.',
    metrics: '+300% Brand Recall | Featured in Vogue & Dwell | National Retail Placement',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
    tags: ['Branding', 'Packaging', 'Visual Identity', '3D Design'],
    featured: true,
  },
  {
    id: 'b2b-consulting-portal',
    title: 'Global Management Consulting: Headless Web Platform',
    clientName: 'Vanguard Strategy Partners',
    category: 'Web Development',
    service: 'Website Development',
    description: 'Engineered an ultra-fast, modern website with seamless motion design, case study interactive filters, and CRM lead capture.',
    results: 'Page speed benchmark reached 99 on Google Lighthouse, and bounce rate dropped by 42%.',
    metrics: '99/100 Lighthouse Speed | -42% Bounce Rate | +165% Inbound Form Inquiries',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Web Development', 'React', 'Tailwind CSS', 'High Performance'],
    featured: false,
  },
  {
    id: 'edtech-omnichannel-growth',
    title: 'EdTech Academy: Omnichannel Digital Strategy Blueprint',
    clientName: 'SkillForge Institute',
    category: 'Strategy',
    service: 'Digital Marketing Strategy',
    description: 'Developed and executed an omnichannel growth model integrating YouTube thought leadership, email sequences, and high-converting webinars.',
    results: 'Enrolled 12,000+ students in 9 months with an annual recurring revenue increase of 280%.',
    metrics: '+280% Annual Revenue | 12,000+ Students Enrolled | 32% Lead-to-Enrollment Rate',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Marketing Strategy', 'Funnel Design', 'Email Automation', 'Webinars'],
    featured: false,
  },
];

export const INITIAL_PRICING: PricingPlan[] = [
  {
    id: 'starter-growth',
    name: 'Growth Catalyst',
    planType: 'Small Businesses & Startups',
    price: '$1,299',
    billingPeriod: '/month',
    description: 'Ideal for emerging businesses seeking to establish a dominant online presence, drive steady leads, and elevate brand authority.',
    features: [
      'Comprehensive SEO Optimization (15 Keywords)',
      'Social Media Management (12 Custom Posts/Mo)',
      'Meta Ad Campaign Setup & Optimization',
      'Targeted Lead Generation Funnel',
      'Monthly Performance & Analytics Dashboard',
      'Dedicated Account Strategist',
      'Email & WhatsApp Support',
    ],
    popular: false,
    order: 1,
  },
  {
    id: 'business-scale',
    name: 'Market Leader',
    planType: 'Scaling Companies & Brands',
    price: '$2,799',
    billingPeriod: '/month',
    description: 'Our flagship accelerator package designed for brands ready to outpace competitors and aggressively scale revenue across multiple channels.',
    features: [
      'Full-Funnel SEO & Competitor Conquesting (40 Keywords)',
      'Social Media Management (24 Posts & Reels/Mo)',
      'Omnichannel Paid Ads (Google Ads + Meta + LinkedIn)',
      'High-converting Landing Page Design & CRO',
      'Content Marketing (4 Long-form Authority Articles)',
      'Bi-Weekly Strategy Sprints & Live Reporting',
      'Direct WhatsApp VIP Access & Dedicated Growth Team',
      'Lead Qualification & CRM Integration',
    ],
    popular: true,
    order: 2,
  },
  {
    id: 'enterprise-dominance',
    name: 'Enterprise Apex',
    planType: 'Established Enterprises & Global Brands',
    price: '$5,499',
    billingPeriod: '/month',
    description: 'Bespoke, end-to-end digital dominance for market leaders demanding aggressive market share expansion and bespoke creative engineering.',
    features: [
      'Unlimited SEO Scope & Technical Architecture',
      'Daily Multi-Platform Social Media & Influencer Outreach',
      'Enterprise PPC & YouTube Brand Campaigns (Up to $100k Spend)',
      'Complete Branding, Video Production & 3D Assets',
      'Custom Web App / High-Performance Website Support',
      'Weekly Executive Sprints & Custom BI Dashboards',
      '24/7 Dedicated Account Director & Media Buyers',
      'Guaranteed SLA & ROI Benchmark Milestones',
    ],
    popular: false,
    isCustom: true,
    order: 3,
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Arjun Venkatesh',
    clientRole: 'Founder & CEO',
    company: 'NovaPay Global',
    content: 'ZaZu Digital Media completely redefined how our FinTech brand acquires customers. Their SEO and paid ads strategy unlocked a 420% organic traffic surge and lowered our customer acquisition costs dramatically. Truly a world-class digital partner.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    featured: true,
  },
  {
    id: 'test-2',
    clientName: 'Sophia Montgomery',
    clientRole: 'Head of Marketing',
    company: 'Aethel Streetwear',
    content: 'The 3D branding and social media marketing campaigns created by ZaZu are extraordinary. They achieved a 6.8x ROAS within our first 90 days. Their communication on WhatsApp and transparent reporting gave us total confidence.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    featured: true,
  },
  {
    id: 'test-3',
    clientName: 'Dr. Rajesh Pillai',
    clientRole: 'Managing Director',
    company: 'Apex Health Network',
    content: 'We needed a reliable partner to fill our clinics with high-intent patient bookings. ZaZu delivered 850+ confirmed bookings monthly with precision Google Ads and conversion-optimized landing pages. Unbeatable ROI.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    featured: true,
  },
  {
    id: 'test-4',
    clientName: 'Elena Rostova',
    clientRole: 'Chief Executive',
    company: 'Verdant Home Living',
    content: 'From the aesthetic identity to social management, ZaZu is pure brilliance. Their attention to detail and ability to craft compelling brand narratives elevated our brand into luxury department stores within six months.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    featured: true,
  },
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'google-core-algorithm-seo-2026',
    title: 'Mastering Search in 2026: Why Semantic Depth Outranks Keyword Stuffing',
    slug: 'mastering-search-2026-semantic-depth',
    excerpt: 'Modern search algorithms prioritize user satisfaction and conversational semantic depth over archaic keyword density. Here is how modern brands dominate rankings.',
    content: `Search Engine Optimization in 2026 has evolved beyond backlink spam and keyword stuffing. Today's search engines utilize contextual semantic models that evaluate content depth, genuine user experience, and real author credibility.

### 1. Topic Clusters Over Isolated Keywords
Rather than writing ten disconnected articles on superficial search terms, winning brands architect holistic topic clusters. A central pillar piece anchors the domain authority, flanked by sub-topic articles answering hyper-specific user intents.

### 2. Technical Performance as an Uncompromising Foundation
Core Web Vitals are now a non-negotiable prerequisite. If your page takes longer than 1.8 seconds to render or shifts layout unexpectedly, your bounce rate surges and search engines downgrade your visibility.

### 3. Demonstrating Genuine First-Hand Value
Search engines reward authentic case studies, unique metrics, and actionable workflows that automated scrapers cannot fabricate. Providing real data and proprietary takeaways is the ultimate SEO moat.`,
    coverImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
    authorName: 'ZaZu Strategy Team',
    authorRole: 'Senior Growth Strategists',
    category: 'SEO & Organic Growth',
    readTime: '6 min read',
    published: true,
    publishedAt: '2026-09-15',
  },
  {
    id: 'social-media-roas-playbook',
    title: 'The High-ROAS Social Ads Blueprint: Creative Testing at Scale',
    slug: 'high-roas-social-ads-blueprint',
    excerpt: 'Targeting alone will not save mediocre ads. Discover our creative testing framework that consistently delivers 5x+ ROAS on Meta and TikTok.',
    content: `Algorithmic ad delivery on platforms like Meta, Instagram, and TikTok has fundamentally shifted: creative *is* the new targeting. The algorithm categorizes your creative hooks and distributes your ads to the audiences most likely to resonate with that specific visual message.

### 1. The 3-Second Hook Rule
Over 80% of users scroll past ads within the first two seconds. Your visual opening hook must break the scroll through pattern interruption, bold typography, or compelling problem agitation.

### 2. Rapid Creative Iteration Framework
Instead of launching one ad and waiting, we test 5 distinct hooks against 3 body copy angles and 2 calls-to-action simultaneously. Within 72 hours, the data reveals the runaway winner.

### 3. Dynamic Retargeting with Social Proof
Cold traffic rarely buys on the first touchpoint. Layering sequential retargeting featuring customer reviews, press mentions, and founder stories bridges the gap between interest and transaction.`,
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    authorName: 'ZaZu Creative Lab',
    authorRole: 'Creative Director',
    category: 'Paid Social Ads',
    readTime: '5 min read',
    published: true,
    publishedAt: '2026-09-20',
  },
  {
    id: 'b2b-lead-generation-conversion',
    title: 'How High-Growth B2B Brands Build Predictable Inbound Pipelines',
    slug: 'b2b-lead-generation-pipeline',
    excerpt: 'Cold emailing without warm brand equity is burning out. Learn how combining authority content with precision PPC drives pre-sold sales conversations.',
    content: `The B2B buying journey has changed. Modern B2B buyers complete nearly 70% of their research before ever speaking to a sales representative. If your brand is not educating them during that research phase, your competitors are.

### 1. Precision Account-Based Intent Capture
By capturing high-intent search queries and deploying retargeting across LinkedIn and Google, you remain omnipresent throughout the decision-maker's buying evaluation.

### 2. High-Value Frictionless Lead Magnets
Gating generic PDFs is obsolete. Deliver interactive calculators, benchmark audits, and tactical templates that deliver immediate value and prove your technical mastery.

### 3. Instant Automated Qualification & Scheduling
Don't make prospects wait 48 hours for a reply. Modern web funnels enable pre-qualified leads to instantly select an available slot on your strategy calendar, shortening the sales cycle by 70%.`,
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    authorName: 'ZaZu Strategy Team',
    authorRole: 'Managing Director',
    category: 'Lead Generation',
    readTime: '7 min read',
    published: true,
    publishedAt: '2026-09-22',
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  id: 'global-settings',
  email: 'digitalmediazazu@gmail.com',
  phone: '+91 97895 04702',
  whatsapp: '+91 97895 04702',
  instagram: 'https://www.instagram.com/zazudigitalmedia/',
  linkedin: 'https://www.linkedin.com/company/zazu-digital-media/',
  address: 'Chennai & Global Digital Office, India',
};

// Seed function to populate Firestore if collections are empty or forced
export async function seedInitialDataIfEmpty(forceOverwrite = false) {
  try {
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (servicesSnap.empty || forceOverwrite) {
      console.log('Seeding initial agency services...');
      const batch = writeBatch(db);
      INITIAL_SERVICES.forEach((service) => {
        batch.set(doc(db, 'services', service.id), service);
      });
      INITIAL_PROJECTS.forEach((project) => {
        batch.set(doc(db, 'projects', project.id), project);
      });
      INITIAL_PRICING.forEach((plan) => {
        batch.set(doc(db, 'pricing', plan.id), plan);
      });
      INITIAL_TESTIMONIALS.forEach((test) => {
        batch.set(doc(db, 'testimonials', test.id), test);
      });
      INITIAL_BLOGS.forEach((post) => {
        batch.set(doc(db, 'blogPosts', post.id), post);
      });
      batch.set(doc(db, 'settings', INITIAL_SETTINGS.id), INITIAL_SETTINGS);
      await batch.commit();
      console.log('Initial agency collections successfully seeded to Firestore!');
    }
  } catch (error) {
    console.warn('Seeding check completed (or restricted by rules for current auth):', error);
  }
}
