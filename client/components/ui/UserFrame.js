import React from 'react';
import { connect } from 'react-redux';
import UserFrame from 'UI/UserFrame/UserFrame.jsx';
import { save_settings_locally, save_settings, show_transaction_history, start_send_money } from 'ACTIONS';

const mapStateToProps = (state, ownProps) => {

    return {
        user: state.user,
        app: state.app
    };
};

export default connect(mapStateToProps, { save_settings_locally, save_settings, show_transaction_history, start_send_money })(UserFrame);