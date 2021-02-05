import { View, StyleSheet, TextInput, Platform } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Constants } from 'expo';
import React, { Component } from 'react';
import { Card, CheckBox, Icon, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import QuestionnaireComponent from './config/QuestionnaireComponent';

const { primaryColor } = Constants.manifest.extra;

class CardFlex extends Component {
    static getDerivedStateFromProps(props, state) {
        if (state.answers.length === 0) {
            state.answers = props.data;
        }
        return state;
    }

    constructor(props) {
        super(props);
        this.state = {
            fractures: [{}],
            answers: [],
            position: 0,
        };
        this.errors = [];
        this.apps = [];
        this.validators = [];
    }

    onAddFracture = () => {
        const answers = [...this.state.answers];
        answers.push({});
        //this.updateState(answers);
        this.setState({ answers }, () => {
            this.props.onUpdate(answers);
        });
    };

    onRemoveFracture = index => {
        const answers = [...this.state.answers];
        answers.splice(index, 1);
        this.updateState(answers);
    };

    getAddButton = index => {
        let addButton = null;

        if (
            this.state.answers !== undefined &&
            index === this.state.answers.length - 1 &&
            this.props.mode
        ) {
            addButton = (
                <Icon
                    size={34}
                    name={
                        Platform.OS === 'ios'
                            ? 'ios-add-circle-outline'
                            : 'md-add-circle'
                    }
                    type="ionicon"
                    color={primaryColor}
                    onPress={this.onAddFracture}
                    containerStyle={styles.addButtonStyles}
                />
            );
        }
        return addButton;
    };

    getDeleteButton = index => {
        let deleteButton = null;

        if (index > 0 && this.props.mode) {
            deleteButton = (
                <Icon
                    size={34}
                    name={
                        Platform.OS === 'ios'
                            ? 'ios-remove-circle-outline'
                            : 'md-remove-circle'
                    }
                    type="ionicon"
                    color={primaryColor}
                    onPress={() => {
                        return this.onRemoveFracture(index);
                    }}
                    containerStyle={styles.addButtonStyles}
                />
            );
        }
        return deleteButton;
    };

    createElement = (object, rowIndex, cardIndex) => {
        if (object === null) {
            return <Text>createElement</Text>;
        }
        let result = null;
        let value = '';

        result = (
            <QuestionnaireComponent
                key={`QuestionnaireComponent${object.id}`}
                object={object}
                cardIndex={cardIndex}
                rowIndex={rowIndex}
                inputFieldIndex={this.inputFieldIndex}
                setRef={this._setRef}
                registerValidator={this._registerValidator}
                updateFracture={this.updateFracture}
                answers={this.state.answers}
                apps={this.apps}
            />
        );

        const inputFieldIndex = this.inputFieldIndex;

        return result;
    };

    createRows = (rows, cardId) => {
        const elements = [];
        rows.forEach((row, i) => {
            const tmpRow = [];
            if (row.type === 'col-2') {
                if (row.elements !== undefined && row.elements.length > 0) {
                    tmpRow.push(
                        <Col key={`${row.id}0`}>
                            {this.createElement(row.elements[0], i, cardId)}
                        </Col>
                    );
                    tmpRow.push(
                        <Col key={`${row.id}1`}>
                            {this.createElement(row.elements[1], i, cardId)}
                        </Col>
                    );
                    this.inputFieldIndex = this.inputFieldIndex + 1;
                }
            }
            if (row.type === 'col-1') {
                if (row.elements !== undefined && row.elements.length > 0) {
                    tmpRow.push(
                        <Col key={`${row.id}0`}>
                            {this.createElement(row.elements[0], i, cardId)}
                        </Col>
                    );
                    this.inputFieldIndex = this.inputFieldIndex + 1;
                }
            }
            if (row.type === 'col-3') {
                if (row.elements !== undefined && row.elements.length > 0) {
                    tmpRow.push(
                        <Col key={`${row.id}0`}>
                            {this.createElement(row.elements[0], i, cardId)}
                        </Col>
                    );
                    tmpRow.push(
                        <Col key={`${row.id}1`}>
                            {this.createElement(row.elements[1], i, cardId)}
                        </Col>
                    );
                    tmpRow.push(
                        <Col key={`${row.id}2`}>
                            {this.createElement(row.elements[2], i, cardId)}
                        </Col>
                    );
                    this.inputFieldIndex = this.inputFieldIndex + 1;
                }
            }

            elements.push(<Row key={`row${row.id}`}>{tmpRow}</Row>);
        });

        return elements;
    };

    QuestionnaireCard = (card, cardId) => {
        const addButton = this.getAddButton(cardId);
        const deleteButton = this.getDeleteButton(cardId);
        this.inputFieldIndex = 0;

        if (card !== undefined && card.length <= 0) {
            return [];
        }

        if (card.cols.length === 0) {
            return <Text key={card.id} />;
        }
        const rowElements = this.createRows(card.cols, cardId, 0);

        return (
            <Card key={cardId}>
                <Grid>
                    <Row>
                        <Text style={styles.titleText}>
                            {this.props.json.title}{' '}
                            {this.props.mode && cardId + 1}
                        </Text>
                    </Row>
                    <Grid>{rowElements}</Grid>
                    <Row>
                        <View style={styles.mainContainerButton}>
                            {deleteButton}
                            {addButton}
                        </View>
                    </Row>
                </Grid>
            </Card>
        );
    };

    _registerValidator = (
        item,
        cardIndex,
        answerId,
        answerIndex,
        errorStyle
    ) => {
        const callback = isError => {
            if (isError) {
                if (this.errors[cardIndex] === undefined) {
                    this.errors[cardIndex] = [];
                }
                this.errors[cardIndex][answerId] = isError;
                const element = this.apps[cardIndex][answerIndex];
                if (element !== undefined) {
                    element.setNativeProps({ style: errorStyle });
                } else {
                    console.log(
                        `element parentIndex: ${cardIndex} index: ${answerId} is undefined.`
                    );
                }
            }
        };
        if (item.required) {
            let validator = () => {
                const value = this.state.answers[cardIndex][answerId];
                if (value !== undefined && value !== null && value !== '') {
                    callback(false);
                    return {
                        isValid: true,
                        pageNumber: this.props.pageIndex,
                        questionNumber: answerId,
                    };
                } else {
                    callback(true);
                    return {
                        isValid: false,
                        pageNumber: this.props.pageIndex,
                        questionNumber: item.questionLabel,
                    };
                }
            };
            this.validators.push(validator);
            this.props.registerValidator(this.validators);
        }
    };

    _setRef = (ref, cardIndex, answerIndex) => {
        if (this.apps[cardIndex] === undefined) {
            this.apps[cardIndex] = [];
        }
        this.apps[cardIndex][answerIndex] = ref;
    };

    _promisedSetState = newState => {
        return new Promise(resolve => {
            this.setState(newState, () => {
                resolve();
            });
        });
    };

    updateFracture = (cardIndex, value, elementId) => {
        const answers = [...this.state.answers];
        answers[cardIndex][elementId] = value;
        this.updateState(answers);
    };

    updateState = async answers => {
        this.setState({ answers });
        this.props.onUpdate(answers);
    };

    renderCard = () => {
        const { answers } = this.state;
        this.validators = [];
        //const json = this.state.fractures;

        let result = [];
        if (answers) {
            result = answers.map((card, cardId) =>
                this.QuestionnaireCard(this.props.json, cardId)
            );
        }

        return result;
    };

    render() {
        return <View style={styles.flex1}>{this.renderCard()}</View>;
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

CardFlex.defaultProps = {
    options: [
        {
            mode: false,
        },
    ],
};

export default connect(
    null,
    actions
)(CardFlex);
