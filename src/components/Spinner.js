import React from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

const CustomSpinner = (props) => (
  <Spinner visible={!props.spinner.isReady} />
)

function mapStateToProps({ spinner }) {
  return { spinner };
}

export default connect(mapStateToProps)(CustomSpinner);
