import express from 'express';
import passport from 'passport';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import httpStatus from 'http-status';
import passportJwt from 'passport-jwt';
import environment from './config/environment';
import winstonInstance from './config/winston';
import ApiError from './errors/api-error';
import JoiError from './errors/joi-error';
import SqlError from './errors/sql-error';
import routes from './routes';
import user from './models/user';
import connection from './database';

const app = express();
const MongoStore = connectMongo(session);
const { Strategy, ExtractJwt } = passportJwt;
const {
  env,
  secretKey,
  sessionId,
  sessionTimeout,
  authTokenHeader
} = environment;

if (env === 'development') {
  app.use(logger('dev'));
}

winstonInstance.info('Initializing Body Parser');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

winstonInstance.info('Initializing Cookie Parser');
app.use(cookieParser());

winstonInstance.info('Initializing Session');
app.use(session({
  secret: secretKey,
	resave: false,
	saveUninitialized: false,
	name: sessionId,
	cookie: {
		// secure: true, // This works for https connections only.
		ephemeral: true, // Delete cookie when browser is closed.
		httpOnly: true, // Prevents browser javascript from accessing cookies.
		expires: new Date(Date.now() + sessionTimeout),
		maxAge: sessionTimeout
	},
	store: new MongoStore({ mongooseConnection: connection })
}));

winstonInstance.info('Initializing Passport');

// Use the passport package in our application
app.use(passport.initialize());
app.use(passport.session());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(authTokenHeader),
  secretOrKey: secretKey
};

passport.use(new Strategy(jwtOptions, (payload, callback) => {
  user
    .findOne({ id: payload.id })
    .exec()
    .then((user) => {
      callback(undefined, user);
    })
    .catch((err) => {
      callback(err);
    });
}));

winstonInstance.info('Initializing /node-auth routes');

app.use((req, res, next) => {
  winstonInstance.log('Incoming Requests');
  next();
});

// mount all routes on /api path
app.use('/node-auth', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  winstonInstance.error(`On Error ${JSON.stringify(err)}`);

  if (err instanceof JoiError) {
    return res.status(err.status).json(err.validations);
  }

  if (err instanceof SqlError) {
    return res.status(err.status).json(err.errors);
  }

  return res.status(err.status).json({
    errors: [
      {
        id: err.id || 500,
        message: err.message
      }
    ]
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  winstonInstance.error('Page Not found');
	const err = new ApiError('Page Not Found', httpStatus.NOT_FOUND);

	return next(err);
});


export default app;
