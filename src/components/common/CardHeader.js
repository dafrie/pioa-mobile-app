import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Divider, Icon} from 'react-native-elements';


export default class CardHeader extends Component {
    render() {
        const {title, onPress, color} = this.props;
        return (
            <View>
                <View style={styles.headerContainerStyles}>
                    <View style={styles.headerLeftStyles}>
                    </View>
                    <View style={styles.headerCenterStyles}>
                        <Text style={styles.headerTitleTextStyles}>{title}</Text>
                    </View>
                    <View style={styles.headerRightStyles}>
                        <Icon
                            size={34}
                            name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle'}
                            type='ionicon'
                            color={color}
                            onPress={onPress}
                        />
                    </View>
                </View>
                <Divider style={styles.headerDividerStyles}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerContainerStyles: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15
    },
    headerLeftStyles: {flex: 1, justifyContent: 'flex-start'},
    headerCenterStyles: {flex: 4, justifyContent: 'center', alignItems: 'center'},
    headerRightStyles: {flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'},
    headerTitleTextStyles: {fontSize: 18, fontWeight: 'bold'},
    headerDividerStyles: {marginBottom: 15}
});