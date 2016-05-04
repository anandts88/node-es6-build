import httpStatus from 'http-status';
import jwtSimple from 'jwt-simple';
import environment from '../config/environment';
import ApiError from '../errors/api-error';
import User from '../models/user';

const { FORBIDDEN, UNAUTHORIZED } = httpStatus;

function authenticate(req, res, next) {
  const tokenHeader = req.headers[environment.authTokenHeader];
  const sessionToken = req.session.token;
  let token;
  let userName;

  if (!tokenHeader) {
    return next(
      new ApiError('Authentication fails', UNAUTHORIZED));
  }

  try {

    if (tokenHeader !== sessionToken) {
      return next(
        new ApiError('Authentication fails', UNAUTHORIZED));
    }

    token = jwtSimple.decode(tokenHeader, environment.secretKey);

    if (token.expires <= Date.now()) {
			return next(
        new ApiError('Authentication fails', UNAUTHORIZED));
		}

    userName = token.userName;

    if (!userName) {
      return next(
        new ApiError('Authentication fails', UNAUTHORIZED));
    }

    if (req.session.user.userName !== userName) {
      return next(
        new ApiError('Authentication fails', UNAUTHORIZED));
    }

    User
      .findOne({ userName })
      .exec()
      .then((user) => {
        if (!user) {
          return next(
            new ApiError('Authentication fails', UNAUTHORIZED));
        }

        next();
      })
      .catch((err) => {
        next(err);
      });

  } catch (err) {
    return next(new ApiError('Authentication fails', UNAUTHORIZED));
  }
}

function authorize(roles) {
  return (req, res, next) => {
    const { user } = req.session;

    if (roles && roles.indexOf(user.role) === -1) {
      return next(new ApiError('Authorization fails', FORBIDDEN));
    }
    next();
  };
}

export default { authenticate, authorize };
