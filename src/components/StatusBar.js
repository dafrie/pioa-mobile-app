import {Constants} from 'expo';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import { withNamespaces } from 'react-i18next';
import filesize from 'filesize';

import * as actions from '../actions';

const {primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor} = Constants.manifest.extra;

class StatusBar extends React.Component {

    getBackgroundColor() {
        const {queue, uploading} = this.props.syncQueue;
        if (!queue.length) {
            return {backgroundColor: "rgba(38, 207, 60, 0.8)"};
        } else if (uploading) {
            return {backgroundColor: "rgba(255, 185, 14, 0.8)"};
        }
        return {backgroundColor: "rgba(236, 128, 8, 0.8)"};
    }

    renderQueueText() {
        const { t } = this.props;
        const {queue, uploading} = this.props.syncQueue;
        if (!queue.length) {
            return (
                <Text style={styles.textStyles}>{t('queue:nothingToUpload')}</Text>
            );
        } else if (uploading) {
            return (
                <Text style={styles.textStyles}>{t('queue:uploadingText', {count: queue.length})}</Text>
            )
        }
        return (
            <Text style={styles.textStyles}>{t('queue:waitingToUploadText', {count: queue.length})}</Text>
        );
    }

    renderProgressText() {
        const { t } = this.props;
        const {uploading, loaded, total} = this.props.syncQueue;
        if (uploading && loaded) {
            return (
                <Text style={styles.textStyles}>
                    {t('queue:attachmentProgress',
                        {loaded: filesize(loaded), total: filesize(total)}
                        )}
                        </Text>
            )
        }
    }

    render() {
        const {showStatusBar = false} = this.props.settings;
        if (showStatusBar && this.props.auth.user && this.props.auth.user.email) {
            return (
                <View style={[styles.containerStyles, this.getBackgroundColor()]}>
                    {this.renderQueueText()}
                    {this.renderProgressText()}
                </View>
            );
        }
        return null;
    }
}

const styles = StyleSheet.create({
    containerStyles: {
        flex: 1,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        padding: 15,
    },
    textStyles: {
        textAlign: 'center',
        color: textSecondaryColor,
    }
});

function mapStateToProps({settings, ui, syncQueue, auth}) {
    return {settings, ui, syncQueue, auth};
}

export default withNamespaces(['common', 'queue'], {wait: true})(connect(mapStateToProps, actions)(StatusBar));
