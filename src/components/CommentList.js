import React, {Component} from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {Constants} from 'expo';
import {connect} from 'react-redux';
import {Button, Icon, Text, Divider, Card} from 'react-native-elements';
import { withNamespaces } from 'react-i18next';

import Moment from '../Moment';
import * as actions from '../actions';
import InputModal from './InputModal.js';
import CardHeader from './common/CardHeader';
import buttonStyles from '../styles/buttonStyles';

const {primaryColor, secondaryColor} = Constants.manifest.extra;


class CommentList extends Component {

    state = {showModal: false, selectedComment: null}

    onModalClose = () => {
        this.setState({showModal: false});
    };

    onAddCommentPress = () => {
        this.setState({modalType: 'create', showModal: true});
    };

    onSelectCommentPress = (comment) => {
        this.setState({modalType: 'view', showModal: true, selectedComment: comment});
    };

    onAddComment = (text) => {
        const selectedPatientId = this.props.patient.id;
        const date = Date.now();
        this.props.upsertEntity({patient: selectedPatientId, text, date}, 'Comment');
        this.onModalClose();
    };

    onRemoveComment = () => {
        this.props.removeComment(this.state.selectedComment);
        this.onModalClose();
    };

    renderComments() {
        const {comments} = this.props.patient;
        if (comments.length) {
            const commentList = comments.map((item, i) => {
                return (
                    <TouchableHighlight
                        onPress={() => this.onSelectCommentPress(item)}
                        style={styles.commentContainerStyles}
                        key={i}
                        activeOpacity={0.8}
                        underlayColor='white'
                    >
                        <View>
                            <Moment
                                style={styles.dateTimeStyles}
                                element={Text}
                                date={item.date}
                                //tz={global.timezone}
                            />
                            <Divider style={styles.commentContainerStyles}/>
                            <Text>{item.text} </Text>
                        </View>
                    </TouchableHighlight>
                );
            });
            return commentList;
        }
        // Render if no comments
        return (
            <Button
                title={this.props.t('patient:noComments')}
                containerStyle={buttonStyles.containerStyles}
                buttonStyle={buttonStyles.buttonStyles}
                titleStyle={buttonStyles.buttonTextStyles}
                onPress={this.onAddCommentPress}
            />
        );
    }

    render() {
        const {t, title} = this.props;
        const {showModal, modalType, selectedComment} = this.state;
        return (
            <Card
                title={
                    <CardHeader title={title} color={primaryColor} onPress={this.onAddCommentPress}/>
                }
            >
                <View style={styles.commentsContainerStyles}>

                    {this.renderComments()}

                    <InputModal
                        visible={showModal}
                        onModalClose={this.onModalClose}
                        modalType={modalType}
                        title={modalType === 'create' ? t('patient:addComment') : t('patient:viewComment')}
                        body={selectedComment}
                        placeholder={t('patient:commentPlaceholder')}
                        onConfirm={this.onAddComment}
                        onRemove={this.onRemoveComment}
                    />

                </View>
            </Card>
        );
    }

}

const styles = StyleSheet.create({
    commentsContainerStyles: {
        flex: 1,
    },
    commentContainerStyles: {
        flex: 1,
        margin: 5,

    },
    dateTimeStyles: {
        textAlign: 'right',
        marginTop: 10,
        fontStyle: 'italic',
        fontSize: 12,
        fontWeight: '200'
    },
    addCommentWrapperStyles: {
        position: 'absolute',
        right: -15,
        top: -60
    },
});

export default withNamespaces(['patient'], {wait: true})(connect(null, actions)(CommentList));
