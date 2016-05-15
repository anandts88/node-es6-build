import joi from 'joi';
import lodash from 'lodash';
import JoiError from '../errors/joi-error';
import constants from '../utility/constants';

const { GENDERS } = constants;

function post(req, res, next) {
  const { agency } = req.body;
  const session = req.session.user;
  let rules = {
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

    dob: joi
      .date()
      .iso()
      .max('now')
      .required(),

    gender: joi
      .any()
      .valid(GENDERS)
      .string()
      .required(),

    ssn: joi
      .string()
      .regex(/^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/),

    phone1: joi
      .string()
      .regex(/^[0-9]{10}$/)
      .required(),

    phone2: joi
      .string()
      .regex(/^[0-9]{10}$/),

    address1: joi
      .string()
      .max(150)
      .required(),

    address2: joi
      .string()
      .max(150),

    city: joi
      .string()
      .max(150)
      .required(),

    state: joi
      .string()
      .max(150)
      .required(),

    zip: joi
      .string()
      .reqex(/^[0-9]{5}(\-[0-9]{4})?$/)
      .required()
  };

  // If user is not logged in then agency id is mandatory
  if (!session) {
    rules = lodash.assign(rules, {
      agency: joi
        .number()
        .required()
    });
  }

  joi
    .validate(agency, rules, (err) => {
      if (err) {
        next(new JoiError(err));
      } else {
        next();
      }
    });
}

export default { post };
