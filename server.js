const restify = require('restify')
const mongoose = require('mongoose')
const blake = require('blakejs')
const randomstring = require('randomstring')
const Users = require('./models/user_model.js')
const Tokens = require('./models/token_model.js')
const Logs = require('./models/logs_model.js')
const helper = require('./libs/helper.js')
const loginEnd = require('./endpoints/login.js')
const server = restify.createServer({})
const mongodbUri = process.env.MONGODB_URI
const masterPassword = process.env.MASTER_PASSWORD

server.use(restify.plugins.jsonBodyParser({'mapParams': true}))
server.pre(restify.plugins.pre.reqIdHeaders({'headers': ['x-auth-token']}))
server.pre(helper.authenticate)

server.post('/api/login', function(req, res) {
    mongoose.connect(mongodbUri)
    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        Users.find({'username': req.body.username}, function(err, users) {

        if (err) {
            return res.send(401, 'Authentication failed')
        }

        return loginEnd.loginbody(req, res, users)
    })
    })
})

server.get(
    '/api/users',
    function(req, res, next) {
        const authToken = req.header('x-auth-token')

        helper.isadmin(authToken, res, next)
    },
    function(req, res) {
        mongoose.connect(mongodbUri)
        const db = mongoose.connection

        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
            Users.find({}, function(errf, found) {
                if (errf) {
                    return res.send(errf)
                }

                return res.send(found)
            })
        })
    }
)

server.get(
    '/api/logs',
    function(req, res, next) {
        const authToken = req.header('x-auth-token')

        helper.isadmin(authToken, res, next)
    },
    function(req, res) {
        mongoose.connect(mongodbUri)
        const db = mongoose.connection

        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
            Logs.find({}, function(errf, found) {
                if (errf) {
                    return res.send(errf)
                }

                return res.send(found)
            })
        })
    }
)

server.get(
    '/api/users/:user_id',
    function(req, res) {
    const index = 0
    const path = req.path()
    const regpath = path.match(/([^/]*)\/*$/)[index]

        mongoose.connect(mongodbUri)
        const db = mongoose.connection

        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
            Users.find({'username': regpath}, function(errf, found) {
                if (errf) {
                    return res.send(errf)
                }

                return res.send(found)
            })
        })
    }
)

server.post(
    '/api/users',
    function(req, res, next) {
        const authToken = req.header('x-auth-token')
        const resultPass = req.body.password.match(/^[a-zA-Z]+$/)
        const passLength = req.body.password.length

        if (passLength >= 8 && passLength <= 12) {
            if (resultPass === null) {
                res.send(400, 'Password wasnt specified correctly')

                return next(false)
            }

            return helper.isadmin(authToken, res, next)
        }
        res.send(400, 'Password length wasnt specified correctly')

        return next(false)
        },
    function(req, res) {
        mongoose.connect(mongodbUri)
        const db = mongoose.connection
        const newUserBody = req.body
        const salt = randomstring.generate(8)
        const password = blake.blake2bHex(
            newUserBody.password,
            masterPassword + salt, 12
        )

        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
            const newUser = new Users({
                password,
                'is_admin': newUserBody.is_admin,
                'full_name': newUserBody.full_name,
                'password_salt': salt,
                'username': newUserBody.username
            })

            newUser.save(function(errsu, user) {
                if (errsu) {
                    return res.send(400, errsu)
                }
                user.createdAt = Date()

                return res.send(201, {
                    'success': true,
                    'user': {
                        'created_at': user.created_at,
                        'full_name': user.full_name,
                        'id': user.id,
                        'is_admin': user.is_admin,
                        'joined_at': user.joined_at,
                        'last_login': user.last_login,
                        'modified_at': user.modified_at,
                        'status': user.status,
                        'username': user.username
                    }

                })
            })
        })
    }
    )

server.post('/api/users/:user_id', function(req, res) {
    const index = 0
    const path = req.path()
    const regpath = path.match(/([^/]*)\/*$/)[index]
    const tindex = req.header('x-auth-token')

    mongoose.connect(mongodbUri)
    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function () {
        Tokens.findById(req.rawHeaders[tindex], function(erri, token) {
            if (token) {
             if (token.is_valid) {
                Users.findById(token.user_id, function(errt, user) {
                    if (!user.is_admin) {
                     if (user.username === regpath) {
                       const updt = Users.where({'username': regpath})

                        updt.setOptions({'runValidators': true})
                        updt.update(
                            {
                                'full_name': req.body.full_name,
                                'modified_at': Date(),
                                'username': req.body.username
                            },
                            function(error) {
                                if (error) {
                                return res.send(error)
                            }

                                Users.find(
                                {'username': req.body.username},
                                function(errf, found) {
                                 return res.send({
                                    'success': true,
                                    'user': {
                                        'full_name': found[0].full_name,
                                        'username': found[0].username
                                    }
                                })

                             }
                             )

                            return {}
                            }
                        )

                    } else {
                        return res.send(401, 'Permission denied')
                    }
                } else if (user.is_admin) {
                    Users.find({'username': regpath}, function(errc, seek) {
                        if (seek.length === 0) {
                            return res.send('Unknown User')
                        }
                        const updt = Users.where({'username': regpath})

                        updt.setOptions({'runValidators': true})

                        updt.update(
                        {
                            'full_name': req.body.full_name,
                            'is_admin': req.body.is_admin,
                            'modified_at': Date(),
                            'password': req.body.password,
                            'status': req.body.status,
                            'username': req.body.username
                        },
                        function(error) {
                            if (error) {
                                return res.send(error)
                            }

                        Users.find(
                            {'username': req.body.username},
                            function(errf, found) {
                                return res.send({
                                    'success': true,
                                    'user': {
                                        'full_name': found[0].full_name,
                                        'id': found[0].id,
                                        'joined_at': found[0].joined_at,
                                        'last_login': found[0].last_login,
                                        'modified_at': found[0].modified_at,
                                        'username': found[0].username
                                    }
                                }) 
                            }
                        )

                        return {}
                        }
                        )

                        return {}
                    })
                }

                return {}
            })
            } else {
                return res.send(401, 'Token isnt valid')
            }
        } else {
            return res.send(401, 'Unauthorized')
        }

        return 0
    })
    })
})


server.del(
    '/api/users/:user_id',
    function(req, res, next) {
        const authToken = req.header('x-auth-token')

        helper.isadmin(authToken, res, next)
    },
    function(req, res) {
        const index = 0
        const path = req.path()
        const regPath = path.match(/([^/]*)\/*$/)[index]

        mongoose.connect(mongodbUri)
        const db = mongoose.connection

        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
            Users.find({'username': regPath}, function(errf, user) {
                if (errf) {
                    return res.send(401, errf)
                }
                Users.remove({'username': user[0].username}, function(erru) {
                    if (erru) {
                        return res.send(401, erru)
                    }
                    Tokens.remove({'user_id': user[0].id}, function(errt) {
                        if (errt) {
                            return res.send(401, errt)
                        }

                        return res.send(200, {'success': true})
                    })

                return {}
                })

                return {}
            })
      })
    }
    )

server.listen(process.env.REST_API_PORT, function () {
    console.log('%s listening at %s', server.name, server.url)
})

