import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

// Todo: Add uniqueness and email validations to email field
// timestamps: true add createdAt and updatedAt fields and manage it automatically
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  confirmationToken: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Check if the given password is valid.
schema.methods.isValidPassword = function isValidPassword(password){
  return bcrypt.compareSync(password, this.passwordHash);
};

// Set passwordHash from a clear password.
schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

// Generate and set the confirmation token.
schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

// Generate the confirmation url.
schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`
}

// Generate the confirmation url.
schema.methods.generateResetPasswordUrl = function generateResetPasswordUrl() {
  return `${process.env.HOST}/reset-password/${this.generateResetPasswordToken()}`
}

// Generate the Json Web Token
schema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
    email: this.email,
    confirmed: this.confirmed
  }, process.env.JWT_SECRET);
};

// @Todo: make it more secure.
// Generate the Reset Password Json Web Token
schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  return jwt.sign(
    {
      _id: this._id // _id because mongodb use _ for the id.
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    token: this.generateJWT()
  }
};

schema.plugin(uniqueValidator, {message: 'This email is already taken'});

export default mongoose.model('User', schema);
