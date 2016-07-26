'use strict'
import {hasAuthToken, postJson, setAuthToken} from './actions/request-utils'

export default class Auth {
  static async login() {
    try {
      const response = await doLogin()
      localStorage.role = response.user.role
      setAuthToken(response.token)
      this.onChange(response.user)
      return response.user
    } catch(err) {
      this.onChange(false)
      throw err
    }
  }

  static isAdmin() {
    return localStorage.role && localStorage.role === 'ADMIN'
  }

  static isUserManager() {
    return localStorage.role && localStorage.role === 'USER_MANAGER'
  }

  static isUser() {
    return localStorage.role && localStorage.role === 'USER'
  }

  static logout() {
    setAuthToken(null)
    delete localStorage.role
    this.onChange(false)
  }

  static get loggedIn() {
    return hasAuthToken()
  }

  static onChange() {}
}

async function doLogin() {
  const login = document.getElementById('login-form').querySelector('[name=login]').value.trim()
  const password = document.getElementById('login-form').querySelector('[name=password]').value.trim()

  const response = await postJson('/login', {login: login, password: password})

  if (response.ok) {
    return await response.json()
  } else
    throw response.statusCode
}