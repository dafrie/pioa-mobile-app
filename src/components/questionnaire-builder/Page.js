import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    ScrollView,
    View,
    Dimensions,
    Platform,
    StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CardFlex from './CardFlex';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Page extends Component {
    static navigationOptions = ({ screenProps }) => ({
        title: screenProps.t('navigation:questionaireTitle'),
    });

    render() {
        const elements = [];
        const { pageId } = this.props;

        for (const [index, card] of this.props.json.cards.entries()) {
            const data =
                this.props.data !== undefined && this.props.data !== undefined
                    ? this.props.data[card.id]
                    : null;
            elements.push(
                <CardFlex
                    key={card.id}
                    cardId={index}
                    pageIndex={pageId}
                    json={card}
                    onUpdate={item => {
                        this.props.data[card.id] = item;
                        this.props.onUpdate(this.props.data);
                    }}
                    registerValidator={item => {
                        return this.props.registerValidator(
                            item,
                            index,
                            pageId
                        );
                    }}
                    data={data}
                    mode={card.Multi}
                />
            );
        }

        if (Platform.OS === 'android') {
            return (
                <ScrollView style={styles.scrollView}>{elements}</ScrollView>
            );
        }

        return (
            <KeyboardAwareScrollView
                style={styles.keyboardAvoidingView}
                viewIsInsideTabBar
                enableResetScrollToCoords={false}
            >
                <View style={styles.containerStyles}>{elements}</View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        width: SCREEN_WIDTH,
    },
    scrollView: {
        width: SCREEN_WIDTH,
        paddingBottom: 50,
    },
});

export default connect(
    null,
    null
)(Page);
