const mongoose = require('mongoose');

const connectDB = async () => {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

  try {
    mongoose.set('strictQuery', false);
    // To allow for use of $ operators in query string like: { name: { $regex: '.*' } }

    await mongoose
      .connect(DB)
      .then(() => console.log('DB connection successful!'));
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
