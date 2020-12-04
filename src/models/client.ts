import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema({
  client_name: String,
  client_uri: String,
  client_description: String,
  logo_uri: String,
  client_id_issued_at: Number,
  client_secret: {
    type: String,
    select: false,
  },
  client_secret_expires_at: Number,
  application_type: {
    type: String,
    enum: [ 'web', 'native', 'browser', 'service']
  },
  redirect_uris: {
    type: [String]
  },
  response_types: {
    type: String,
    enum: [ 'code', 'token' ],
  },
  grant_types: {
    type: [String],
    enum: [ 'authorization_code', 'implicit', 'password', 'refresh_token', 'client_credentials' ]
  },
  policy_uri: String,
})

export default mongoose.model('Client', clientSchema);

