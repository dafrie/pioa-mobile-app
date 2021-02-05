import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { Constants } from 'expo';

import * as actions from '../actions';

class SplashScreen extends Component {

  componentWillMount() {
    this.props.checkLogin();
  }

  render() {
    const { image, resizeMode, backgroundColor } = Constants.manifest.splash;
    // TODO: There is currently a bug and require epxects a string literal argument.
    // Thus, I hardcoded the asset currently...
    // const splashImage = '/../../'.concat(image);
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{ flex: 1 }}
          // TODO: Hardcoded link...
          source={require('../../assets/static/splash.png')}
          resizeMode={resizeMode}
          resizeMode="contain"
          backgroundColor={backgroundColor}
        />
      </View>
    );
  }
}

export default connect(null, actions)(SplashScreen);
