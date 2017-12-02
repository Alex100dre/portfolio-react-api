import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Todo: Add uniqueness and email validations to email field
// timestamps: true add createdAt and updatedAt fields and manage it automatically
const schema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

// Check if the given password is valid.
schema.methods.isValidPassword = function isValidPassword(password){
  return bcrypt.compareSync(password, this.passwordHash);
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

export default mongoose.model('User', schema);
