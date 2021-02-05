import React, {Component} from 'react';
import {Animated, View, Easing, StyleSheet} from 'react-native';
import {Constants} from 'expo';
import {Icon} from 'react-native-elements'

const {primaryColor, secondaryColor, errorColor} = Constants.manifest.extra;
import {getTypedIonIcon} from '../utils/getPlatformIcons';


class StatusIcon extends Component {

    componentDidMount() {
        this.spin();
    }

    mapNameFromStatus = () => {
        const { syncStatus, isInQueue } = this.props;
        let name = (syncStatus === 'reviewed') ? 'done-all'
            : (syncStatus === 'synced') ? 'checkmark' : 'alert';
        if (isInQueue) {
            name = 'sync'
        }
        return getTypedIonIcon(name);
    };

    spin = () => {
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => this.spin());
    };

    spinValue = new Animated.Value(0);

    renderIcon = () => (
        <Icon
            size={(this.props.status === 'uploading') ? 24 : (!this.props.status) ? 20 : 32}
            type='ionicon'
            name={this.mapNameFromStatus(this.props.syncStatus, this.props.queueStatus)}
            color={(this.props.status === 'uploading') ? primaryColor : (!this.props.status) ? primaryColor : secondaryColor}
            containerStyle={styles.iconContainerStyles}
            iconStyle={[styles.iconContainerStyles, styles.iconStyles]}
        />
    );

    render() {
        const { isInQueue, uploading } = this.props;
        const rotate = this.spinValue.interpolate({
            inputRange: [0, 1], outputRange: ['0deg', '360deg']
        });
        if (isInQueue && uploading) {
            return (
                <Animated.View style={[{transform: [{rotate}]}, styles.outerContainerStyles]}>
                    {this.renderIcon()}
                </Animated.View>
            );
        }
        return (
            <View style={styles.outerContainerStyles}>
                {this.renderIcon()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerContainerStyles: {
        position: 'absolute',
        top: -3,
        right: 3
    },
    iconContainerStyles: {
        //position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyles: {
        textAlign: 'center',
    }
});

export default StatusIcon;
