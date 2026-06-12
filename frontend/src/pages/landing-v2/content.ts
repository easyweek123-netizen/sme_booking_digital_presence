import { ROUTES } from '@/config/routes';

export type HeadlinePart = { text: string; accent?: boolean };

export const landingV2Content = {
  hero: {
    eyebrow: 'For independent service professionals',
    headline: [
      { text: 'Drive your booking business with ' },
      { text: 'chat', accent: true },
      // { text: ' with it.' },
    ] as HeadlinePart[],
    subhead:
      'A beautiful booking page, smart scheduling, and a chat agent that helps you from setup to managing your bookings. So you can stay focused on the people you serve, not the system.',
    primaryCta: { label: 'Create your booking page — free', href: ROUTES.ONBOARDING },
    secondaryCta: { label: 'Watch the 90-second tour', anchor: '#video' },
    microTrust: 'Live booking page in under 3 minutes.',
    mockupImage: '/landing-v2/hero-canvas.png',
    floatingBubbles: [
      { text: "I'm off Mondays. Otherwise 13:00–19:00.", position: 'top-left' as const },
      { text: 'Hours set: Tue–Sun, 13:00–19:00 ✓', position: 'right' as const },
    ],
  },
  video: {
    eyebrow: undefined,
    headline: 'See it in action.',
    subhead:
      'Watch how a new studio sets up their booking page, adds services, and takes their first appointment. In under 3 minutes.',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // TODO: real video
    posterImage: '/landing-v2/video-poster.png',
    durationLabel: '90 sec',
    pills: [
      { icon: 'pin',    title: 'Multiple Locations',     sub: "At your place, online or through phone." },
      { icon: 'userIcon', title: 'Appointment', sub: '1:1 · bookable slots'},
      { icon: 'usersIcon',title: 'Event', sub: 'Multiple attendees can book same slot'}
    ],
  },
  audience: {
    headline: 'If you sell your time,\nBookEasy is for you.',
    subhead:
      'Anyone who books appointments and wants their day to feel calmer.',
    chips: [
      'Artists', 'Music teachers', 'Coaches', 'Tutors', 'Therapists',
      'Fitness pros', 'Beauty & wellness', 'Consultants', 'Anyone who books time',
    ],
    highlightedChip: 'Anyone who books time',
  },
  walkthrough: {
    eyebrow: 'What you get',
    headline: 'One AI, four jobs off your plate.',
    rows: [
      { index: '01 / 04', tag: 'AI canvas',           title: 'Set up your business by chatting.',     body: 'No 12 step setup wizard. Tell the AI what you do, and it builds your services, sets your hours, drafts your booking page, and shows you the result live in the preview mode. Change your mind? Just ask.', image: '/landing-v2/walk-canvas.png',    side: 'right' as const },
      { index: '02 / 04', tag: 'Your booking page',   title: 'A page that looks like you spent a week on it.', body: 'Your services, photos, your hours on a mobile-first page customers can book in under 30 seconds. Share the link, print the QR code, or hand them your phone.', image: '/landing-v2/walk-bookpage.png',  side: 'left'  as const },
      { index: '03 / 04', tag: "Scheduling that doesn't get you in trouble", title: 'Never get double booked again.', body: "Two-way Google Calendar sync blocks busy time automatically. Approve, reschedule, or cancel from one place and your clients get the email before you've put your phone down.", image: '/landing-v2/walk-bookings.png', side: 'right' as const },
      { index: '04 / 04', tag: 'One place for everything', title: 'Services, clients, notes, all in one app.', body: 'Track who\'s coming in, who you should follow up with, and what they last booked. Notes stay with the customer so you remember the details that matter, even six months later.', image: '/landing-v2/walk-overview.png', side: 'left'  as const },
    ],
  },
  testimonials: {
    headline: 'Loved by the people\nbooking the work.',
    items: [
      { quote: 'I used to manage bookings through WhatsApp messages. Now clients book themselves and I get email confirmations instantly. Setup took me 3 minutes.', name: 'Lisa M.',   role: 'Massage Therapist, Linz', initials: 'LM' },
      { quote: 'My clients love the booking page — it looks professional and works perfectly on their phones. I just share the QR code in my shop.',                  name: 'Markus W.', role: 'Barber, Vienna',          initials: 'MW' },
      { quote: "I was paying for another booking tool that was way too complicated. BookEasy does exactly what I need — simple, clean, and it's free.",              name: 'Sarah K.',  role: 'Yoga Instructor, Graz',   initials: 'SK' },
    ],
  },
  howItWorks: {
    eyebrow: 'How it works',
    headline: 'Live in four steps.\nChat for suggestions.',
    steps: [
      { n: 1, title: 'Sign up',         body: 'Tell us your business name. 30 seconds, no card.',                                                                  image: '/landing-v2/step-signup.png'  },
      { n: 2, title: 'Set up by chat',  body: 'Describe what you do. The AI builds suggestions for your services, hours, and booking page and you approve.',                       image: '/landing-v2/step-canvas.png'  },
      { n: 3, title: 'Share your link', body: 'Drop your booking link on Instagram/Watsapp, embed the QR code in your studio, or text it to a client.',                    image: '/landing-v2/step-share.png'   },
      { n: 4, title: 'Get bookings',    body: "Get email notifications new bookings and manage your schedule from one place.",               image: '/landing-v2/step-bookings.png'},
    ],
  },
  faq: {
    headline: 'Frequently asked questions',
    subhead: 'Everything you need to know about BookEasy.',
    items: [
      {
        question: 'What does the AI actually do for me?',
        answer:
          'It listens as you describe your business, then drafts your services, pricing, hours, and booking page. Ask any questions about your business or seetings in your app.',
      },
      {
        question: 'Do my clients need to download anything or create an account?',
        answer:
          'No. Clients open your booking link in any browser and confirm with their email. No app install, no account, nothing to remember.',
      },
      {
        question: 'How is this different from others?',
        answer:
          'BookEasy is your booking page plus the admin around it. Services, photos, prices, a public page customers can browse, plus the AI that sets it all up for you.',
      },
      {
        question: 'Can I sync with my Google Calendar?',
        answer:
          'Yes, Google Calendar sync is possible. Busy time blocks your availability automatically, and confirmed bookings appear in your calendar instantly.',
      },
      {
        question: 'Can I use my own domain?',
        answer:
          'Not for now, but if you want this feature you can request it from pricing page.',
      },
      {
        question: 'What kind of business is BookEasy for?',
        answer:
          'Solo and small-team service professionals. Coaches, tutors, therapists, beauty and wellness pros, music teachers, fitness trainers, consultants. If you sell your time, it fits.',
      },
    ],
  },
  startBanner: {
    headline: 'Focus on your clients. Chat with AI to stay up to date.',
    subhead: 'Your booking page is 3 minutes away.',
    cta: { label: 'Create your booking page — free', href: ROUTES.ONBOARDING },
    microTrust: 'No credit card',
  },
} as const;

export type LandingV2Content = typeof landingV2Content;
