import React, { Component } from "react";
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import { bootstrap } from "../../../styles/bootstrap";

class TextAreaWrapper extends Component {
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
      <AutoGrowingTextInput
        key={`textArea${index}`}
        ref={inst => {
          this.ref = inst;
        }}
        onSubmitEditing={() => {
          let { nextRef } = this.props;
          nextRef = nextRef();
          if (nextRef !== undefined && nextRef.props.value === "") {
            nextRef.focus();
          }
        }}
        onEndEditing={() => {
          if (value !== "") {
            this.setState({ error: false });
          }
        }}
        minHeight={object.height !== undefined ? object.height : 100}
        placeholder={object.label}
        onChangeText={item => {
          return updateFracture(parentIndex, item, object.id);
        }}
        style={
          this.state.error
            ? bootstrap.textboxarea.error
            : bootstrap.textboxarea.normal
        }
        value={value}
      />
    );
  }
}

export default TextAreaWrapper;
