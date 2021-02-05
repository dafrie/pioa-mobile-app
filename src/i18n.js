import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import { Localization } from 'expo-localization';

import ENV from './environment';
import { EN, DE, FR } from './translations';

const debug = ENV.debugLevel === 1;

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => {
    return /*'en'; */ Localization.locale
      // .then(lng => { callback(lng.replace('_', '-')); });
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  // .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',

    resources: {
      en: EN,
      de: DE,
    },
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    debug,

    // cache: {
    //   enabled: true
    // },

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    }
  });

export default i18n;
