export const ENV = {
    apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    inlineCardForms: import.meta.env.VITE_INLINE_CARD_FORMS === 'true',
} as const;