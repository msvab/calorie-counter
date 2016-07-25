import React from 'react'
import {withRouter} from 'react-router'
import Auth from '../auth'

class Login extends React.Component {
  state = {
    error: false
  }

  async handleSubmit(event) {
    event.preventDefault()

    try {
      const user = await Auth.login()
      const {location} = this.props

      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname)
      } else {
        this.props.router.replace(user.role === 'USER_MANAGER' ? '/users' : '/meals')
      }
    } catch (err) {
      this.setState({error: true})
    }
  }

  render() {
    return (
        <div className="container">
          <form id="login-form" onSubmit={::this.handleSubmit} className="form-signin">
            <h2>Please Login</h2>
            <label htmlFor="login">Login</label>
            <input name="login" className="form-control"/>
            <label>Password</label>
            <input name="password" className="form-control"/>
            <br />
            <button type="submit" className="btn btn-default">Login</button>
          </form>
          {this.state.error && (
              <p>Wrong login or password</p>
          )}
        </div>
    )
  }
}

export default withRouter(Login)