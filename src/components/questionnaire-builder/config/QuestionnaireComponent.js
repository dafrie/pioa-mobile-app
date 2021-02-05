import React from 'react';
import { Constants } from 'expo';
import { bootstrap, FONT_SIZE } from '../../../styles/bootstrap';
import TextAreaWrapper from './../elements/TextAreaWrapper';
import TextInputWrapper from './../elements/TextInputWrapper';
import ModalPicker from './../elements/ModalFilterWrapper';
import DateFieldWrapper from './../elements/DateFieldWrapper';
import { getTypedIonIcon } from '../../../utils/getPlatformIcons';
import { Card, CheckBox, Icon, Text } from 'react-native-elements';
import { View, StyleSheet, TextInput, Platform } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

const Elements = Object.freeze({
    CHECKBOX: 'checkBox',
    MODAL_PICKER: 'modalPicker',
    TEXT_AREA: 'textArea',
    DATE_FIELD: 'dateField',
    TIME_FIELD: 'timeField',
    LABOR_INPUT: 'laborInput',
    TEXT_INPUT: 'textInput',
    MULTIPLE_CHECKBOX: 'multipleCheckbox',
});

const { primaryColor } = Constants.manifest.extra;

class QuestionnaireComponent extends React.PureComponent {
    render() {
        const {
            type,
            object,
            cardIndex,
            rowIndex,
            inputFieldIndex,
            setRef,
            registerValidator,
            updateFracture,
            answers,
            apps,
        } = this.props;
        let result = null;
        let value = '';

        if (answers[cardIndex][object.id] !== undefined) {
            value = answers[cardIndex][object.id];
        }

        switch (object.type) {
            case 'checkBox': {
                value = value === true;
                result = (
                    <CheckBox
                        center
                        iconType="ionicon"
                        checkedIcon={getTypedIonIcon('radio-button-on')}
                        uncheckedIcon={getTypedIonIcon('radio-button-off')}
                        key={`checkBox${object.id}${cardIndex}`}
                        title={object.label}
                        checkedColor={primaryColor}
                        checked={value}
                        onPress={() => {
                            return updateFracture(cardIndex, !value, object.id);
                        }}
                    />
                );
                break;
            }
            case 'textInput': {
                result = (
                    <View
                        key={`textInput${rowIndex}`}
                        style={styles.listElement}
                    >
                        <TextInputWrapper
                            key={`textInput${object.id}${cardIndex}`}
                            ref={inst => {
                                setRef(inst, cardIndex, inputFieldIndex);
                            }}
                            nextRef={() => {
                                var nextIndex = inputFieldIndex + 1;
                                return apps[cardIndex][nextIndex];
                            }}
                            parentIndex={cardIndex}
                            index={rowIndex}
                            object={object}
                            value={value}
                            updateFracture={updateFracture}
                        />
                    </View>
                );
                registerValidator(
                    object,
                    cardIndex,
                    object.id,
                    inputFieldIndex,
                    bootstrap.textbox.error
                );
                break;
            }
            case 'multipleCheckbox': {
                if (value === '') {
                    const results = [];
                    object.options.forEach(item => results.push(item.checked));
                    value = results;
                }
                result = (
                    <View
                        key={`textInput${rowIndex}`}
                        style={styles.listElement}
                    >
                        <Text
                            style={{
                                fontSize: FONT_SIZE,
                                marginBottom: 5,
                            }}
                        >
                            {object.label}
                        </Text>
                        <Row key={`CheckboxRow${object.id}${cardIndex}`}>
                            {object.options &&
                                object.options.map((item, index) => {
                                    return (
                                        <Col
                                            size={40}
                                            key={`Col${
                                                object.id
                                            }${cardIndex}multi${index}`}
                                        >
                                            <CheckBox
                                                center
                                                iconType="ionicon"
                                                checkedIcon={getTypedIonIcon(
                                                    'radio-button-on'
                                                )}
                                                uncheckedIcon={getTypedIonIcon(
                                                    'radio-button-off'
                                                )}
                                                key={`checkBox${
                                                    object.id
                                                }${cardIndex}multi${index}`}
                                                title={item.label}
                                                checkedColor={primaryColor}
                                                checked={value[index]}
                                                onPress={() => {
                                                    value[index] = !value[
                                                        index
                                                    ];
                                                    return updateFracture(
                                                        cardIndex,
                                                        value,
                                                        object.id
                                                    );
                                                }}
                                            />
                                        </Col>
                                    );
                                })}
                        </Row>
                    </View>
                );
                registerValidator(
                    object,
                    cardIndex,
                    object.id,
                    inputFieldIndex,
                    bootstrap.textbox.error
                );
                break;
            }
            case 'laborInput': {
                result = (
                    <View
                        key={`laborInput${rowIndex}`}
                        style={styles.listElement}
                    >
                        <Row>
                            <Col size={40}>
                                <Row>
                                    <TextInputWrapper
                                        key={`laborInput${
                                            object.id
                                        }${cardIndex}`}
                                        ref={inst => {
                                            setRef(
                                                inst,
                                                cardIndex,
                                                inputFieldIndex
                                            );
                                        }}
                                        nextRef={() => {
                                            var nextIndex = inputFieldIndex + 1;
                                            return apps[cardIndex][nextIndex];
                                        }}
                                        parentIndex={cardIndex}
                                        index={rowIndex}
                                        object={object}
                                        value={value}
                                        updateFracture={updateFracture}
                                    />
                                </Row>
                            </Col>
                            <Col size={60}>
                                <Row>
                                    <TextInput
                                        key={'${object.id}${cardIndex}'}
                                        editable={false}
                                        multiline
                                        style={bootstrap.laborInput.normal}
                                    >
                                        <Text>
                                            {object.label}
                                            {'\n'}
                                            {object.endField}
                                        </Text>
                                    </TextInput>
                                </Row>
                            </Col>
                        </Row>
                    </View>
                );
                registerValidator(
                    object,
                    cardIndex,
                    object.id,
                    inputFieldIndex,
                    bootstrap.textbox.error
                );
                break;
            }
            case 'textArea': {
                result = (
                    <View
                        key={`dateFieldRow${rowIndex}`}
                        style={styles.listElement}
                    >
                        <TextAreaWrapper
                            key={`textArea${rowIndex}`}
                            ref={inst => {
                                setRef(inst, cardIndex, inputFieldIndex);
                            }}
                            nextRef={() => {
                                var nextIndex = inputFieldIndex + 1;
                                return apps[cardIndex][nextIndex];
                            }}
                            parentIndex={cardIndex}
                            index={rowIndex}
                            object={object}
                            value={value}
                            updateFracture={updateFracture}
                        />
                    </View>
                );
                registerValidator(
                    object,
                    cardIndex,
                    object.id,
                    inputFieldIndex,
                    bootstrap.textboxarea.error
                );
                break;
            }
            case 'dateField': {
                result = (
                    <View
                        key={`dateFieldRow${rowIndex}`}
                        style={styles.listElement}
                    >
                        <DateFieldWrapper
                            key={`dateField${rowIndex}`}
                            date={value}
                            ref={inst => {
                                setRef(inst, cardIndex, inputFieldIndex);
                            }}
                            nextRef={() => {
                                var nextIndex = inputFieldIndex + 1;
                                return apps[cardIndex][nextIndex];
                            }}
                            label={object.label}
                            mode={object.mode}
                            format={object.format}
                            onSubmit={item => {
                                return updateFracture(
                                    cardIndex,
                                    item,
                                    object.id
                                );
                            }}
                        />
                    </View>
                );
                registerValidator(
                    object,
                    cardIndex,
                    object.id,
                    inputFieldIndex
                );
                break;
            }
            case 'timeField': {
                result = (
                    <View
                        key={`timeFieldRow${rowIndex}`}
                        style={styles.listElement}
                    >
                        <DateFieldWrapper
                            key={`timeField${rowIndex}`}
                            date={value}
                            ref={inst => {
                                setRef(inst, cardIndex, inputFieldIndex);
                            }}
                            nextRef={() => {
                                var nextIndex = inputFieldIndex + 1;
                                return apps[cardIndex][nextIndex];
                            }}
                            label={object.label}
                            mode="time"
                            format={'HH:mm'}
                            onSubmit={item => {
                                return updateFracture(
                                    cardIndex,
                                    item,
                                    object.id
                                );
                            }}
                        />
                    </View>
                );
                registerValidator(
                    object,
                    cardIndex,
                    object.id,
                    inputFieldIndex
                );
                break;
            }
            case 'modalPicker': {
                var filteredBy = null;
                if (object.filteredBy !== undefined) {
                    if (answers[cardIndex][object.filteredBy] !== undefined) {
                        filteredBy = answers[cardIndex][
                            object.filteredBy
                        ].toLowerCase();
                    }
                }

                result = (
                    <ModalPicker
                        key={`modalPicker${rowIndex}`}
                        ref={inst => {
                            setRef(inst, cardIndex, inputFieldIndex);
                        }}
                        label={object.label}
                        value={value}
                        filteredBy={filteredBy}
                        nextRef={() => {
                            var nextIndex = inputFieldIndex + 1;
                            return apps[cardIndex][nextIndex];
                        }}
                        customerRenderer={object.customerRenderer}
                        onSelect={item => {
                            return updateFracture(cardIndex, item, object.id);
                        }}
                        options={object.options}
                    />
                );
                //object.required = true;
                registerValidator(
                    object,
                    cardIndex,
                    object.id,
                    inputFieldIndex
                );
                break;
            }
            default: {
                //statements;
                break;
            }
        }

        return result;
    }
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    mainContainerButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        marginLeft: Platform.select({ ios: -2, android: 2 }),
        fontSize: 17,
        paddingBottom: 5,
    },
    listElement: {},
    inputStyle: {
        width: 200,
    },
    inputStyleError: {
        borderWidth: 1,
        borderColor: 'red',
        width: 200,
    },
    addButtonStyles: {
        marginTop: 10,
        marginHorizontal: 15,
    },
});

export default QuestionnaireComponent;
export { Elements };
