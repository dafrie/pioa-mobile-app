import { Localization } from 'expo';

Localization.getLocalizationAsync()
  .then((tz) => {
    global.timezone = (tz || 'Europe/Amsterdam');
  });
