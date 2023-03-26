const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    empName: {
      type: String,
      required: [true, `Enter Employee's name !!`],
    },
    email: {
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
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
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
    intialpasswordResetToken: String,
    firstlogin: {
      type: Boolean,
      default: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    avaliableLeaves: {
      causal: {
        type: Number,
        default: 7,
      },
      sick: {
        type: Number,
        default: 21,
      },
      annual: {
        type: Number,
        default: 14,
      },
    },
    leavesTaken: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leave-Request',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
      },
    },
    toObject: { virtuals: true },
  }
);

// //? VIRTUAL POPULATE
// userSchema.virtual('leavesTaken', {
//   ref: 'Leave-Request',
//   foreignField: 'User',
//   localField: '_id',
// });

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

// userSchema.pre('save', function (next) {
//   // 01.) Check Whether user's first login
//   if (this.firstlogin === false) return next;

//   // 02.) Generate random reset token
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   // 03.) Store hashed reset token in database
//   this.intialpasswordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   // 04.) Go to next middleware
//   next();
// });

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  // Reduce the time taken to the save database (assumption)
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

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createInitialPasswordResetToken = async function () {
  if (this.firstlogin) {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.intialpasswordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await this.save({ validateBeforeSave: false });
    return resetToken;
  }
};

userSchema.methods.updateLeaves = async function (type, noofdays, leaveID) {
  if (type === 'casual') {
    this.avaliableLeaves.causal -= noofdays;
  } else if (type === 'sick') {
    this.avaliableLeaves.sick -= noofdays;
  } else if (type === 'annual') {
    this.avaliableLeaves.annual -= noofdays;
  }
  this.leaveTaken = [];
  this.leaveTaken.push(leaveID);
  await this.save({ validateBeforeSave: false });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
