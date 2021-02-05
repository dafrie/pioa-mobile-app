import React, { Component } from "react";
import { bootstrap } from "../../../styles/bootstrap";
import { TextInput } from "react-native";

class TextInputWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      options: [],
      error: false
    };
    this.ref = {};
  }

  setNativeProps = () => {
    this.setState({ error: true });
    this.forceUpdate();
  };

  focus = () => {
    this.ref.focus();
  };

  render() {
    const { parentIndex, index, object, value, updateFracture } = this.props;
    return (
      <TextInput
        key={`textInput${index}`}
        placeholder={object.label}
        style={
          this.state.error ? bootstrap.textbox.error : bootstrap.textbox.normal
        }
        ref={inst => {
          this.ref = inst;
        }}
        onEndEditing={() => {
          if (value !== "") {
            this.setState({ error: false });
          }
        }}
        onSubmitEditing={() => {
          let { nextRef } = this.props;
          nextRef = nextRef();
          if (value !== "") {
            this.setState({ error: false });
          }
          if (nextRef !== undefined && nextRef.props.value === "") {
            nextRef.focus();
          }
        }}
        onChangeText={item => {
          return updateFracture(parentIndex, item, object.id);
        }}
        value={value}
      />
    );
  }
}

export default TextInputWrapper;
