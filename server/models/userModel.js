const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  emp_name: {
    type: String,
    required: [true, `Enter Employee's name !!`],
  },
  emp_email: {
    type: String,
    required: [true, `Enter Employee's email !!`],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  empID: {
    type: String,
    unique: true,
    required: [true, `Enter Employee's ID !!`],
  },
  photo: String,
  jobTitle: {
    type: String,
    required: [true, `Enter Employee's job title !!`],
    default: 'Junior Software Engineer',
  },
  departments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  leavesTaken: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leave',
    },
  ],
  
  password: {
    type: String,
    required: [true, `Enter Employee's password !!`],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, `Confirm Employee's password !!`],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//?PRE-MIDDLEWARE - DOCUMENT MIDDLEWARE: runs before .save() and .create()

userSchema.pre('save', async function (next) {
  //This function will run only if the password is modified
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //?cost parameter- Measure how cpu intensive this operation will be.

  //To remove passwordConfirm field from the database
  this.passwordConfirm = undefined;

  //To move to the next middleware
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  //?To make sure that the token is issued before the password is changed. Saving to the database takes some time. So we subtract 1 second from the current time. So that the token is issued before the password is changed.
  next();
});

userSchema.pre(/^find/, function (next) {
  // ^find - find all the strings that start with find.
  // this points to the current query
  this.find({ active: { $ne: false } });
  // $ne - not equal to. So we are finding all the documents where active is not equal to false.
  next();
});

//?INSTANCE METHOD - available on all documents of a certain collection

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //this.password is not available here because select is set to false. So we need to pass the userPassword as an argument
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordafter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    //Default value of passwordChangedAt is undefined. If it is defined, that means password has been changed.
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //False means not Changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Create a model from the schema
const User = mongoose.model('User', userSchema);
// Export the model
module.exports = User;
