import { Constants } from 'expo';
import React from 'react';
import { StyleSheet, View, Switch, Platform } from 'react-native';
import { Button, Text, Divider, Icon, Avatar } from 'react-native-elements';

const { primaryColor, secondaryColor, errorColor } = Constants.manifest.extra;

export default class SettingsSwitch extends React.Component {
  render() {
    return (
      <View style={styles.containerStyles}>
        <Text style={styles.textStyles}>{this.props.label}</Text>
        <Switch value={this.props.value} trackColor={secondaryColor} onValueChange={this.props.onValueChange} style={styles.switchStyles} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyles: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  textStyles: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  switchStyles: {
    marginTop: 10
  }
});
