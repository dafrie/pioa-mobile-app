import React from "react";
import {
    View,
    Text,
} from "react-native";


import DatePicker from 'react-native-datepicker';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {bootstrap, FONT_SIZE} from '../../styles/bootstrap';


const UIPICKER_HEIGHT = 216;

class CustomDatePickerAndroid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
        this.value = this.props.date;
    }

    setModalVisible = (visible) => {
        this.ref.setModalVisible(visible);
    }

    setNativeProps = () => {
        this.setState({error: true});
        this.forceUpdate();
    };

    focus = () => {
        const {ref} = this;
        this._sleep(800).then(
            () => {
                this.ref.setModalVisible(true);
            }
        );
    };

    // sleep time expects milliseconds
    _sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    render() {
        const locals = this.props.locals;

        let value = locals.value;
        if (String(value) === 'Invalid Date') {
            value = null
        }
        return (
            <View style={{alignSelf: 'stretch'}}>
                <Grid size={100}>
                    <Row>
                        <DatePicker
                            ref={inst => {
                                this.ref = inst;
                            }}
                            customStyles={this.state.error ? {dateInput: bootstrap.dateField.error} : {dateInput: bootstrap.dateField.normal}}
                            style={{
                                width: '100%'
                            }}
                            showIcon={false}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            androidMode="spinner"
                            format="YYYY-MM-DD"
                            date={value}
                            maximumDate={locals.maximumDate}
                            minimumDate={locals.minimumDate}
                            minuteInterval={locals.minuteInterval}
                            mode={locals.mode}
                            onDateChange={value => locals.onChange(value)}
                            placeholder="Choose a date..."
                        />
                    </Row>
                </Grid>
            </View>
        );
    }
}

function customDatePicker(locals) {
    if (locals.hidden) {
        return null;
    }

    const stylesheet = locals.stylesheet;
    let formGroupStyle = stylesheet.formGroup.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    const errorBlockStyle = stylesheet.errorBlock;

    if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        helpBlockStyle = stylesheet.helpBlock.error;
    }

    const label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    const help = locals.help ? (
        <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    const error =
        locals.hasError && locals.error ? (
            <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
                {locals.error}
            </Text>
        ) : null;

    return (
        <View style={formGroupStyle}>
            {label}
            <CustomDatePickerAndroid locals={locals}/>
            {help}
            {error}
        </View>
    );
}

module.exports = customDatePicker;
