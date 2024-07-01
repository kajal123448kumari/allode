import {Schema,model}from 'mongoose';

const verificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h'
  }
});

const emailVerification = model('emailVerification', verificationSchema);

export default emailVerification;
