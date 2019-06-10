const mongoose = require('mongoose')
const USchema = mongoose.Schema;
const userSchema = new USchema({
  'created_at': {'type': Date},

  'full_name': {
    'maxlength': 50,
    'minlength': 4,
    'pattern': '^[a-zA-Z]+$',
    'required': true,
    'type': String
  },

  'is_admin': {
    'default': false,
    'required': true,
    'type': Boolean
  },

  'joined_at': {'type': Date},

  'last_login_at': {'type': Date},

  'modified_at': {'type': Date},

  'password': {
    'maxlength': 25,
    'minlength': 10,
    'pattern': '^[a-zA-Z]+$',
    'required': true,
    'type': String
  },

  'password_salt': {
    'required': true,
    'type': String
  },

  'status': {
    'default': 'active',
    'enum': [
      'active',
      'blocked',
      'not_confirmed'
    ],
    'required': true,
    'type': String
  },
  'username': {
    'maxlength': 15,
    'minlength': 5,
    'pattern': '^[a-zA-Z]+$',
    'required': true,
    'type': String,
    'unique': true
  }
});

module.exports = mongoose.model('users', userSchema);
