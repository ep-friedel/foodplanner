import './SettingsDialog.less'

import Dialog from 'UI/Dialog.js'
import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx'
import React from 'react'
import { getNotificationPermission } from 'SCRIPTS/serviceWorker.js'
import { generateHash } from 'SCRIPTS/crypto.js'

const userInterface = {
  name: name => /^[ÄÜÖäöüA-Za-z0-9.\-,\s]{2,100}$/.test(name),
  mail: mail => /^[\_A-Za-z0-9.\-]{1,70}@[\_A-Za-z0-9.\-]{1,70}\.[A-Za-z]{1,10}$/.test(mail),
  pass: pass => /^[ÄÜÖäöüA-Za-z0-9.\-,|;:_#'+*~?=\(/&%$§!\)]{0,100}$/.test(pass),
}
export default class SettingsDialog extends React.Component {
  constructor(props) {
    super()

    this.state = {
      id: props.user.id,
      mail: props.user.mail ? props.user.mail : '',
      name: props.user.name ? props.user.name : '',
      pass: '',
      pass2: '',
      creationNotice: props.user.creationNotice ? props.user.creationNotice : 0,
      creationNotice_notification: props.user.creationNotice_notification ? props.user.creationNotice_notification : 0,
      deadlineReminder: props.user.deadlineReminder ? props.user.deadlineReminder : 0,
      deadlineReminder_notification: props.user.deadlineReminder_notification ? props.user.deadlineReminder_notification : 0,
    }

    this.handleCheck = this.handleCheck.bind(this)
    this.mailInput = this.handleInput('mail').bind(this)
    this.nameInput = this.handleInput('name').bind(this)
    this.passInput = this.handleInput('pass').bind(this)
    this.pass2Input = this.handleInput('pass2').bind(this)

    this.mySetState = function(data, cb) {
      this.setState(data, () => {
        const app = history && history.state && history.state.app ? history.state.app : {}
        history.replaceState({ app: { ...app, dialog: { ...(app.dialog ? app.dialog : {}), state: this.state } } }, document.title, document.location.pathname)
      })
    }
  }

  submit() {
    const s = this.state
    let getHash = Promise.resolve()
    const valid =
      userInterface.mail(s.mail) &&
      userInterface.name(s.name) &&
      (!s.pass.length || (userInterface.pass(s.pass) && userInterface.pass(s.pass2) && s.pass2 === s.pass))

    if (!valid && this.props.user.id) {
      return
    }

    if (s.pass.length) {
      getHash = generateHash(s.pass)
    }

    getHash
      .then(hash => {
        if (s.deadlineReminder_notification || s.creationNotice_notification) {
          getNotificationPermission()
            .then(() => {
              if (this.props.user.id) {
                this.props.save_settings(s, hash)
              } else {
                this.props.save_settings_locally(s)
              }
            })
            .catch(err => {
              // add error message
              this.mySetState({
                deadlineReminder_notification: 0,
                creationNotice_notification: 0,
              })
            })
        } else if (this.props.user.id) {
          this.props.save_settings(s, hash)
        }
      })
      .catch(console.err)
  }

  cancel() {
    this.props.close_dialog()
  }

  handleInput(field) {
    return evt => {
      this.mySetState({
        [field]: evt.target.value,
      })
    }
  }

  handleCheck(event, type) {
    return evt => {
      this.mySetState({
        [event + (type ? '_' + type : '')]: +evt.target.checked,
      })
    }
  }

  render() {
    const s = this.state,
      notificationsBlocked = Notification.permission === 'denied'
    const valid =
      !this.props.user.id ||
      (userInterface.mail(s.mail) &&
        userInterface.name(s.name) &&
        (!s.pass.length || (userInterface.pass(s.pass) && userInterface.pass(s.pass2) && s.pass2 === s.pass)))
    const passwordValid = s.pass.includes(s.pass2) || (s.pass === s.pass2 && userInterface.pass(s.pass))
    const nameValid = userInterface.name(s.name)
    const mailValid = userInterface.mail(s.mail)

    return (
      <Dialog className="settingsDialog">
        <div className="titlebar">
          <h3>Einstellungen</h3>
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)} />
        </div>
        <div className="body">
          {this.props.user.id ? (
            <div>
              <div className="mailFrame">
                <label htmlFor="SettingsDialog_mail">E-Mail</label>
                <div className="row">
                  <input type="text" id="SettingsDialog_mail" value={s.mail} className={!mailValid ? 'invalid' : ''} onChange={this.mailInput} />
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="SettingsDialog_name">Name</label>
                  <input type="text" id="SettingsDialog_name" value={s.name} className={!nameValid ? 'invalid' : ''} onChange={this.nameInput} />
                </div>
                <div>
                  <label htmlFor="SettingsDialog_pass">Passwort</label>
                  <input
                    id="SettingsDialog_pass"
                    className={!passwordValid ? 'invalid' : ''}
                    type="password"
                    placeholder="Passwort (optional)"
                    onChange={this.passInput}
                  />
                </div>
                {s.pass.length ? (
                  <div>
                    <label htmlFor="SettingsDialog_pass2">Passwort wiederholen:</label>
                    <input
                      id="SettingsDialog_pass2"
                      className={!passwordValid ? ' invalid' : ''}
                      type="password"
                      placeholder="Passwort wiederholen"
                      onChange={this.pass2Input}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <h4>Benachrichtigungen:</h4>
          <table className="notificationMatrix">
            <thead>
              <tr>
                <th>Ereignis</th>
                <th>E-Mail</th>
                <th>
                  Push-Nachricht
                  <InfoBubble style={{ bottom: '-60px', right: '26px', width: '180px' }} arrow="left">
                    Die Einstellungen für Push-Nachrichten gelten jeweils&#13;&#10;nur für das Gerät, auf dem sie ausgewählt wurden.
                  </InfoBubble>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Neues Angebot</td>
                {!this.props.user.id ? (
                  <td className="notification createdMail" data-fieldtype="E-Mail">
                    <input type="checkbox" disabled={true} title="Bitte registrieren Sie sich, um diese Option wählen zu können." />
                  </td>
                ) : (
                  <td className="notification createdMail" data-fieldtype="E-Mail">
                    <input type="checkbox" onChange={this.handleCheck('creationNotice')} checked={this.state.creationNotice} />
                  </td>
                )}
                {notificationsBlocked ? (
                  <td className="notification createdNotification" data-fieldtype="Push-Notification">
                    <input
                      type="checkbox"
                      disabled={true}
                      checked={this.state.creationNotice_notification}
                      title="Benachrichtigungen wurden für diese Seite deaktiviert.&#13;&#10;Bitte lassen Sie Benachrichtigungen zu, um diese Option wählen zu können."
                    />
                  </td>
                ) : (
                  <td className="notification createdNotification" data-fieldtype="Push-Notification">
                    <input type="checkbox" onChange={this.handleCheck('creationNotice', 'notification')} checked={this.state.creationNotice_notification} />
                  </td>
                )}
              </tr>
              <tr>
                <td>Anmeldungs&shy;frist läuft ab</td>
                {!this.props.user.id ? (
                  <td className="notification deadlineMail" data-fieldtype="E-Mail">
                    <input type="checkbox" disabled={true} title="Bitte registrieren Sie sich, um diese Option wählen zu können." />
                  </td>
                ) : (
                  <td className="notification deadlineMail" data-fieldtype="E-Mail">
                    <input type="checkbox" onChange={this.handleCheck('deadlineReminder')} checked={this.state.deadlineReminder} />
                  </td>
                )}
                {notificationsBlocked ? (
                  <td className="notification deadlineNotification" data-fieldtype="Push-Notification">
                    <input
                      type="checkbox"
                      disabled={true}
                      checked={this.state.deadlineReminder_notification}
                      title="Benachrichtigungen wurden für diese Seite deaktiviert.&#13;Bitte lassen Sie Benachrichtigungen zu, um diese Option wählen zu können."
                    />
                  </td>
                ) : (
                  <td className="notification deadlineNotification" data-fieldtype="Push-Notification">
                    <input type="checkbox" onChange={this.handleCheck('deadlineReminder', 'notification')} checked={this.state.deadlineReminder_notification} />
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="foot">
          <button className="cancel" type="button" onClick={this.cancel.bind(this)}>
            Abbrechen
          </button>
          <button className="submit" disabled={!valid} type="button" onClick={this.submit.bind(this)}>
            Bestätigen
          </button>
        </div>
      </Dialog>
    )
  }
}
