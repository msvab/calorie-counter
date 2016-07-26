export default class Auth {
  static async login() {
    try {
      const response = await doLogin()
      localStorage.role = response.user.role
      localStorage.token = response.token
      this.onChange(response.user)
      return response.user
    } catch(err) {
      this.onChange(false)
      throw err
    }
  }

  static get token() {
    return localStorage.token
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
    delete localStorage.token
    delete localStorage.role
    this.onChange(false)
  }

  static get loggedIn() {
    return !!this.token
  }

  static onChange() {}
}

// const host = 'http://127.0.0.1:3000'
const host = ''

async function doLogin() {
  const login = document.getElementById('login-form').querySelector('[name=login]').value.trim()
  const password = document.getElementById('login-form').querySelector('[name=password]').value.trim()

  const response = await fetch(`${host}/login`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: {login: login, password: password}
  });

  if (response.ok) {
    return await response.json()
  } else
    throw response.statusCode
}