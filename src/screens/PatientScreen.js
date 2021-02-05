import React, {Component} from 'react';
import {ScrollView, View, StyleSheet, Linking} from 'react-native';
import {Constants} from 'expo';
import {connect} from 'react-redux';
import {Card, Text} from 'react-native-elements';
import { withNamespaces } from 'react-i18next';
import HeaderButtons, { HeaderButton } from 'react-navigation-header-buttons'
import {Ionicons, createIconSetFromFontello} from '@expo/vector-icons';

import Moment from '../Moment';
import {patientByIdSelector, questionnaireSelector, answersByPatientIdSelector} from '../selectors';
import CommentList from '../components/CommentList';
import AnswerList from '../components/AnswerList';
import AttachmentGallery from '../components/AttachmentGallery';
import PatientScreenHeader from '../components/PatientScreenHeader';
import Anchor from '../components/common/Anchor';
import {getTypedIonIcon} from '../utils/getPlatformIcons';

const {primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor} = Constants.manifest.extra;


const IoniconsHeaderButton = props => (
    <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} color={textPrimaryColor} />
);


class PatientScreen extends Component {

    static navigationOptions = ({navigation, screenProps}) => {
        const {firstName, lastName, birthday} = navigation.state.params.patient;
        return {
            title: screenProps.t('navigation:patientTitle'),
            drawerLockMode: 'locked-closed',
            headerTitle: <PatientScreenHeader />,
            headerTitleStyle: styles.headerContainer,
            headerRight: (
                <HeaderButtons
                    HeaderButtonComponent={IoniconsHeaderButton}
                >
                    <HeaderButtons.Item
                        title="settings"
                        iconName={getTypedIonIcon('build')}
                        onPress={
                            () => navigation.navigate('PatientEdit',
                                {patient: navigation.state.params.patient}
                            )
                        }
                    />
                </HeaderButtons>
            )
        };
    };


    render() {
        const {t, uiPatient, patient, navigation, questionnaires, answers} = this.props;
        const {identifier, diagnosis, admissionDate, dischargeDate, telephone} = this.props.patient;
        return (
            <View>
                <ScrollView>

                    <Card title={`${t('patient:biography')}: ${identifier}`}>
                        <View style={styles.wrapperStyles}>
                            <View>
                                <Text>ADM:
                                    {(admissionDate) ? <Moment
                                        format='YYYY-MM-DD'
                                        element={Text}
                                        date={admissionDate}
                                        //tz={global.timezone}
                                    /> : ' -'}
                                </Text>
                            </View>
                            <View>
                                <Text>DIS:
                                    {(dischargeDate) ? <Moment
                                        format='YYYY-MM-DD'
                                        element={Text}
                                        date={dischargeDate}
                                        //tz={global.timezone}
                                    /> : ' -'}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text>Diagnosis:</Text>
                            <Text>{diagnosis}</Text>
                        </View>
                        {telephone ?
                        <View>
                            <Anchor href={`tel:${telephone}`}><Text>Telephone: {telephone}</Text></Anchor>
                        </View> : null }
                    </Card>
                    <AnswerList
                        patientId={uiPatient.selectedPatientId}
                        navigation={navigation}
                        questionnaires={questionnaires}
                        answers={answers}
                        title={t('patient:answerListTitle')}
                    />

                    <CommentList
                        title={t('patient:comments')}
                        patient={patient}
                    />

                    <AttachmentGallery
                        title={t('patient:attachments')}
                        data={patient}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        alignSelf: 'center',
    },
    wrapperStyles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

const mapStateToProps = state => {
    return {
        uiPatient: state.uiPatients,
        patient: patientByIdSelector(state),
        questionnaires: questionnaireSelector(state),
        answers: answersByPatientIdSelector(state)
    };
};

export default withNamespaces(['navigation', 'patient'], {wait: true})(connect(mapStateToProps, null)(PatientScreen));
