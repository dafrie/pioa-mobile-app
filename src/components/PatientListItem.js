import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {Constants} from 'expo';

import Moment from '../Moment';
import StatusIcon from './StatusIcon';

const {primaryColor} = Constants.manifest.extra;

class PatientListItem extends React.PureComponent {

    render() {
        const {item} = this.props;
        return (
            <TouchableHighlight
                onPress={() => this.props.onPressItem(item)}
                activeOpacity={0.2}
                underlayColor={primaryColor}
            >
                <View style={styles.itemContainerStyles}>
                    <View style={styles.itemColumnStyles}>
                        <Text numberOfLines={1}>
                            {item.firstName} {item.lastName}
                        </Text>
                        { (item.birthday) ?<Moment
                            format='YYYY-MM-DD'
                            element={Text}
                            date={item.birthday}
                            //tz={global.timezone}
                        /> : <Text>-</Text>}
                    </View>
                    <View style={[styles.itemColumnStyles, styles.centerColumnStyles]}>

                        { (item.admissionDate) ?<Moment
                            format='YYYY-MM-DD'
                            element={Text}
                            date={item.admissionDate}
                            //tz={global.timezone}
                        /> : <Text>-</Text>}
                        { (item.dischargeDate) ? <Moment
                            format='YYYY-MM-DD'
                            element={Text}
                            date={item.dischargeDate}
                            //tz={global.timezone}
                        /> : <Text>-</Text>}
                    </View>
                    <View style={[styles.itemColumnStyles, styles.rightColumnStyles]}>
                        <Text numberOfLines={1}>
                            {item.diagnosis}
                        </Text>
                        <View>
                            <StatusIcon
                                syncStatus={
                                    item.reviewed ? 'reviewed' :
                                        (item.version === item.extVersion && item.unsyncedObjectsTotal === 0) ? 'synced' : 'outOfSync'
                                }
                                isInQueue={item.isInQueue}
                                uploading={this.props.uploading}
                            />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    itemContainerStyles: {
        padding: 5,
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    itemColumnStyles: {
        width: '33%',
    },
    centerColumnStyles: {
        alignItems: 'center'
    },
    rightColumnStyles: {
        alignItems: 'flex-end',
    }
});

export default PatientListItem;