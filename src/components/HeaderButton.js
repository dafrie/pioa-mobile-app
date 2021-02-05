import React, { Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {Constants} from "expo";

const {primaryColor} = Constants.manifest.extra;

export default class HeaderButton extends Component {

    renderExtraIcon() {
        const {type, color, title, extraIconText, extraType, extraIconPosition} = this.props;
        if (extraType === 'Text') {
            return (
                <View style={styles.absoluteStyles}>
                    <Text style={styles.iconTextStyles}>
                        {extraIconText}
                    </Text>
                </View>
            )
        } else if (extraType === "Icon") {
            return (
                <Icon
                    type='entypo'
                    name='triangle-up'
                    title={title + 1}
                    color={color}
                    size={12}
                    containerStyle={[styles.extraIconContainerStyles]}
                />
            )
        }
        return null
    }

    render() {
        const {name, type, size, color, title} = this.props;
        return (
            <View style={styles.containerStyles}>
                <Icon
                    type={type}
                    name={name}
                    title={title}
                    size={size}
                    color={color}
                    containerStyle={styles.absoluteStyles}
                />
                {this.renderExtraIcon()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerStyles: {
        //flex: 1,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        //height: '100%',
        //width: '100%'

    },
    absoluteStyles: {
        position: 'absolute',
        justifyContent: 'center',
        height: '100%',
        zIndex: 1,
    },
    iconTextStyles: {
        alignSelf: 'center',
        fontSize: 8,
        fontWeight: 'bold',
        color: textPrimaryColor
    },
    extraIconContainerStyles: {
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%'
    }
});
