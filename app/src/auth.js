export default class Auth {
  static async login() {
    try {
      const user = await doLogin()
      localStorage.role = user.role
      localStorage.token = Math.random().toString(36).substring(7)
      this.onChange(user)
      return user
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
  let response = await fetch(`${host}/login`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: new FormData(document.getElementById('login-form'))
  });

  if (response.ok) {
    return await response.json()
  } else
    throw response.statusCode
}