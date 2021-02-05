import React, {Component} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Constants} from 'expo';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import { withNamespaces } from 'react-i18next';
import {Icon, Button, SearchBar} from 'react-native-elements'
import {SwipeListView} from 'react-native-swipe-list-view';

import * as actions from '../actions';
import {getSortedAndVisiblePatients} from '../selectors';
import {getTypedIonIcon} from '../utils/getPlatformIcons';

import PatientListItem from './PatientListItem';
import buttonStyles from '../styles/buttonStyles';
import {syncData} from '../utils/backgroundJob';
const {primaryColor, secondaryColor, errorColor} = Constants.manifest.extra;


class PatientList extends Component {
    state = {
        refreshing: false,
    };

    onPressItem = (item) => {
        const patient = item;
        const {navigation} = this.props;
        this.props.selectPatient(patient);
        navigation.navigate('Patient', {patient});
    };

    onRefresh = async () => {
        this.setState({refreshing: true});
        const result = await syncData();
        if (result) {
            this.setState({refreshing: false});
        }
        this.setState({ refreshing: false})
    };

    onAddPatient = async () => {
        await this.props.unselectPatient();
        this.props.navigation.navigate('PatientEdit');
    };

    onSyncItemPress = (rowData, rowMap) => {
        const {syncObject} = this.props;
        const { item } = rowData;
        syncObject(item, 'Patient');
        item.unsyncedObjects.comments.map(c => syncObject(c, 'Comment'));
        item.unsyncedObjects.attachments.map(a => syncObject(a, 'Attachment'));
        item.unsyncedObjects.answers.map(a => syncObject(a, 'Answer'));
        syncData();
        rowMap[rowData.index].closeRow()
    };

    onDeletePress = (rowData, rowMap) => {
        const {t} = this.props;
        const {firstName, lastName} = rowData.item;
        Alert.alert(
            t('deck:confirmDeletePatient'),
            `${firstName} ${lastName}`,
            [
                //{ text: t('common:edit'), onPress: () => console.log('Ask me later pressed') },
                {
                    text: t('common:cancel'),
                    onPress: () => rowMap[rowData.index].closeRow(),
                    style: 'cancel'
                },
                {
                    text: t('common:ok'),
                    onPress: () => { rowMap[rowData.index].closeRow(); this.props.deletePatient(rowData.item)}
                },
            ],
            //{ cancelable: false }
            {onDismiss: () => rowMap[rowData.index].closeRow()}
        );
    };

    renderHeader = () => {
        const {onSearchChange, uiPatients, t} = this.props;
        return (
            <SearchBar
                autoCorrect={false}
                keyboardType={(uiPatients.searchFilter) === 'DOB' ? 'numeric' : 'default'}
                onChangeText={onSearchChange}
                placeholder={t('common:search_placeholder')}
                clearIcon={{color: '#86939e', name: 'close'}}
                containerStyle={styles.noBorderContainerStyle}
            />
        );
    };

    renderSeparator = () => (
        <View style={styles.separatorStyles}/>
    );

    renderItem = (rowData) => (
        <PatientListItem
            item={rowData.item}
            onPressItem={this.onPressItem}
            uploading={this.props.uploading}
        />
    );

    render() {
        const {t, patients} = this.props;
        return (
            <View style={styles.flex1Styles}>
                <SwipeListView
                    useFlatList
                    data={patients}
                    ListHeaderComponent={this.renderHeader}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(rowData) => this.renderItem(rowData)}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListEmptyComponent={
                        <Button
                            title={t('deck:emptyPatientListMessage')}
                            containerStyle={buttonStyles.containerStyles}
                            buttonStyle={buttonStyles.buttonStyles}
                            titleStyle={buttonStyles.buttonTextStyles}
                            onPress={this.onAddPatient}
                        />
                    }
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    renderHiddenItem={(rowData, rowMap) => (
                        <View style={styles.swipeRowStyles}>
                            <Icon
                                //reverse
                                name={getTypedIonIcon('cloud-upload')}
                                type='ionicon'
                                containerStyle={styles.swipeBtnStyles}
                                color={"white"}
                                onPress={() => this.onSyncItemPress(rowData, rowMap)}
                            />
                            <Icon
                                //reverse
                                name={getTypedIonIcon('trash')}
                                type='ionicon'
                                containerStyle={[styles.swipeBtnStyles, styles.errorColor]}
                                //color={errorColor}
                                color={"white"}
                                onPress={() => this.onDeletePress(rowData, rowMap)}
                            />
                        </View>
                    )}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    stopLeftSwipe={75}
                    stopRightSwipe={-75}
                    closeOnRowBeginSwipe
                    previewRowKey={null}
                />
                <Icon
                    reverse
                    raised
                    name={getTypedIonIcon('add')}
                    type='ionicon'
                    color={secondaryColor}
                    size={30}
                    containerStyle={styles.floatingAddButtonStyle}
                    onPress={this.onAddPatient}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex1Styles: {
        flex: 1
    },
    separatorStyles: {
        height: 1,
        backgroundColor: '#CED0CE',
    },
    noBorderContainerStyle: {
        borderWidth: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0
    },
    floatingAddButtonStyle: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 30,
        right: 30
    },
    swipeRowStyles: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    swipeBtnStyles: {
        justifyContent: "center",
        backgroundColor: primaryColor,
        width: 75,
        height: '100%',
        margin: 0,
        borderRadius: 0,
    },
    errorColor: {
        backgroundColor: errorColor
    }
});

const mapStateToProps = state => {
    return {
        patients: getSortedAndVisiblePatients(state),
        uiPatients: state.uiPatients,
        uploading: state.syncQueue.uploading
    };
};

export default withNamespaces(['deck', 'common'], {wait: true})(withNavigation(connect(mapStateToProps, actions)(PatientList)));
