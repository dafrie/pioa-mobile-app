import React, { Component } from "react";
import { Constants } from "expo";
import { View, Image, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Icon, Divider, Text, Input, Button } from "react-native-elements";
import { withNamespaces } from "react-i18next";

const {
  primaryColor,
  primaryLightColor,
  secondaryLightColor,
  errorColor
} = Constants.manifest.extra;
import { getTypedIonIcon } from "../utils/getPlatformIcons";

class InputModal extends Component {
  state = {
    text: null
  };

  onChangeText = text => {
    this.setState({ text });
  };

  onConfirmText() {
    this.props.onAddComment(this.state.text);
  }

  renderCloseButton() {
    return (
      <Icon
        name={getTypedIonIcon("arrow-back")}
        type="ionicon"
        size={32}
        color={primaryColor}
        onPress={this.props.onModalClose}
      />
    );
  }

  renderDeleteButton() {
    return (
      <Icon
        name={getTypedIonIcon("trash")}
        type="ionicon"
        size={32}
        color={primaryColor}
        onPress={this.props.onRemove}
      />
    );
  }

  renderImage() {
    if (this.props.image) {
      return (
        <Image
          resizeMode="contain"
          source={{ uri: this.props.image.uri }}
          style={{ alignSelf: "center", height: 100, width: 100 }}
        />
      );
    }
  }

  renderTextField() {
    const { t, body } = this.props;
    if (this.props.modalType === "create") {
      return (
        <View>
          <Input
            autoFocus
            multiline
            containerStyle={styles.inputFieldStyles}
            inputStyle={{ height: 100 }}
            onChangeText={this.onChangeText}
            autoGrow
            maxLength={1000}
            placeholder={this.props.placeholder}
          />
          <Button
            title={t("common:save")}
            onPress={() => this.props.onConfirm(this.state.text)}
            buttonStyle={styles.buttonStyles}
            disabled={!this.state.text}
            disabledStyle={styles.disabledButtonStyles}
          />
        </View>
      );
    } else if (this.props.modalType === "view") {
      return <Text>{body.text}</Text>;
    }
  }

  renderBody() {
    const { title, modalType } = this.props;
    return (
      <View style={styles.modalContainerStyles}>
        <View style={styles.modalHeaderStyles}>
          <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
            {this.renderCloseButton()}
          </View>
          <View style={{ justifyContent: "center", flexDirection: "row" }}>
            <Text h4 style={{ textAlign: "center" }}>
              {title}
            </Text>
          </View>
          <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
            {modalType === "view" ? this.renderDeleteButton() : null}
          </View>
        </View>

        <Divider style={styles.bodyDividerStyles} />

        <View style={styles.modalBodyStyles}>
          {this.renderImage()}
          {this.renderTextField()}
        </View>
      </View>
    );
  }

  render() {
    const { visible, onModalClose } = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={() => this.props.onModalClose()}
        onBackdropPress={() => this.props.onModalClose()}
        avoidKeyboard
        style={styles.modalStyles}
      >
        {this.renderBody()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalStyles: {
    flex: 1
  },
  modalContainerStyles: {
    justifyContent: "space-between",
    backgroundColor: "white"
  },
  modalHeaderStyles: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 25
  },
  modalBodyStyles: {
    padding: 25,
    justifyContent: "center"
  },
  buttonStyles: {
    marginTop: 20,
    backgroundColor: primaryColor
  },
  disabledButtonStyles: {
    backgroundColor: primaryLightColor
  },
  inputFieldStyles: {
    borderBottomWidth: 0,
    height: 100
  }
});

export default withNamespaces(["common", "patient"], { wait: true })(
  InputModal
);
