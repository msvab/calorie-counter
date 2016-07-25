import React from 'react'
import {connect} from 'react-redux'
import {createUser} from '../actions'

class RegisterPage extends React.Component {

  handleSubmit(event) {
    event.preventDefault()

    const login = document.getElementById('login').value
    const password = document.getElementById('password').value
    const role = 'USER'
    this.props.dispatch(createUser({login, password, role}, '/login'))
  }

  render() {
    return (
        <div className="container">
          <form onSubmit={::this.handleSubmit} className="form-signin">
            <h2>Registration</h2>
            <label>Login</label>
            <input id="login" className="form-control"/>
            <label>Password</label>
            <input id="password" className="form-control"/>
            <br />
            <button type="submit" className="btn btn-default">Register</button>
          </form>
        </div>
    )
  }
}

export default connect()(RegisterPage)