import React from 'react';
import { connect } from 'react-redux';
import ConfirmationDialog from 'UI/ConfirmationDialog/ConfirmationDialog.jsx';
import { cancel_meal, close_dialog, save_settings_locally } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, { cancel_meal, close_dialog, save_settings_locally })(ConfirmationDialog);