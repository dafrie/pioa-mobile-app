import React, { Component } from 'react';
import { AppLoading } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { navigation, user, greeted, checkLoginStatus } = this.props;
    checkLoginStatus(user);
    if (user) {
      navigation.navigate(greeted ? 'App' : 'Welcome');
    } else {
      navigation.navigate('Auth');
    }
  }

  render() {
    return <AppLoading />;
  }
}

function mapStateToProps({ auth }) {
  return { user: auth.user, greeted: auth.greeted };
}

export default connect(
  mapStateToProps,
  actions
)(AuthLoadingScreen);
