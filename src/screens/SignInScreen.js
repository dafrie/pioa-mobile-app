import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Keyboard, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, Linking } from 'react-native';
import { Constants, WebBrowser, AuthSession } from 'expo';
import { connect } from 'react-redux';
import { Icon, Card, Input, Divider } from 'react-native-elements';
import { withNamespaces } from 'react-i18next';
import axios from 'axios';

import { getTypedIonIcon } from '../utils/getPlatformIcons';
import * as actions from '../actions';
import { uuidv4 } from '../utils/uuid';

import ENV from '../environment';

const {
    primaryColor,
    primaryLightColor,
    secondaryColor,
    errorColor,
    transparentPrimaryColor,
    textPrimaryColor,
    textSecondaryColor,
} = Constants.manifest.extra;

class SignInScreen extends Component {
    static navigationOptions = {
        gesturesEnabled: false,
    };

    onAuthComplete = idToken => {
        const { navigation, greeted } = this.props;
        const { navigate } = navigation;
        if (idToken) {
            if (!greeted) {
                navigate('Welcome');
            } else {
                navigate('App');
            }
        }
    };

    /**
     * https://auth0.com/docs/tokens/refresh-token/current
     */
    loginWithAuth0 = async () => {
        try {
            const { loginUserSuccess } = this.props;

            /**
            There are 3 token types: Access token, refresh token and Id token. 
            -   Access token: Short lived, used to access api's (NOT used with hasura, as it has no claims!)
            -   ID token: Contains JWT with claims. Short-medium lived, as we cannot block this!
            -   Refresh token: Has no expiry, but can be revocated on the backend. Used to refresh Access + ID tokens! Can only be used on native apps etc!
            
            Auth0 actually doesn't return a refresh token (but we could get an ID token if the response_type is set accordingly) via the "authorize" endpoint, but they return a code which you have to use then.
            */

            // Use Expo AuthSession to handle callbacks
            const redirectUrl = AuthSession.getRedirectUrl();
            const nonce = uuidv4(); // Set nonce, used to mitigate reply attacks
            const authUrl =
                `${ENV.auth0Domain}/authorize` +
                '?response_type=code' +
                `&client_id=${ENV.auth0ClientId}` +
                '&scope=openid+offline_access+email' +
                `&redirect_uri=${redirectUrl}` +
                `&nonce=${nonce}` +
                '&prompt=login'; // TODO: Actually this should not be necessary, as we should properly clear the Auth0Session...
            const result = await AuthSession.startAsync({
                authUrl,
            });
            if (result.type === 'success') {
                const code = result.params.code;

                // As stated above, now use the code to get back the actual refresh token
                const data = {
                    grant_type: 'authorization_code',
                    client_id: ENV.auth0ClientId,
                    code,
                    redirect_uri: redirectUrl,
                };
                const config = { headers: { 'content-type': 'application/json' } };
                const response = await axios.post(`${ENV.auth0Domain}/oauth/token`, data, config);

                // Read tokens...
                const { refresh_token: refreshToken, id_token: idToken } = response.data;

                loginUserSuccess({ refreshToken, idToken });
                this.onAuthComplete(idToken);
            }
        } catch (e) {
            console.log('Error happened while signing in!');
            console.log(e);
            throw new Error(e);
            // TODO: Error handling - Show error message?
        }
    };

    render() {
        const { t, navigation } = this.props;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.containerStyles}>
                    <KeyboardAvoidingView behavior="padding" style={styles.form}>
                        <Card title={t('auth:header')}>
                            <Text h2>{t('auth:auth0Explanation')}</Text>
                            <TouchableHighlight onPress={this.loginWithAuth0} style={styles.buttonContainerStyles} underlayColor="white">
                                <View style={styles.buttonStyles}>
                                    <Text style={styles.buttonTitleStyles}>{t('auth:loginAuth0')}</Text>
                                    <Icon
                                        name={getTypedIonIcon('log-in')}
                                        type="ionicon"
                                        size={28}
                                        color={textPrimaryColor}
                                        containerStyle={styles.iconContainerStyles}
                                    />
                                </View>
                            </TouchableHighlight>

                            <Divider style={styles.dividerStyles} />

                            <Text
                                style={styles.helpTextStyles}
                                onPress={() => {
                                    return Linking.openURL(
                                        `mailto:pioa.app@gmail.com?subject=${t('auth:helpMailSubject')}&body=${t('auth:helpMailBody')}`
                                    );
                                }}
                            >
                                {t('auth:help')}
                            </Text>
                            <Text
                                style={styles.helpTextStyles}
                                onPress={() => {
                                    return WebBrowser.openBrowserAsync(`${ENV.dashboardUrl}/privacy`);
                                }}
                            >
                                {t('auth:privacyPolicy')}
                            </Text>
                        </Card>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    containerStyles: {
        flex: 1,
        backgroundColor: primaryLightColor,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        padding: 5,
    },
    buttonStyles: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitleStyles: {
        fontSize: 20,
        color: textPrimaryColor,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainerStyles: {
        width: '100%',
        backgroundColor: primaryColor,
        paddingVertical: 10,
        marginVertical: 20,
    },
    errorStyles: {
        color: 'orange',
        paddingTop: 6,
        paddingHorizontal: 6,
        margin: 0,
    },
    helpTextStyles: {
        padding: 10,
        fontStyle: 'italic',
    },
    iconContainerStyles: {
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
        top: 2,
    },
});

function mapStateToProps({ auth }) {
    const { user, emailValue, passwordValue, error, greeted } = auth;
    return { user, emailValue, passwordValue, error, greeted };
}

export default withNamespaces(['auth', 'common'], { wait: true })(
    connect(
        mapStateToProps,
        actions
    )(SignInScreen)
);
