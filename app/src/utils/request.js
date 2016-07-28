'use strict'
import deepAssign from 'deep-assign'

const host = 'http://127.0.0.1:3000'
// const host = ''

export function hasAuthToken() {
  return !!localStorage.token
}

export function setAuthToken(token) {
  localStorage.token = token
}

const authOptions = () => hasAuthToken() ? {headers: {Authorization: `JWT ${localStorage.token}`}} : {}

export function get(url, options = {}) {
  return fetch(`${host}${url}`, deepAssign({method: 'GET', mode: 'cors'}, authOptions(), options))
}

export function del(url, options = {}) {
  return fetch(`${host}${url}`, deepAssign({method: 'DELETE', mode: 'cors'}, authOptions(), options))
}

export function postJson(url, data, options = {}) {
  const defaultOpts = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  return fetch(`${host}${url}`, deepAssign(defaultOpts, authOptions(), options))
}

export function patchJson(url, data, options = {}) {
  const defaultOpts = {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  return fetch(`${host}${url}`, deepAssign(defaultOpts, authOptions(), options))
}

export function putJson(url, data, options = {}) {
  const defaultOpts = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  return fetch(`${host}${url}`, deepAssign(defaultOpts, authOptions(), options))
}