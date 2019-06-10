const mongoose = require('mongoose')
const TSchema = mongoose.Schema;
const tokenSchema = new TSchema({
  'created_at': {'type': Date},
  'is_valid': {
    'default': true,
    'type': Boolean
   },
  'modified_at': {'type': Date},
  'user_id': {
     'required': true,
     'type': TSchema.Types.ObjectId
   }
})

module.exports = mongoose.model('tokens', tokenSchema);
