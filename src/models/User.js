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

// Generate the Json Web Token
schema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
    email: this.email
  }, process.env.JWT_SECRET);
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    token: this.generateJWT()
  }
};

schema.plugin(uniqueValidator, {message: 'This email is already taken'});

export default mongoose.model('User', schema);
