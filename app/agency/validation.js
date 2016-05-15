import joi from 'joi';
import lodash from 'lodash';
import JoiError from '../errors/joi-error';
import constants from '../utility/constants';

const { AGENCY_STATUSES, AGENCY_STATUS } = constants;

function post(req, res, next) {
  const { agency } = req.body;
  const rules = {
    name: joi
      .string()
      .max(200)
      .required(),

    firstName: joi
      .string()
      .max(150)
      .required(),

    lastName: joi
      .string()
      .max(150)
      .required(),

    email: joi
      .string()
      .max(150)
      .email()
      .required(),

    phone: joi
      .string()
      .regex(/^[0-9]{10}$/)
      .required(),

    status: joi
      .any()
      .valid(AGENCY_STATUSES)
      .optional(),

    comment: joi
      .string()
      .max(250)
  };

  joi
    .validate(agency, rules, (err) => {
      if (err) {
        next(new JoiError(err));
      } else {
        next();
      }
    });
}

function put(req, res, next) {
  const { agency } = req.body;
  const rules = {
    name: joi
      .string()
      .max(200)
      .required(),

    firstName: joi
      .string()
      .max(150)
      .required(),

    lastName: joi
      .string()
      .max(150)
      .required(),

    email: joi
      .string()
      .max(150)
      .email()
      .required(),

    phone: joi
      .string()
      .regex(/^[0-9]{10}$/)
      .required(),

    status: joi
      .any()
      .valid(lodash.reject(AGENCY_STATUSES, (status) => status === AGENCY_STATUS.REQUESTED))
      .required(),

    comment: joi
      .string()
      .max(250)
  };

  joi
    .validate(agency, rules, (err) => {
      if (err) {
        next(new JoiError(err));
      } else {
        next();
      }
    });
}


export default { post, put };
