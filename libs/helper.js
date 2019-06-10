const mongoose = require('mongoose')
const mongodbUri = process.env.MONGODB_URI
const Tokens = require('../models/token_model.js')
const Users = require('../models/user_model.js')
const Logs = require('../models/logs_model.js')


const authenticateCheck = function (req, res, next) {
  const authToken = req.id()
  const path = req.path()

  if (path === '/api/login') {
    return next();
  }
  mongoose.connect(mongodbUri)
  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function() {
    Tokens.findById(authToken, function(err, token) {
      if (err) {
        return res.send(err)
      }

      if (token) {
       if (token.is_valid) {
         next()

         return {}
      }
    }

    return res.send(401, 'Unauthorized')
  })

  })

  return {}
}

const isadminCheck = function(authToken, res, next) {
  mongoose.connect(mongodbUri)
  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function() {
    Tokens.findById(authToken, function(err, token) {
      if (err) {

        return
      }
      Users.findById(token.user_id, function(errf, user) {
        if (!user.is_admin) {
          res.send('Not admin')

          return next(false)
        }

        return next()
      })
    })
  })
}


const tokenSave = function (req, res, user) {
  const upd = Users.where({'username': user.username})
  const date = Date()
  const userAgent = req.header('user-agent')
  const ip = req.header('x-real-ip')

  if (user.joined_at === null) {
    upd.update({'joined_at': date}, function(err1) {
      return err1
    })
  } else {
      upd.update({'last_login_at': date}, function(err2) {
        return err2
      })
  }

  const newToken = new Tokens({
    'created_at': user.created_at,
    'user_id': user.id
  })

  newToken.save(function(errst, newtoken) {
    if (errst) {
      return res.send(400, errst)
    }
    const newLog = new Logs({
      ip,
      'username': user.username,
      'login_at': date,
      'user_agent': userAgent,
      'token_id': newtoken.id
    })

    newLog.save(function(errl) {
      if (errl) {

        return res.send(400, errl)
      }

      return {}
    })

    return res.send(200, {
      'auth_token': newtoken.id,
      'full_name': user.full_name,
      'last_login_at': user.last_login_at,
      'username': user.username
    })
  })
}

module.exports = {
  'authenticate': authenticateCheck,
  'isadmin': isadminCheck,
  tokenSave
}
