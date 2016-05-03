import httpStatus from 'http-status';
import jwtSimple from 'jwt-simple';
import moment from 'moment';
import environment from '../config/environment';
import User from '../models/user';
import ApiError from '../errors/api-error';
import winston from '../config/winston';

function login(req, res, next) {
  const { userName, password } = req.body.session;

  winston.info('Performing Login');

  User.findOne({ userName }).exec().then((user) => {
    const { role } = user;

    winston.info('Performing Login');
    if (!user) {
      winston.error('Authentication Fails');
      return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
    }

    winston.info('Comparing password');
    user.comparePassword(password, (err, matched) => {
      let expires;
      let token;

      // If password not matched.
      if (err || !matched) {
        winston.error('Password not matched');
        return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
      }

      winston.info('Password matched');
      expires = moment().add(1, 'days').valueOf();

      winston.info('Creating token');
      token = jwtSimple.encode({ userName, expires }, environment.secretKey);

      // Set token in session
      req.session.token = token;
      req.session.user = user;

      winston.info(`Send token ${token}`);

      // Send token back.
      res.setHeader(environment.authTokenHeader, token);

      winston.info('Sending response');
      res.json({
        session: { userName, role }
      });
    });

  }).error(() => {
    winston.error('Authentication Fails');
    next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
  });
}

function logout (req, res) {
  req.logout();
  req.session.destroy();
  res.statusCode = httpStatus.NO_CONTENT;
  res.end();
}

export default { login, logout };
