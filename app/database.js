import Promise from 'bluebird';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import environment from './config/environment';
import winston from './config/winston';

// promisify mongoose
Promise.promisifyAll(mongoose);
mongoose.Promise = Promise;

winston.info('Creating database connection.');

// connect to mongo db
const connection = mongoose.createConnection(environment.db, {
  server: {
    socketOptions: { keepAlive: 1 }
  },
  poolSize: 5
});

connection.on('error', () => {
  winston.info('Problem creating connection to database.');
  throw new Error(`Not able to connect to database: ${environment.db}`);
});

connection.once('open', function() {
  winston.info('Database connection established!');
});

const gracefulExit = () => {
  connection.close(() => {
    winston.info('Closing database connection.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

autoIncrement.initialize(connection);

export default connection;
