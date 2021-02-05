import React from 'react';
import { StyleSheet, View, NetInfo } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { AppLoading, Font } from 'expo';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'core-js';
import Sentry from 'sentry-expo';

import { ApolloProvider } from 'react-apollo';

import './src/global';
import { store, persistor } from './src/store';
import Router from './src/Router';
import i18n from './src/i18n';
import client from './src/client';
import WarningBox from './src/components/WarningBox';
import StatusBar from './src/components/StatusBar.js';
import { syncData } from './src/utils/backgroundJob';
import Spinner from './src/components/Spinner.js';
import NavigationService from './src/utils/NavigationService';

// Call sync data if connection status changes
NetInfo.addEventListener('connectionChange', syncData);

// Remove this once Sentry is correctly setup.
// Sentry.enableInExpoDevelopment = true;

Sentry.config('https://deb2042cdcc0405f8fe3c249a786502a@sentry.io/1380668').install();

/*
const renderStatusBar = () => {
  const state = store.getState();
  if (state.auth.user) {
    return (
        <StatusBar />
    );
  } return null;
};

// Wrap router with translation hoc asserts rerendering on language change
const WrappedRouter = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.container}>
          <Router screenProps={{ t: i18n.getFixedT() }} />
          {renderStatusBar()}
        </SafeAreaView>
      </PersistGate>
  </Provider>
  );
};

// Wrap router with translation hoc asserts rerendering on language change
const ReloadAppOnLanguageChange = translate('translation', {
  bindI18n: 'languageChanged',
  bindStore: false
})(WrappedRouter);
*/
const AppContainer = createAppContainer(Router);

export default class App extends React.Component {
  state = { fontLoaded: false };

  async componentDidMount() {
    await Font.loadAsync({ fontello: require('./assets/static/fonts/fontello.ttf') });
    this.setState({ fontLoaded: true });

    /*
    const unsubscribe = store.subscribe(this.handleLogout);

    // Setup listener for case when app is already opened
    Linking.addEventListener('url', this._handleRedirect);

    // Setup promise for when app is opened from closed state by link
    const url = await Linking.getInitialURL();
    const { path, queryParams } = Linking.parse(url);
    if (path === 'reset-password' && queryParams.token) {
      NavigationService.navigate('PasswordReset', { token: queryParams.token });
    }
    */
  }

  /*
  _handleRedirect = event => {
    const { path, queryParams } = Linking.parse(event.url);
    if (path === 'reset-password') {
      NavigationService.navigate('PasswordReset', { token: queryParams.token });
    }
  };
  */

  render() {
    const { fontLoaded } = this.state;
    if (!fontLoaded) {
      return <AppLoading />;
    }
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <View style={styles.container}>
              <Spinner />
              <AppContainer
                screenProps={{ t: i18n.getFixedT() }}
                ref={navigatorRef => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}
              />
              <WarningBox />
              <StatusBar />
            </View>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    );
    //return <ReloadAppOnLanguageChange />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
