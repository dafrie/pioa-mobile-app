import React from "react";
import {StyleSheet, View} from "react-native";
import {connect} from 'react-redux';
import {Text} from "react-native-elements";

import Moment from "../Moment";
import {patientByIdSelector} from "../selectors";
import {Constants} from "expo";

const {textPrimaryColor} = Constants.manifest.extra;


const PatientScreenHeader = ({patient}) => (
    <View>
        <Text style={styles.headerTitle}>{patient.firstName} {patient.lastName}</Text>
        <Text style={styles.headerSubtitle}>
            <Moment
                format='YYYY-MM-DD'
                element={Text}
                date={patient.birthday}
                //tz={global.timezone}
            />
        </Text>
    </View>
);

const styles = StyleSheet.create({
    headerTitle: {
        fontWeight: '700',
        fontSize: 16,
        alignSelf: 'center',
        color: textPrimaryColor
    },
    headerSubtitle: {
        fontWeight: '300',
        fontSize: 12,
        alignSelf: 'center',
        color: textPrimaryColor
    }
});

const mapStateToProps = state => {
    return {
        patient: patientByIdSelector(state)
    };
};

export default connect(mapStateToProps, null)(PatientScreenHeader);


