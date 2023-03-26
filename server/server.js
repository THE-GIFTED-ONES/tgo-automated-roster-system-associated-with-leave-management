const dotenv = require('dotenv');
const connectDB = require('./config/dbconnect');

//Handle uncaught exceptions:
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

//Database Connection:
connectDB();

//Display ENVIROMENT
console.log(`Enviroment: ${process.env.NODE_ENV}Stage`);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Handle unhandled promise rejections:
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
