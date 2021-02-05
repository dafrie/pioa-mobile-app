import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import {
    KeyboardAvoidingView,
    ScrollView,
    Dimensions,
    View,
    Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import ModalFilterPicker from 'react-native-modal-filter-picker';

import * as actions from '../../actions';
import {
    answersByIdSelector,
    patientByIdSelector,
    jsonByIdSelector,
} from '../../selectors';
import Page from './Page';
import { Constants } from 'expo';
import { getTypedIonIcon } from '../../utils/getPlatformIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const { secondaryColor, textPrimaryColor } = Constants.manifest.extra;

class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: [],
            visible: false,
        };

        this.offset = 0;
        this.validators = [];
        this.errors = [];
    }

    onValidateAnswer = () => {
        const { answer, navigation } = this.props;
        const errors = [];
        for (const pages of this.validators) {
            for (const cards of pages) {
                for (const validator of cards) {
                    const result = validator();
                    if (!result.isValid) {
                        errors.push({
                            key: {
                                pageId: result.pageNumber,
                                qnumber: result.questionNumber,
                            },
                            label: `Error page ${result.pageNumber +
                                1} question ${result.questionNumber + 1}`,
                        });
                    }
                }
            }
        }

        if (errors.length > 0) {
            this.errors = errors;
            this.setState({ visible: true });
        } else {
            navigation.goBack();
            //this.props.confirmAnswer({ id: answerId, answer, patient: patient.id });
            this.props.confirmAnswer(answer);
        }
    };

    async promisedUpdateAnswer(answer) {
        await this.props.updateAnswer(answer);
        //this.createQuestionnaire();
    }

    onPageChanged = e => {
        const offset = e.nativeEvent.contentOffset;
        const { setParams } = this.props;
        if (this.state.pages.length > 1) {
            if (offset) {
                const newOffset = Math.round(offset.x / SCREEN_WIDTH) + 1;
                if (this.offset !== newOffset) {
                    this.offset = newOffset;
                    const title = this.props.json.pages[newOffset - 1].title;
                    this.props.changeTitle(
                        this.props.json.pages[newOffset - 1].title,
                        newOffset
                    );

                    const answer = Object.assign({}, this.props.answer);
                    answer.pageNumber = this.offset - 1;
                    if (answer.pageKnown < newOffset - 1) {
                        answer.pageKnown = newOffset - 1;
                        if (newOffset - 1 === this.state.pages.length - 1) {
                            answer.firstTime = false;
                            this.promisedUpdateAnswer(answer);
                        }
                    }
                    this.promisedUpdateAnswer(answer);
                }
            }
        }
    };

    createPageElement = (index, page) => {
        const { answer, json } = this.props;
        const { pages } = answer;

        return (
            <View key={`view${index}`} style={styles.slideStyle}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={'padding'}
                    keyboardVerticalOffset={Platform.select({
                        ios: 0,
                        android: 100,
                    })}
                >
                    <Page
                        json={page}
                        data={pages[page.id]}
                        pageId={index}
                        onUpdate={item => {
                            pages[page.id] = item;
                            const answerTmp = Object.assign({}, answer);
                            // timestamp is needed to signal a change to ormSelector which has a memorized state.
                            answerTmp.updateTimestamp = new Date().getTime();
                            this.props.updateAnswer(answerTmp, 'Answer');
                        }}
                        registerValidator={(
                            validator,
                            cardIndex,
                            pageIndex
                        ) => {
                            if (!this.validators[pageIndex]) {
                                this.validators[pageIndex] = [];
                            }
                            this.validators[pageIndex][cardIndex] = validator;
                        }}
                    />

                    {(index === json.pages.length - 1 || !answer.firstTime) && (
                        <Icon
                            reverse
                            raised
                            //name={'check-circle'}
                            //type='feather'
                            type="ionicon"
                            name={getTypedIonIcon('checkmark-circle-outline')}
                            size={32}
                            color={secondaryColor}
                            containerStyle={
                                styles.floatingAddButtonStyleComplete
                            }
                            onPress={this.onValidateAnswer}
                        />
                    )}
                </KeyboardAvoidingView>
            </View>
        );
    };

    componentDidMount() {
        this.createQuestionnaire();
    }

    createQuestionnaire() {
        const tmpPages = [];
        const pageNumber = this.props.answer.pageNumber;
        var startTime = new Date();
        this.props.json.pages.forEach((page, index) => {
            if (page.cards && page.cards.length > 0) {
                tmpPages.push(this.createPageElement(index, page));
            }
        });

        this.setState({ pages: tmpPages }, () => {
            this.refs.scrollView.scrollTo({
                x: SCREEN_WIDTH * pageNumber,
                y: 0,
                animated: false,
            });
        });
    }

    render() {
        return (
            <ScrollView
                ref={'scrollView'}
                horizontal
                pagingEnabled
                onMomentumScrollEnd={this.onPageChanged}
                onContentSizeChange={() => {
                    if (this.state.pages.length > 1) {
                        const pageNumber = this.props.answer.pageNumber;

                        this.refs.scrollView.scrollTo({
                            x: SCREEN_WIDTH * pageNumber,
                            y: 0,
                            animated: false,
                        });
                    }
                }}
                style={{ flex: 1 }}
            >
                {this.state.pages}
                <ModalFilterPicker
                    renderOption={null}
                    visible={this.state.visible}
                    onSelect={item => {
                        this.setState({ visible: false });
                        this.props.changeTitle(
                            this.props.json.pages[item.pageId].title,
                            item.pageId + 1
                        );
                        this.refs.scrollView.scrollTo({
                            x: SCREEN_WIDTH * item.pageId,
                            y: 0,
                            animated: false,
                        });
                    }}
                    onCancel={() => {
                        this.setState({ visible: false });
                    }}
                    options={this.errors}
                />
            </ScrollView>
        );
    }
}

const styles = {
    questionContainer: {
        flex: 0,
        alignItems: 'flex-start',
        margin: 0,
        padding: 0,
        borderWidth: 1,
    },
    scrollView: {
        alignItems: 'flex-start',
    },
    slideStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH,
    },
    textStyle: {
        fontSize: 30,
        color: textPrimaryColor,
    },
    floatingAddButtonStyleComplete: {
        //backgroundColor: secondaryColor,
        position: 'absolute',
        bottom: 15,
        right: 15,
    },
};

const mapStateToProps = state => {
    return {
        answerId: state.uiPatients.selectedAnswerId,
        patient: patientByIdSelector(state),
        patientId: state.uiPatients.selectedPatientId,
        answer: answersByIdSelector(state),
        //json: jsonByIdSelector(state)
    };
};

export default withNavigation(
    connect(
        mapStateToProps,
        actions
    )(Questionnaire)
);
