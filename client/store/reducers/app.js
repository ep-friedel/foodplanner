const app = (state = {}, action) => {
  switch (action.type) {
    case 'DIALOG':
      return { ...state, dialog: { type: action.content, option: action.option } }
    case 'HISTORY':
      action.app.errors = {}
      delete action.app.mailSuggestion
      action.app.busy = false
      action.app.hiddenBusy = false
      return action.app
    case 'CHECK_MAIL':
      if (action.status === 'complete' && !action.data.error) {
        return { ...state, mailSuggestion: action.data }
      } else if (action.status === 'complete') {
        return { ...state, mailSuggestion: undefined }
      }
      return state

    case 'SEND_MONEY':
    case 'SIGNOUT':
    case 'SAVE_SETTINGS':
      if (action.type !== 'SEND_MONEY' || (action.status === 'complete' && !action.data.error)) {
        return { ...state, mailSuggestion: undefined, dialog: { type: '' } }
      }
      return state

    case 'MEAL_SIGNUP':
    case 'MEAL_EDIT':
    case 'CREATE_MEAL':
    case 'CANCEL_MEAL':
    case 'SUBMIT_PRICES':
    case 'EDIT_MEAL':
    case 'SIGNIN':
    case 'REGISTER':
      if (action.status === 'complete') {
        return { ...state, dialog: { type: '' } }
      }
      return state
    case 'BUSY':
      return { ...state, busy: action.state }
    case 'HIDDEN_BUSY':
      return { ...state, hiddenBusy: action.state }
    case 'POSTMESSAGE':
      if (action.message === 'offline') {
        return { ...state, offline: action.payload.state }
      }
      return state
    case 'SHOW_ERROR':
      return { ...state, errors: { ...state.errors, [action.id]: action.content } }
    case 'DELETE_ERROR':
      let errors = { ...state.errors }
      delete errors[action.id]
      return { ...state, errors: errors }
    case 'REFRESH':
      if (action.status === 'complete' && action.data.version) {
        return { ...state, dataversion: action.data.version }
      }
      return state

    default:
      return state
  }
}

export default app