import { close_dialog, regiser, register, sign_in } from 'STORE/actions.js'

import LoginDialog from 'UI/LoginDialog/LoginDialog.jsx'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({})

export default connect(mapStateToProps, { sign_in, regiser, close_dialog, register })(LoginDialog)
