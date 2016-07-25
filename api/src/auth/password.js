'use strict'
const scrypt = require("scrypt-for-humans");

const encryptPassword = scrypt.hash
const verifyPassword = scrypt.verifyHash

module.exports = {
  encryptPassword,
  verifyPassword
}