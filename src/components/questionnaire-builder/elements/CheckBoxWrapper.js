import React, { Component } from 'react';
import { bootstrap } from '../../../styles/bootstrap';
import { CheckBox } from 'react-native-elements';
import { Constants } from 'expo';
import {getTypedIonIcon} from "../../../utils/getPlatformIcons";

const { primaryColor, secondaryColor } = Constants.manifest.extra;

class TextInputWrapper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            options: [],
            error: false
        };
        this.value = this.props.value;
        this.ref = {};
    }

    setNativeProps = () => {
        //this.setState({ error: true });
        //this.forceUpdate();
    };

    focus = () => {
        //this.ref.focus();
    }

    render() {
        const { parentIndex, index, object, value, updateFracture } = this.props;
        return (
            <CheckBox
                center
                iconType='ionicon'
                checkedIcon={getTypedIonIcon('radio-button-on')}
                uncheckedIcon={getTypedIonIcon('radio-button-off')}
                key={`checkBox${index}`}
                style={this.state.error ? bootstrap.checkbox.error : bootstrap.checkbox.normal}
                title={object.label}
                checkedColor={primaryColor}
                checked={value}
                onPress={() => { return updateFracture(parentIndex, this.value, object.id); }}
            />
        );


    }
}

export default TextInputWrapper;
