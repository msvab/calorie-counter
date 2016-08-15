import React from 'react'
import {render} from 'react-dom'
import {hashHistory, Router, Route, Link} from 'react-router'
import {routerMiddleware, syncHistoryWithStore, push} from 'react-router-redux'
import {Provider, connect} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import LoginPage from './pages/LoginPage'
import MealsPage from './pages/MealsPage'
import RegisterPage from './pages/RegisterPage'
import UsersPage from './pages/UsersPage'
import DailyCalorieCounter from './components/DailyCalorieCounter'
import Auth from './auth'
import rootReducer from './reducers/root'
import {setUser, fetchUserDetails, logout} from './actions/users'

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk, routerMiddleware(hashHistory)),
        window.devToolsExtension ? window.devToolsExtension() : f => f))

class App extends React.Component {

  updateAuth(user) {
    if (user) {
      store.dispatch(setUser(user))
    }
  }

  componentWillMount() {
    Auth.onChange = ::this.updateAuth
  }

  logOut(event) {
    event.preventDefault()
    Auth.logout()
    store.dispatch(logout())
    store.dispatch(push('/login'))
  }

  render() {
    const canManageUsers = Auth.loggedIn && (Auth.isAdmin() || Auth.isUserManager())
    const route = this.props.routing.locationBeforeTransitions.pathname
    return (
        <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <div className="navbar-brand">Calorie Counter</div>
                {Auth.loggedIn && Auth.isUser() && <DailyCalorieCounter/>}
              </div>

              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  {Auth.loggedIn || <li className={route === '/login' ? 'active' : ''}><Link to="/login">Login</Link></li>}
                  {Auth.loggedIn || <li className={route === '/register' ? 'active' : ''}><Link to="/register">Register</Link></li>}
                  {canManageUsers && <li className={route === '/users' ? 'active' : ''}><Link to="/users">Users</Link></li>}
                  {Auth.loggedIn && Auth.isAdmin() && <li className={route === '/meals' ? 'active' : ''}><Link to="/meals">Meals</Link></li>}
                </ul>

                <ul className="nav navbar-nav navbar-right">
                  <li>{Auth.loggedIn && <a href="#" onClick={::this.logOut}>Log Out</a>}</li>
                </ul>
              </div>
            </div>
          </nav>

          {this.props.children}
        </div>
    )
  }
}

const mapStateToProps = state => ({currentUser: state.currentUser, meals: state.meals, routing: state.routing})
const connectedApp = connect(mapStateToProps)(App)

function requireAuth(nextState, replace) {
  if (!Auth.loggedIn) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

const history = syncHistoryWithStore(hashHistory, store)

render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={connectedApp}>
          <Route path="login" component={LoginPage}/>
          <Route path="register" component={RegisterPage}/>
          <Route path="users" component={UsersPage} onEnter={requireAuth}/>
          <Route path="meals" component={MealsPage} onEnter={requireAuth}/>
        </Route>
      </Router>
    </Provider>
), document.getElementById('app'));

// fetch user details if logged in
if (Auth.loggedIn)
  store.dispatch(fetchUserDetails())
else
  store.dispatch(push('/login'))