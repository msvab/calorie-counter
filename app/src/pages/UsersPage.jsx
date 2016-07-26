'use strict'
import React from 'react'
import {connect} from 'react-redux'

import actions from '../actions'
import UserForm from '../components/UserForm'

class UsersPage extends React.Component {

  toggleForm() {
    this.props.dispatch(actions.toggleCreateUser())
  }

  editUser(id) {
    this.props.dispatch(actions.showEditUser(id))
  }

  deleteUser(id) {
    this.props.dispatch(actions.deleteUser(id));
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchUsers());
  }

  render() {
    return (
        <div className="container">
          {this.props.users.create
              ? <UserForm dispatch={this.props.dispatch}/>
              : <button onClick={::this.toggleForm} className="btn btn-default pull-right btn-sm">Add User</button>}
          <br/>
          <table className="table table-condensed">
            <thead>
              <tr>
                <th width="200">Login</th>
                <th width="200">Role</th>
                <th width="300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.props.users.list.map(user => {
                return (
                    <tr key={user.login}>
                      {this.props.users.edit === user.login
                          ? <td colSpan="3"><UserForm user={user} dispatch={this.props.dispatch}/></td>
                          : [
                              <td key="login">{user.login}</td>,
                              <td key="role">{user.role}</td>,
                              <td key="action">
                                <button onClick={this.editUser.bind(this, user.login)} className="btn btn-default btn-sm">Edit</button>
                                {this.props.currentUser.login !== user.login
                                    && <button onClick={this.deleteUser.bind(this, user.login)}
                                               className="btn btn-default btn-sm">Delete</button>
                                }
                              </td>
                            ]
                      }
                    </tr>
                )
              })}
            </tbody>
          </table>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {users: state.users, currentUser: state.currentUser};
}

export default connect(mapStateToProps)(UsersPage)