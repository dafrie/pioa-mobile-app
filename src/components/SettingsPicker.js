import { Constants } from 'expo';
import React from 'react';
import { StyleSheet, View, Picker } from 'react-native';
import { Button, Text, Divider, Icon, Avatar } from 'react-native-elements';

const {primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor} = Constants.manifest.extra;

export default class SettingsPicker extends React.Component {

  //state = {}

  onValueChange = (value) => {
    this.props.onValueChange(value);
    this.setState({ focus: false });
  }

  renderItems() {
    const { items } = this.props;
    if (items.length) {
      const itemList = items.map((item, i) => {
        return (
          <Picker.Item label={item.label} value={item.value} key={i} />
        );
      });
      return itemList;
    } return null;
  }

  renderPicker() {
    const { focus } = this.state || {};
    const { items, value } = this.props;
    const selectedItem = items.find(i => i.value === value);
    if (focus) {
      return (
        <Picker
          selectedValue={value}
          onValueChange={this.onValueChange}
          style={styles.pickerStyles}
        >
          {this.renderItems()}
        </Picker>
      );
    } return (
      <Text
        onPress={() => this.setState({ focus: true })}
        style={styles.closedPickerStyles}
      >
      {selectedItem.label || ''}
      </Text>
    );
  }

  render() {
    return (
      <View style={[styles.containerStyles, this.props.style]} >
        <Text style={styles.labelStyles} >{this.props.label}</Text>
        {this.renderPicker()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyles: {
    flexDirection: 'row',
    justifyContent: 'center',

  },
  labelStyles: {
    alignSelf: 'flex-start',
    color: textPrimaryColor,
    textAlign: 'left',
    fontSize: 12,
  },
  closedPickerStyles: {
    textAlign: 'center',
    color: 'black',
    //fontWeight: 'bold',
    fontSize: 12,
    borderWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
    padding: 5
  },
  pickerStyles: {
    flex: 1,
    backgroundColor: 'white',
    height: 150,
  }
});
