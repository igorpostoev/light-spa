const mongoose = require('mongoose')
const LSchema = mongoose.Schema;
const logsSchema = new LSchema({
  'ip': {'type': String},
  'login_at': {'type': Date},
  'user_agent': {'type': String},
  'username': {'type': String},
  'token_id': {'type': LSchema.Types.ObjectId}
})

module.exports = mongoose.model('logs', logsSchema);
