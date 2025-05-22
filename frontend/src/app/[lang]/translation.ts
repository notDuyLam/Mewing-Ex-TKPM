 
const translation = {
  en: () => import('./locales/en/translation.json').then((module) => module.default),
  vi: () => import('./locales/vi/translation.json').then((module) => module.default),
}
 
export const getTranslation = async (locale: 'en' | 'vi') =>
  translation[locale]()