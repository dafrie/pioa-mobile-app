import { Constants, WebBrowser } from 'expo';
import React from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Button, Text, Divider, Icon, Avatar } from 'react-native-elements';
import { withNamespaces } from 'react-i18next';
import client from '../client';

import * as actions from '../actions';
import { getTypedIonIcon } from '../utils/getPlatformIcons';
import SettingsSwitch from './SettingsSwitch';
import { questionnaireSelector } from '../selectors';
import { TRIGGER_PASSWORD_RESET } from '../queries/user';

const { primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor } = Constants.manifest.extra;

import ENV from '../environment';

class Drawer extends React.Component {
    onShowWelcomePress = () => {
        this.props.navigation.navigate('Welcome');
    };

    async onLogout() {
        await this.props.logoutUser(this.props.auth.user);
        this.props.navigation.navigate('Auth');
    }

    onChangePasswordPress = async () => {
        const { t } = this.props;
        const { email } = this.props.auth.user;
        const response = await client.mutate({
            mutation: TRIGGER_PASSWORD_RESET,
            variables: {
                email,
            },
        });
        Alert.alert(t('drawer:passwordResetTitle'), t('drawer:passwordResetBody'));
    };

    onPurgePress = () => {
        const { t } = this.props;
        Alert.alert(
            t('drawer:confirmPurgeDataTitle'),
            t('drawer:confirmPurgeDataBody'),
            [
                {
                    text: t('common:cancel'),
                    onPress: () => {
                        return null;
                    },
                    style: 'cancel',
                },
                {
                    text: t('common:ok'),
                    onPress: () => {
                        return this.onPurgeConfirm();
                    },
                },
            ],
            {
                onDismiss: () => {
                    return null;
                },
            }
        );
    };

    onPurgeConfirm = () => {
        this.props.purgeState();
        this.props.logoutUser();
        this.forceUpdate(); // HACK: temporary solution. should actually rerender. why not?
    };

    onClearQueuePress = () => {
        const { t } = this.props;
        Alert.alert(
            t('drawer:confirmClearQueueTitle'),
            t('drawer:confirmClearQueueBody'),
            [
                {
                    text: t('common:cancel'),
                    onPress: () => {
                        return null;
                    },
                    style: 'cancel',
                },
                {
                    text: t('common:ok'),
                    onPress: () => {
                        return this.onClearQueueConfirm();
                    },
                },
            ],
            //{ cancelable: false }
            {
                onDismiss: () => {
                    return null;
                },
            }
        );
    };

    onClearQueueConfirm = () => {
        this.props.clearQueue();
    };

    getVersionOfQuestionnaires = () => {
        const elements = [];
        for (const [index, object] of this.props.questionnaires.entries()) {
            elements.push(
                <View key={index}>
                    <Text>
                        {object.type} v{object.version}
                    </Text>
                </View>
            );
        }

        return elements;
    };

    render() {
        const { navigation, t, updateSettings } = this.props;
        const { firstName = null, lastName = null, email = null } = this.props.auth.user || {};
        const {
            lang,
            dateFormat,
            autoSync,
            autoSyncMode,
            syncAttachments,
            syncComments,
            useCellular,
            useExpensiveConnection,
            showStatusBar,
            syncSwitch,
        } = this.props.settings;
        return (
            <View style={styles.containerStyles}>
                <View style={styles.headerContainerStyles}>
                    <View style={{}}>
                        <Text h4 style={styles.headerTextStyles}>
                            {firstName || 'User'} {lastName || ''}
                        </Text>
                        <Text style={styles.headerTextStyles}>{email}</Text>
                        <Button
                            title={t('drawer:logout')}
                            icon={<Icon name={getTypedIonIcon('log-out')} type="ionicon" color={textPrimaryColor} />}
                            iconRight
                            buttonStyle={styles.logoutButtonStyle}
                            containerStyle={{ marginTop: 20 }}
                            onPress={this.onLogout.bind(this)}
                        />

                        <Button
                            title={t('drawer:changePassword')}
                            icon={<Icon name={getTypedIonIcon('contact')} type="ionicon" color={textPrimaryColor} />}
                            iconRight
                            buttonStyle={styles.logoutButtonStyle}
                            containerStyle={{ marginTop: 20 }}
                            onPress={this.onChangePasswordPress}
                        />
                        <Button
                            title={t('drawer:showWelcomeScreen')}
                            icon={<Icon name={getTypedIonIcon('bulb')} type="ionicon" color={textPrimaryColor} />}
                            iconRight
                            buttonStyle={styles.logoutButtonStyle}
                            containerStyle={{ marginTop: 20 }}
                            onPress={this.onShowWelcomePress}
                        />
                    </View>
                </View>

                <Divider />

                <ScrollView style={styles.containerStyles}>
                    <View style={styles.settingsHeaderStyles}>
                        <Text h3 style={styles.headerTextStyles}>
                            {t('drawer:settingsTitle')}
                        </Text>
                    </View>
                    <View style={styles.settingsHeaderStyles}>
                        <View style={styles.headerStyles}>
                            <SettingsSwitch
                                value={showStatusBar}
                                label={t('drawer:showStatusBar')}
                                onValueChange={value => {
                                    return updateSettings({ setting: 'showStatusBar', value });
                                }}
                            />

                            <SettingsSwitch
                                value={syncSwitch}
                                label={t('drawer:syncSwitch')}
                                onValueChange={value => {
                                    return updateSettings({ setting: 'syncSwitch', value });
                                }}
                            />

                            <Divider style={styles.dividerStyles} />

                            <SettingsSwitch
                                value={useCellular}
                                label={t('drawer:useCellular')}
                                onValueChange={value => {
                                    return updateSettings({ setting: 'useCellular', value });
                                }}
                            />
                            <SettingsSwitch
                                value={autoSync}
                                label={t('drawer:autoSync')}
                                onValueChange={value => {
                                    return updateSettings({ setting: 'autoSync', value });
                                }}
                            />
                            <SettingsSwitch
                                value={syncAttachments}
                                label={t('drawer:syncAttachments')}
                                onValueChange={value => {
                                    return updateSettings({ setting: 'syncAttachments', value });
                                }}
                            />
                            <SettingsSwitch
                                value={syncComments}
                                label={t('drawer:syncComments')}
                                onValueChange={value => {
                                    return updateSettings({ setting: 'syncComments', value });
                                }}
                            />
                        </View>

                        <Divider style={styles.dividerStyles} />
                    </View>
                    <View style={styles.settingsHeaderStyles}>
                        <Text h3 style={styles.headerTextStyles}>
                            {t('drawer:about')}
                        </Text>

                        <Text h5 style={styles.subCategory}>
                            {t('questionnaire:questionnaires')}
                        </Text>
                        {this.getVersionOfQuestionnaires()}
                    </View>
                    <View style={styles.settingsHeaderStyles}>
                        <Text h3 style={styles.headerTextStyles}>
                            {t('drawer:dangerZoneTitle')}
                        </Text>

                        <Button
                            title={t('drawer:purge')}
                            icon={<Icon name={getTypedIonIcon('nuclear')} type="ionicon" color={textPrimaryColor} />}
                            iconRight
                            buttonStyle={styles.purgeButtonStyle}
                            containerStyle={{ marginVertical: 20 }}
                            onPress={this.onPurgePress}
                        />

                        <Button
                            title={t('drawer:clearQueue')}
                            icon={<Icon name={getTypedIonIcon('trash')} type="ionicon" color={textPrimaryColor} />}
                            iconRight
                            buttonStyle={styles.purgeButtonStyle}
                            containerStyle={{ marginVertical: 20 }}
                            onPress={this.onClearQueuePress}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyles: {
        flex: 1,
        backgroundColor: 'lightgrey',
    },
    headerContainerStyles: {
        //backgroundColor: '#393E42',
        backgroundColor: secondaryColor,
        paddingHorizontal: 10,
        paddingVertical: 40,
    },
    headerStyles: {
        padding: 10,
    },
    settingsHeaderStyles: {
        padding: 10,
    },
    settingsSectionTextStyles: {
        textAlign: 'right',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
    subCategory: {
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'black',
    },
    headerTextStyles: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },
    logoutButtonStyle: {
        backgroundColor: primaryColor,
        borderRadius: 0,
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    purgeButtonStyle: {
        backgroundColor: errorColor,
        borderRadius: 0,
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    dividerStyles: {
        margin: 10,
        height: 2,
    },
});

function mapStateToProps({ settings, auth }) {
    return { settings, auth };
}

const mapStateToProps = state => {
    return {
        settings: state.settings,
        auth: state.auth,
        questionnaires: questionnaireSelector(state),
    };
};

export default withNamespaces(['auth', 'common'], { wait: true })(
    connect(
        mapStateToProps,
        actions
    )(Drawer)
);

/*
<SettingsPicker
    label={t('drawer:language')}
    value={lang}
    onValueChange={
        (value) => updateSettings({setting: 'lang', value})
    }
    items={[
        {label: 'English', value: 'en'},
        //{label: 'German', value: 'de'}
    ]}
    style={{padding: 10}}
/>

<SettingsPicker
    label={t('drawer:dateFormat')}
    value={dateFormat}
    onValueChange={
        (value) => updateSettings({setting: 'dateFormat', value})
    }
    items={[
        {label: 'YYYY-MM-DD', value: 'YYYY-MM-DD'},
        //{label: 'DD/MMM/YYYY', value: 'DD/MMM/YYYY'}
    ]}
/>

<SettingsSwitch
                                value={useExpensiveConnection}
                                label={t('drawer:useExpensiveConnection')}
                                onValueChange={(value) => updateSettings({setting: 'useExpensiveConnection', value})}
                            />

                            <SettingsPicker
                                label={t('drawer:autoSyncMode')}
                                value={autoSyncMode}
                                onValueChange={
                                    (value) => updateSettings({setting: 'autoSyncMode', value})
                                }
                                items={[
                                    {label: 'Wifi only', value: 'w_only'},
                                    {label: 'Wifi + Cellular', value: 'w_and_c'}
                                ]}
                            />
*/
