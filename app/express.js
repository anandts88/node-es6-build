import express from 'express';
import passport from 'passport';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressWinston from 'express-winston';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import httpStatus from 'http-status';
import passportJwt from 'passport-jwt';
import environment from './config/environment';
import winstonInstance from './config/winston';
import ApiError from './errors/api-error';
import routes from './routes';
import user from './models/user';
import connection from './database';

const app = express();
const MongoStore = connectMongo(session);
const { Strategy, ExtractJwt } = passportJwt;

if (environment.env === 'development') {
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
  secret: environment.secretKey,
	resave: false,
	saveUninitialized: false,
	name: environment.sessionId,
	cookie: {
		// secure: true, // This works for https connections only.
		ephemeral: true, // Delete cookie when browser is closed.
		httpOnly: true, // Prevents browser javascript from accessing cookies.
		expires: new Date(Date.now() + 3600000),
		maxAge: 3600000
	},
	store: new MongoStore({ mongooseConnection: connection })
}));

winstonInstance.info('Initializing Passport');

// Use the passport package in our application
app.use(passport.initialize());
app.use(passport.session());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(environment.authTokenHeader),
  secretOrKey: environment.secretKey
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

// enable detailed API logging in dev env
if (environment.env === 'development') {
	expressWinston.requestWhitelist.push('body');
	expressWinston.responseWhitelist.push('body');
	app.use(expressWinston.logger({
		winstonInstance,
    // optional: log meta data about request (defaults to true)
		meta: true,
		msg: `HTTP {{req.method}} {{req.url}}
      {{res.statusCode}} {{res.responseTime}}ms`,
    // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
		colorStatus: true
	}));
}

winstonInstance.info('Initializing /node-auth routes');

app.use((req, res, next) => {
  winstonInstance.log('Incoming Requests');
  next();
});

// mount all routes on /api path
app.use('/node-auth', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  winstonInstance.error('Global Error');
	if (!(err instanceof ApiError)) {
		const apiError = new ApiError(err.message, err.status, err.isPublic);

		return next(apiError);
	}

	return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  winstonInstance.error('Page Not found');
	const err = new ApiError('Page Not Found', httpStatus.NOT_FOUND);

	return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res) => {
  winstonInstance.error(err.Status);
	res.status(err.status).json({
		message: err.isPublic ? err.message : httpStatus[err.status],
		stack: environment.env === 'development' ? err.stack : {}
	});
});

export default app;
