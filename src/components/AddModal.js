import React, {Component} from 'react';
import {Constants} from 'expo';
import {View, Image, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Divider, Text, Button} from 'react-native-elements';
import { withNamespaces } from 'react-i18next';

const {primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor} = Constants.manifest.extra;
import {getTypedIonIcon} from '../utils/getPlatformIcons';


class AddModal extends Component {

    state = {
        text: null
    }

    renderCloseButton() {
        return (
            <Icon
                name={getTypedIonIcon('arrow-back')}
                type='ionicon'
                size={32}
                color={primaryColor}
                onPress={this.props.onModalClose}
            />
        );
    }

    renderDeleteButton() {
        return (
            <Icon
                name={getTypedIonIcon('trash')}
                type='ionicon'
                size={32}
                color={primaryColor}
                onPress={this.props.onRemove}
            />
        );
    }

    renderTextField() {
        const {body} = this.props;

        const elements = [];
        for (const [index, object] of this.props.options.entries()) {
            elements.push(
                <View key={index}>
                    <Button
                        title={object.type}
                        key={index}
                        onPress={() => {
                            this.props.onConfirm(object.extId);
                            this.props.onModalClose();
                        }}
                        buttonStyle={styles.buttonStyles}
                    />
                </View>
            );
        }
        if (this.props.modalType === 'create') {
            return (
                <View>
                    {elements}
                </View>
            );
        } else if (this.props.modalType === 'view') {
            return (
                <Text>{body.text}</Text>
            );
        }
    }

    renderBody() {
        const {title, modalType} = this.props;
        return (
            <View style={styles.modalContainerStyles}>

                <View style={styles.modalHeaderStyles}>
                    <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                        {this.renderCloseButton()}
                    </View>
                    <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                        <Text h4 style={{textAlign: 'center'}}>{title}</Text>
                    </View>
                    <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                        {modalType === 'view' ? this.renderDeleteButton() : null}
                    </View>
                </View>

                <Divider style={styles.bodyDividerStyles}/>

                <View style={styles.modalBodyStyles}>
                    {this.renderTextField()}
                </View>
            </View>
        );
    }

    render() {
        const {visible} = this.props;
        return (
            <Modal
                isVisible={visible}
                onBackButtonPress={() => this.props.onModalClose()}
                onBackdropPress={() => this.props.onModalClose()}
                avoidKeyboard
                style={styles.modalStyles}
            >
                {this.renderBody()}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalStyles: {
        flex: 1,
    },
    modalContainerStyles: {
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    modalHeaderStyles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 25,
    },
    modalBodyStyles: {
        padding: 25,
        justifyContent: 'center',
    },
    buttonStyles: {
        marginTop: 20,
        backgroundColor: primaryColor,
    },
    disabledButtonStyles: {
        //backgroundColor: transparentPrimaryColor,
      backgroundColor: 'red'
    },
    inputFieldStyles: {
        borderBottomWidth: 0,
        height: 100
    }
});

export default withNamespaces(['common', 'patient'], {wait: true})(AddModal);
