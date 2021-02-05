import FSStorage, { DocumentDir } from 'redux-persist-expo-fs-storage';

//hack: https://github.com/rt2zz/redux-persist/issues/717
export const persistConfig = {
    key: 'root',
    storage: FSStorage(DocumentDir, 'pioa-app'),
    timeout: 0, // The code base checks for falsy, so 0 disables
    whitelist: ['auth', 'settings', 'orm', 'uiPatients', 'syncQueue', 'questionnaires'],
};
