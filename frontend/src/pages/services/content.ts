export type ServiceCategoryId =
  | 'ai_apps_agents'
  | 'saas_products'
  | 'performance_modernization';

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  tagline: string;
  bullets: [string, string, string];
}

export interface ProcessStep {
  number: string;
  title: string;
  duration: string;
  description: string;
}

export interface CaseStudy {
  id: string;
  category: string;
  title: string;
  body: string;
  metrics?: string[];
  href?: string;
  external?: boolean;
  anonymized?: boolean;
}

export interface ProofPoint {
  metric: string;
  description: string;
}

export const HERO = {
  eyebrow: 'Custom Software',
  title: 'Engineering partners for what you ship next.',
  subtitle:
    'AI products, digital platforms and scaling work. Built by a team that ships.',
  primaryCta: { label: 'Get a quote', target: '#contact' },
  secondaryCta: { label: 'See recent work', target: '#recent-work' },
} as const;

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  {
    id: 'ai_apps_agents',
    title: 'AI Products & Automation',
    tagline:
      'AI-powered products and intelligent automation that move real business metrics.',
    bullets: [
      'Customer-facing AI assistants and copilots tailored to your workflows',
      'Smart automation that replaces repetitive work and frees up your team',
      'AI features integrated into your existing product, not bolted on',
    ],
  },
  {
    id: 'saas_products',
    title: 'Web & SaaS Platforms',
    tagline:
      'Web and mobile platforms your customers actually want to use, from concept to launch.',
    bullets: [
      'End-to-end product development, including sign-up, payments, and admin tools',
      'Multi-customer platforms with secure data separation and fast onboarding',
      'Mobile and web apps designed to scale with your business',
    ],
  },
  {
    id: 'performance_modernization',
    title: 'Scale & Update',
    tagline:
      'Make your existing systems faster, more reliable, and ready for what comes next.',
    bullets: [
      'Migrate legacy systems to modern infrastructure without disrupting your business',
      'Speed and reliability improvements with measurable results',
      'Stabilize critical systems that need to stay up as you grow',
    ],
  },
] as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery',
    duration: '1 – 2 weeks',
    description:
      'We map your goals, constraints, and what success looks like. You leave with an idea we structure it to a plan.',
  },
  {
    number: '02',
    title: 'Design',
    duration: '1 – 2 weeks',
    description:
      'We plan the product structure and user experience, then share a working prototype so you can see and feel it before we build.',
  },
  {
    number: '03',
    title: 'Build',
    duration: '4 – 12 weeks',
    description:
      'Weekly demos keep you in the loop. We deliver production ready software, fully tested and documented from day one.',
  },
  {
    number: '04',
    title: 'Launch & Support',
    duration: 'Ongoing',
    description:
      'We handle deployment and monitoring, then hand over cleanly to your team or stay on as your long-term technical partner.',
  },
] as const;

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    id: 'bookeasy',
    category: 'Web & SaaS Platforms',
    title: 'BookEasy — AI booking platform for service businesses',
    body: 'A booking platform built for service-based SMEs, with conversational UI setup and a unified inbox that brings every customer message into one place.',
    metrics: [],
    href: '/',
    external: false,
  },
  {
    id: 'sigil',
    category: 'Web & SaaS Platforms',
    title: 'Sigil — anonymous email forwarding',
    body: 'A privacy product that lets users sign up for services without sharing their real email. Sigil generates anonymous addresses and forwards messages to the user’s inbox.',
    metrics: [],
    href: 'https://sigil-dashboard.vercel.app',
    external: true,
  },
  {
    id: 'mission_critical',
    category: 'Scale & Modernization',
    title: 'AI infrastructure for leading research labs',
    body: 'Large-scale infrastructure work supporting AI training operations across hundreds of contributors. Client details kept confidential under NDA.',
    metrics: [],
    anonymized: true,
  },
] as const;

export const PROOF_POINTS: readonly ProofPoint[] = [
  {
    metric: '50K → 5M users',
    description:
      'Scaled a live sports streaming platform 100x in 12 months, holding steady through peak live events.',
  },
  {
    metric: '$1.2M+ revenue delivered',
    description:
      'Built AI training infrastructure adopted by two leading research labs and used by over 1,000 contributors.',
  },
  {
    metric: 'Enterprise-grade, EU-based',
    description:
      'Delivered a multi-customer SaaS platform for a German enterprise client, with secure data separation and a public-facing portal.',
  },
  {
    metric: '10+ years building software',
    description:
      'Senior engineering experience across AI, large-scale web platforms, and SaaS — covering both product and infrastructure.',
  },
] as const;

export const ABOUT_TEXT = `We take on a small number of engagements each quarter so every client gets our full attention. If you're building something that has to work — an AI product, a new platform, or a system that needs to scale — we'd like to hear about it.`;

export const FOOTER_CTA = {
  title: 'Have a project in mind?',
  body: 'We reply within one business day. No call required to get a quote.',
  cta: { label: 'Get a quote', target: '#contact' },
} as const;

export const BUDGET_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'under_5k', label: 'Under €5k' },
  { value: '5_15k', label: '€5k – €15k' },
  { value: '15_50k', label: '€15k – €50k' },
  { value: '50k_plus', label: '€50k+' },
  { value: 'not_sure', label: 'Not sure yet' },
] as const;