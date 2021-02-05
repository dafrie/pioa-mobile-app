import React, { Component } from 'react';
import { Alert, StyleSheet, Text, ScrollView, KeyboardAvoidingView, View, Platform } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Button, Divider } from 'react-native-elements';
import f from 'tcomb-form-native';
import templates from 'tcomb-form-native/lib/templates/bootstrap';
import stylesheet from 'tcomb-form-native/lib/stylesheets/bootstrap';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as actions from '../actions/index';
import customDatePickerIOS from '../components/templates/datepicker.ios';
import customDatePickerAndroid from '../components/templates/datepicker.android';
import Select from '../components/templates/select';
import { patientByIdSelector } from '../selectors';

const { primaryColor, secondaryColor, errorColor } = Constants.manifest.extra;

const Form = f.form.Form;

const Gender = f.enums({
  F: 'Female',
  M: 'Male'
});

f.form.Form.stylesheet = stylesheet;
f.form.Form.templates = templates;

f.form.Form.stylesheet.dateValue.normal.borderColor = '#d0d2d3';
f.form.Form.stylesheet.dateValue.normal.backgroundColor = '#f0f1f1';
f.form.Form.stylesheet.dateValue.normal.borderWidth = 1;

const Patient = f.struct({
  identifier: f.String,
  firstName: f.String,
  middleName: f.maybe(f.String),
  lastName: f.String,
  gender: Gender,
  telephone: f.maybe(f.String),
  birthday: f.Date,
  admissionDate: f.Date,
  dischargeDate: f.maybe(f.Date),
  diagnosis: f.maybe(f.String)
});

const dateTransformer = {
  format: datestring => {
    return moment(datestring).toDate();
  },
  parse: date => {
    return date;
  }
};

// TODO: Hacky solution (string comparison) for now...
const optionalDateTransformer = {
  format: datestring => {
    return moment(datestring).toDate();
  },
  parse: value => {
    return String(value) === 'Invalid Date' ? null : value;
  }
};

const defaultValue = {
  birthday: moment()
    .utc()
    .year(2000)
    .month(0)
    .date(1)
    .utc()
    .startOf('day')
    .toDate(),
  admissionDate: moment().toDate(),
  dischargeDate: null
};

class PatientEditScreen extends Component {
  state = {
    value: this.props.patient || defaultValue
  };

  static navigationOptions = ({ screenProps, navigation }) => {
    const { t } = screenProps;
    const { patient } = navigation.state.params || {};
    return {
      title: patient ? t('navigation:editPatientTitle') : t('navigation:newPatientTitle'),
      drawerLockMode: 'locked-closed'
    };
  };

  componentDidMount() {
    // Auto-focus the identifier field when opening the screen
    this.refs.form.getComponent('identifier').refs.input.focus();
  }

  onChange = value => {
    this.setState({ value });
  };

  onSavePress = () => {
    const { patient, selectPatient, navigation, upsertEntity, t } = this.props;
    const formValues = this.refs.form.getValue();
    if (formValues) {
      const values = Object.assign({}, formValues);
      // Add id's
      if (patient) {
        values.id = patient.id;
        values.extId = patient.extId ? patient.extId : null;
      }
      try {
        upsertEntity(values, 'Patient');
        navigation.goBack();
      } catch (e) {
        Alert.alert(
          t('patient:duplicateAlertTitle'),
          e.message,
          [
            { text: t('common:cancel'), style: 'cancel' },
            {
              text: t('patient:duplicateAlertOk'),
              onPress: () => {
                this.props.selectPatient(e.originalPatient);
                navigation.goBack();
                navigation.navigate('Patient', { patient: e.originalPatient });
              }
            }
          ],
          { cancelable: false }
        );
      }
    }
  };

  render() {
    const { t } = this.props;
    const options = {
      auto: 'placeholders',
      fields: {
        identifier: {
          error: 'Insert a valid identifier',
          autoCorrect: false,
          // TODO: Could be a PR for the form library.
          //Should have a prop which allows to automatically focus the next input after enter/next
          returnKeyType: 'next',
          onSubmitEditing: () => {
            return this.refs.form.getComponent('firstName').refs.input.focus();
          }
        },
        firstName: {
          autoCorrect: false,
          error: 'Insert a valid name',
          returnKeyType: 'next',
          onSubmitEditing: () => {
            return this.refs.form.getComponent('middleName').refs.input.focus();
          }
        },
        middleName: {
          autoCorrect: false,
          returnKeyType: 'next',
          onSubmitEditing: () => {
            return this.refs.form.getComponent('lastName').refs.input.focus();
          }
        },
        lastName: {
          autoCorrect: false,
          error: 'Insert a valid name',
          returnKeyType: 'next'
          // TODO: Auto-focus on gender: onSubmitEditing: () => console.log(this.refs.form.getComponent('gender'))
        },
        gender: {
          template: Platform.OS === 'ios' ? Select : templates.select,
          nullOption: { value: '', text: 'Choose the gender...' },
          error: 'Select a valid gender',
          onSubmitEditing: () => {
            return this.refs.form.getComponent('telephone').refs.input.focus();
          }
        },
        telephone: {
          autoCorrect: false,
          keyboardType: 'phone-pad',
          returnKeyType: 'next'
          //onSubmitEditing: () => this.refs.form.getComponent('birthday').refs.input.focus()
        },
        birthday: {
          template: Platform.OS === 'ios' ? customDatePickerIOS : customDatePickerAndroid,
          label: 'Date of birth (D.O.B)',
          error: 'Select a valid birthday',
          mode: 'date',
          maximumDate: new Date(),
          transformer: dateTransformer,
          config: {
            format: date => {
              return moment(date).format('YYYY-MM-DD');
            }
          },
          returnKeyType: 'next'
          // onSubmitEditing: () => this.refs.form.getComponent('admissionDate').refs.input.focus()
        },
        admissionDate: {
          template: Platform.OS === 'ios' ? customDatePickerIOS : customDatePickerAndroid,
          label: 'Admission date',
          error: 'Select a valid admission date',
          mode: 'date',
          maximumDate: new Date(),
          transformer: dateTransformer,
          config: {
            format: date => {
              return moment(date).format('YYYY-MM-DD');
            }
          },
          returnKeyType: 'next'
          // onSubmitEditing: () => this.refs.form.getComponent('dischargeDate').refs.input.focus()
        },
        dischargeDate: {
          template: Platform.OS === 'ios' ? customDatePickerIOS : customDatePickerAndroid,
          label: 'Discharge date',
          error: 'Select a valid discharge date',
          mode: 'date',
          maximumDate: new Date(),
          transformer: optionalDateTransformer,
          config: {
            // TODO: Hacky solution (string comparison) for now...
            format: date => {
              return String(date) === 'Invalid Date' ? '...' : moment(date).format('YYYY-MM-DD');
            }
          },
          onSubmitEditing: () => {
            return this.refs.form.getComponent('diagnosis').refs.input.focus();
          }
        },
        diagnosis: {
          label: 'Diagnosis',
          error: 'Select a valid diagnosis',
          returnKeyType: 'next',
          onSubmitEditing: () => {
            return this.onSavePress;
          }
        }
      }
    };

    return (
      <KeyboardAwareScrollView
        keyboardShouldPeristTaps="handled"
        //style={{backgroundColor: '#4c69a5'}}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled
        enableOnAndroid
        enableAutomaticScroll
        extraHeight={80}
        extraScrollHeight={80}
      >
        <Form ref="form" type={Patient} options={options} value={this.state.value} onChange={this.onChange} />
        <Divider />
        <Button
          title={t('common:save')}
          containerStyle={styles.buttonContainerStyles}
          buttonStyle={styles.buttonStyles}
          titleStyle={styles.buttonTitleStyles}
          onPress={this.onSavePress}
        />
      </KeyboardAwareScrollView>
    );
  }
}

/*

return (
            <KeyboardAvoidingView behavior='padding' enabled>
                <ScrollView keyboardShouldPeristTaps='handled'>
                    <View style={styles.container}>
                        <Form
                            ref="form"
                            type={Patient}
                            options={options}
                            value={this.state.value}
                            onChange={this.onChange}
                        />
                        <Divider/>
                        <Button
                            title={t('common:save')}
                            containerStyle={styles.buttonContainerStyles}
                            buttonStyle={styles.buttonStyles}
                            titleStyle={styles.buttonTitleStyles}
                            onPress={this.onSavePress}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );

 */

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20
  },
  buttonContainerStyles: {
    borderRadius: 0,
    marginBottom: 40,
    paddingBottom: 40
  },
  buttonStyles: {
    backgroundColor: secondaryColor
  },
  buttonTitleStyles: {
    width: '100%'
  }
});

const mapStateToProps = state => {
  return {
    patient: patientByIdSelector(state)
  };
};

export default withNamespaces(['navigation', 'common'], { wait: true })(
  connect(
    mapStateToProps,
    actions
  )(PatientEditScreen)
);
