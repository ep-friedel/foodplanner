import React from 'react'
import Pager from 'RAW/Pager.jsx'

const wording = {
  name: 'Name',
  email: 'E-Mail',
  rank: 'Rang',
  admin: 'Administrator',
  user: 'Nutzer',
  delete: 'Löschen',
}

export default class UserAdministration extends React.Component {
  constructor(props) {
    super()
  }
  renderWrapper(children) {
    return (
      <table className="textAlignCenter userList">
        <thead>
          <tr>
            <th>{wording.name}</th>
            <th>{wording.email}</th>
            <th>{wording.rank}</th>
            <th>{wording.delete}</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    )
  }

  render() {
    const { users, setAdmin, deleteUser, self } = this.props

    return <div>
        {users && <Pager wrapper={this.renderWrapper} size={20} bottom={true}>
            {users.sort((a, b) => a.name - b.name).map(user => <tr key={user.id} className={self == user.id ? 'self' : undefined}>
                <td>{user.name}</td>
                <td>{user.mail}</td>
                <td>
                  {user.admin ? <span key="word_admin" className="col_red">
                      {wording.admin}
                    </span> : null}
                  {user.admin && self != user.id ? <span key="down" className="fa fa-level-down pointer marginLeft" onClick={() => setAdmin({
                          user: user.id,
                          admin: false,
                        })} /> : null}
                  {!user.admin && <span key="word_user">{wording.user}</span>}
                  {!user.admin && <span key="up" className="fa fa-level-up pointer marginLeft" onClick={() => setAdmin({ user: user.id, admin: true })} />}
                </td>
                <td className="pointer" data-type={wording.delete}>
                  {self != user.id && <span className="fa fa-trash marginLeft" onClick={() => deleteUser({ user: user.id })} />}
                </td>
              </tr>)}
          </Pager>}
      </div>
  }
}