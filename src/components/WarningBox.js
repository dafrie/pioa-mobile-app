import { Constants } from 'expo';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

const { primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor } = Constants.manifest.extra;
import timeout from '../utils/timeout';

class WarningBox extends React.Component {
  state = {
    showMessage: true
  };

  async componentDidMount() {
    await timeout(3000);
    await this.setState({ showMessage: false });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.auth.warning !== prevProps.auth.warning) {
      await this.setState({ showMessage: true });
      await timeout(3000);
      this.setState({ showMessage: false });
    }
  }

  render() {
    const { showMessage } = this.state;
    const { warning } = this.props.auth;
    if (showMessage && warning) {
      return (
        <View style={[styles.containerStyles]}>
          <Text style={styles.textStyles}>{warning}</Text>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  containerStyles: {
    width: '100%',
    position: 'absolute',
    top: 0,
    paddingTop: 50,
    paddingBottom: 10,
    //backgroundColor: 'rgba(236, 220, 41, 0.7)',
    backgroundColor: 'orange',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  textStyles: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '300',
    fontSize: 18
  }
});

function mapStateToProps({ settings, ui, syncQueue, auth }) {
  return { auth };
}

export default withNamespaces(['common', 'auth'], { wait: true })(
  connect(
    mapStateToProps,
    null
  )(WarningBox)
);
