import React from 'react'
import {createUser, updateUser} from '../actions/users'

export default class UserForm extends React.Component {
  static propTypes = {
    user: React.PropTypes.shape({
      login: React.PropTypes.string,
      password: React.PropTypes.string,
      role: React.PropTypes.oneOf(['ADMIN', 'USER_MANAGER', 'USER'])
    }),
    dispatch: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    user: {login: '', password: '', role: 'USER'}
  }

  state = {
    error: ''
  }

  async saveUser(event) {
    event.preventDefault()

    const login = this.props.user.login ? this.props.user.login : event.target.querySelector('[name=login]').value.trim()
    const password = event.target.querySelector('[name=password]').value.trim()
    const roleSelect = event.target.querySelector('[name=role]');
    const role = roleSelect.options[roleSelect.selectedIndex].value

    const user = {login: login, role: role}
    if (password) user.password = password

    if (this.props.user.login)
      this.props.dispatch(updateUser(user))
    else if (user.password)
      this.props.dispatch(createUser(user))
    else
      this.setState({error: 'Password is required!'})
  }

  render() {
    return (
        <form onSubmit={::this.saveUser} className="form-inline">
          {this.props.user.login
            ? <span className="margin-right">{this.props.user.login}</span>
            : <input type="text" maxLength="100" name="login" className="form-control"
                     defaultValue={this.props.user.login} placeholder="Login"/>}

          <input type="password" name="password" className="form-control" placeholder="Password"/>

          <select required="true" name="role" defaultValue={this.props.user.role} className="form-control">
            <option value="ADMIN">Administrator</option>
            <option value="USER_MANAGER">User Manager</option>
            <option value="USER">User</option>
          </select>

          {this.state.error && <span className="error">{this.state.error}</span>}

          <button type="submit" className="btn btn-default btn-sm">Save</button>
        </form>
    )
  }
}
