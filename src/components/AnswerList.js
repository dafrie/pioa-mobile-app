import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Button, Text, Divider, Icon, Card } from 'react-native-elements';
import { withNamespaces } from 'react-i18next';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Constants } from 'expo';

import { getTypedIonIcon } from '../utils/getPlatformIcons';
import AddModal from './AddModal.js';
import CardHeader from './common/CardHeader';
import Moment from '../Moment';

import * as actions from '../actions';
import buttonStyles from '../styles/buttonStyles';
import labelStyles from '../styles/labelStyles';
import _ from 'lodash';

const { primaryColor } = Constants.manifest.extra;

class AnswerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedComment: null,
      showModal: false
    };
  }

  onSelect = (item, index) => {
    const { t, questionnaires } = this.props;

    this.props.setSelectedAnswer({
      extId: item.extId,
      patientId: this.props.patientId,
      answerId: item.id
    });

    const questionnaire = _.find(questionnaires, {
      extId: item.questionnaire_uuid
    });

    // Alert if questionaire has changed
    if (!questionnaire) {
      return Alert.alert(t('patient:formChangedTitle'), t('patient:formChangedBody'));
    }

    let title = '';
    let pageNumber = 0;
    if (questionnaire.schema && questionnaire.schema.pages.length > 0) {
      title = questionnaire.schema.pages[item.pageNumber].title;
      pageNumber = item.pageNumber + 1;
    }

    this.props.navigation.navigate('Questionnaire', {
      title,
      pageNumber,
      numberOfPages: questionnaire.schema.pages.length
    });
  };

  onModalClose = event => {
    this.setState({ showModal: false });
  };

  onAddAnswerPress = () => {
    this.setState({ modalType: 'create', showModal: true });
  };

  async onAddAnswerAsync(id) {
    const { patientId, questionnaires } = this.props;
    //const questionnaire = this.props.schemas[id];
    const questionnaire = _.find(questionnaires, {
      extId: id
    });

    const test = await this.props.addAnswer({
      patientId,
      questionnaireId: id,
      questionnaire
    });

    const answer = this.props.answers[this.props.answers.length - 1];
    this.props.setSelectedAnswer({
      patientId,
      answerId: answer.id
    });

    let title = '';
    if (questionnaire.schema && questionnaire.schema.pages.length > 0) {
      title = questionnaire.schema.pages[0].title;
    }
    this.setState({ showModal: false }, () => {
      setTimeout(() => {
        this.props.navigation.navigate('Questionnaire', {
          title,
          pageNumber: 1,
          numberOfPages: questionnaire.schema.pages.length
        });
      }, 400);
    });
  }

  onAddAnswer = id => {
    this.onAddAnswerAsync(id).then(() => {});
  };

  onDeleteAnswer = (item, i) => {
    Alert.alert(
      `Do you want remove ${item.type} ${i + 1}?`,
      '',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return console.log('Cancel Pressed');
          },
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            return this.props.removeAnswer({ id: item.id });
          }
        }
      ],
      { cancelable: true }
    );
  };

  renderPageNumber = item => {
    let pageNumber = 0;
    if (Object.keys(item.pages).length > 0) {
      pageNumber = item.pageNumber + 1;
    }
    return <Text style={styles.dateTimeStylesRight}>{`${pageNumber}/${Object.keys(item.pages).length}`}</Text>;
  };

  renderQuestionnaires() {
    const { answers, t } = this.props;
    let answersList = null;
    if (answers.length) {
      answersList = answers.map((item, i) => {
        return (
          <TouchableHighlight
            onPress={() => {
              return this.onSelect(item, i);
            }}
            onLongPress={() => {
              return this.onDeleteAnswer(item, i);
            }}
            style={styles.commentContainerStyles}
            key={i}
            activeOpacity={0.8}
            underlayColor="white"
          >
            <View>
              <Grid>
                <Col size={90}>
                  <Moment
                    format="DD/MM/YYYY"
                    style={styles.dateTimeStylesLeft}
                    element={Text}
                    date={item.date}
                    //tz={global.timezone}
                  />
                </Col>
                <Col size={10}>{this.renderPageNumber(item)}</Col>
              </Grid>
              <Divider style={styles.commentContainerStyles} />
              <Grid>
                <Col size={95}>
                  <Row>
                    <Text>{item.type}</Text>
                  </Row>
                </Col>
                <Col size={5}>
                  <Icon
                    name={getTypedIonIcon('checkmark')}
                    type="ionicon"
                    size={25}
                    color={item.version !== item.extVersion ? '#DCDCDC' : 'black'}
                    containerStyle={styles.checkButton}
                    onPress={this.onAddPatient}
                  />
                </Col>
              </Grid>
            </View>
          </TouchableHighlight>
        );
      });
    } else {
      answersList = (
        <Button
          title={t('questionnaire:addQuestionnairePlaceholder')}
          containerStyle={buttonStyles.containerStyles}
          buttonStyle={buttonStyles.buttonStyles}
          titleStyle={buttonStyles.buttonTextStyles}
          onPress={this.onAddAnswerPress}
        />
      );
    }

    return answersList;
  }

  render() {
    const { t, title, questionnaires } = this.props;
    const { showModal, modalType, selectedComment } = this.state;

    return (
      <Card title={<CardHeader title={title} color={primaryColor} onPress={this.onAddAnswerPress} />}>
        <View style={styles.commentsContainerStyles}>
          {this.renderQuestionnaires()}
          <AddModal
            visible={showModal}
            onModalClose={this.onModalClose}
            modalType={modalType}
            title={t('questionnaire:addQuestionnaire')}
            body={selectedComment}
            onConfirm={this.onAddAnswer}
            onRemove={this.onRemoveComment}
            options={questionnaires}
          />
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  commentsContainerStyles: {
    flex: 1
  },
  commentContainerStyles: {
    flex: 1,
    margin: 5
  },
  dateTimeStylesRight: {
    ...labelStyles.dateTimeStyles,
    textAlign: 'right'
  },
  dateTimeStylesLeft: {
    ...labelStyles.dateTimeStyles,
    textAlign: 'left'
  },
  addCommentWrapperStyles: {
    position: 'absolute',
    right: -15,
    top: -60
  },
  checkButton: {
    backgroundColor: 'white',
    marginTop: -5
  }
});

export default withNamespaces(['patient'], { wait: true })(
  connect(
    null,
    actions
  )(AnswerList)
);
