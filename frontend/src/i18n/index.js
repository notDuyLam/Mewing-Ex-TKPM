import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './settings';

i18n
  .use(initReactI18next)
  .use(resourcesToBackend((lang, ns) =>
    import(`../public/locales/${lang}/${ns}.json`)
  ))
  .init({
    ...getOptions(),
    lng: 'vi',
    fallbackLng: 'en',
  });

export default i18n;
