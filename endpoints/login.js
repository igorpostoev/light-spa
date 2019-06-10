const helper = require('../libs/helper.js')
const blake = require('blakejs')
const masterPassword = process.env.MASTER_PASSWORD
const login = function(req, res, users) {
  const index = 0
  let user = null

  return (function() {
    if (users.length === 0) {
      return res.send(401, 'Account does not exist')
    }
    user = users[index]
    const password = blake.blake2bHex(
      req.body.password,
      masterPassword + user.password_salt,
      12
    )

    if (user.password !== password) {
      return res.send(401, 'Password isnt correct')
    }
    if (user.status !== 'active') {
      return res.send(401, 'Status isnt active)')
    }

    return helper.tokenSave(req, res, user)
  }())
}

module.exports = {'loginbody': login}
