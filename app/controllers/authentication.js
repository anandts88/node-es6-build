import httpStatus from 'http-status';
import jwtSimple from 'jwt-simple';
import environment from '../config/environment';
import ApiError from '../errors/api-error';
import User from '../models/user';

function authenticate(req, res, next) {
  const tokenHeader = req.headers[environment.authTokenHeader];
  const sessionToken = req.session.token;
  let token;
  let userName;

  if (!tokenHeader) {
    return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
  }

  try {

    if (tokenHeader !== sessionToken) {
      return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
    }

    token = jwtSimple.decode(tokenHeader, environment.secretKey);

    if (token.expires <= Date.now()) {
			return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
		}

    userName = token.userName;

    if (!userName) {
      return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
    }

    if (req.session.user.userName !== userName) {
      return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
    }

    User.findOne({ userName }).exec().then((user) => {
      if (!user) {
        return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
      }

      next();
    }).error((err) => {
      next(err);
    });

  } catch(err) {
    return next(new ApiError('Authentication fails', httpStatus.UNAUTHORIZED));
  }
}

export default { authenticate };
