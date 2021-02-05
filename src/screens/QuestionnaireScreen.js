import React, { Component } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Constants } from 'expo';

import Questionnaire from '../components/questionnaire-builder/Questionnaire';
import { getNumberOfPages, jsonByIdSelector } from '../selectors';
import * as actions from '../actions';

const { textPrimaryColor } = Constants.manifest.extra;

class QuestionnaireScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
        };
    }
    static navigationOptions = ({ navigation, screenProps }) => {
        const { state } = navigation;
        if (state.params !== undefined && navigation.state.params.pageNumber !== undefined) {
            return {
                title: typeof navigation.state.params.title === 'undefined' ? 'Gugu' : navigation.state.params.title,
                drawerLockMode: 'locked-closed',
                headerRight: (
                    <Text style={styles.siteNumberHeader}>
                        {`${screenProps.t('questionnaire:pageNumberHeader') 
                            } ${ 
                            navigation.state.params.pageNumber 
                            }/${ 
                            navigation.state.params.numberOfPages}`}
                    </Text>
                ),
            };
        } 
            return {
                title: state.params.title,
            };
    };

    /*static getDerivedStateFromProps(props, state) {
        console.log('getDerivedStateFromProps');
        if (props.json.pages[0].title !== state.title) {
            const { setParams } = props.navigation;
            setParams({
                title: props.json.pages[0].title,
                pageNumber: 2,
                numberOfPages: 3,
            });
            state.title = props.json.pages[0].title;
        }

        return state;
    }*/

    changeTitle = (title, pageNumber) => {
        const { setParams } = this.props.navigation;
        setParams({
            title,
            pageNumber,
            numberOfPages: this.props.pageInfos.numberOfPages,
        });
    };

    render() {
        return <Questionnaire key={this.props.json.extId} json={this.props.json} changeTitle={this.changeTitle} patientId={this.props.patientId} />;
    }
}

const styles = StyleSheet.create({
    siteNumberHeader: {
        marginRight: 20,
        fontSize: 17,
        color: 'white',
    },
});

const mapStateToProps = state => {
    const result = {
        pageInfos: getNumberOfPages(state),
        patientId: state.uiPatients.selectedPatientId,
        json: jsonByIdSelector(state),
    };

    return result;
};

export default withNamespaces(['navigation', 'questionnaire'], { wait: true })(
    connect(
        mapStateToProps,
        actions
    )(QuestionnaireScreen)
);
