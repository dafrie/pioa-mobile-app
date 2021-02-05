import DatePicker from 'react-native-datepicker';
import React, { Component } from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { View, Text } from 'react-native';
import { bootstrap, FONT_SIZE } from '../../../styles/bootstrap';


class DateFieldWrapper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
        this.value = this.props.date;
        this.ref = {};
    }

    setModalVisible = (visible) => {
        this.ref.setModalVisible(visible);
    }

    setNativeProps = () => {
        this.setState({ error: true });
        this.forceUpdate();
    };

    focus = () => {
        const { ref } = this;
        this._sleep(800).then(
            () => { this.ref.setModalVisible(true); }
        );
    }

    // sleep time expects milliseconds
    _sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    render() {

        let { ...props } = this.props;
        return (
            <View style={{ alignSelf: 'stretch' }}>
                        <Text style={{ fontSize: FONT_SIZE, marginBottom: 5, marginLeft: -5}}> {this.props.label} </Text>
                        <DatePicker
                            {...props}
                            ref={inst => { this.ref = inst; }}
                            customStyles={this.state.error ? { dateInput: bootstrap.dateField.error } : { dateInput: bootstrap.dateField.normal }}
                            style={{
                                width: '100%'
                            }}
                            date={this.props.date}
                            mode={this.props.mode}
                            showIcon={false}
                            placeholder={this.props.label}
                            format={this.props.format}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            onDateChange={(date) => {
                                if (this.state.error) {
                                    this.setState({ error: false });
                                }
                                this.value = date;
                                this.setState({ date: date });
                                let { nextRef } = this.props;
                                nextRef = nextRef();
                                if (nextRef !== undefined) {
                                    if (nextRef.value === '') {
                                        nextRef.focus();
                                    }
                                }

                                this.props.onSubmit(date);
                            }}
                        />
            </View>
        );
    }
}

DateFieldWrapper.defaultProps = {
    mode: 'date',
    format: 'YYYY-MM-DD'
};

export default DateFieldWrapper;
