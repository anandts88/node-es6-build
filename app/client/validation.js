import joi from 'joi';
import JoiError from '../errors/joi-error';
import constants from '../utility/constants';

const { GENDERS } = constants;

function post(req, res, next) {
  const { client } = req.body;
  let rules = {
    firstName: joi
      .string()
      .max(150)
      .trim()
      .required(),

    lastName: joi
      .string()
      .max(150)
      .trim()
      .required(),

    email: joi
      .string()
      .max(150)
      .email()
      .trim()
      .required(),

    gender: joi
      .any()
      .valid(GENDERS)
      .required(),

    dob: joi
      .date()
      .iso()
      .required(),

    phone1: joi
      .string()
      .regex(/^[0-9]{10}$/)
      .required(),

    phone2: joi
      .string()
      .regex(/^[0-9]{10}$/)
      .optional(),

    address1: joi
      .string()
      .max(250)
      .trim()
      .required(),

    address2: joi
      .string()
      .trim()
      .max(250),

    state: joi
      .string()
      .max(2)
      .trim()
      .required(),

    city: joi
      .string()
      .max(150)
      .trim()
      .required(),

    zip: joi
      .string()
      .regex(/^[0-9]{5}(\-[0-9]{4})?$/)
      .max(11)
      .required(),

    role: joi
      .any()
      .forbidden(),

    country: joi
      .any()
      .forbidden(),

    timezone: joi
      .string()
      .max(100)
      .trim()
      .required(),

    agency: joi
      .any()
      .forbidden(),

    status: joi
      .any()
      .forbidden(),

    ssn: joi
      .string()
      .regex(/^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/)
      .max(11),

    race: joi
      .number()
      .required(),

    ethnicity: joi
      .number()
      .required(),

    insurance: joi
      .number()
      .required()
  };

  joi
    .validate(client, rules, (err) => {
      if (err) {
        next(new JoiError(err));
      } else {
        next();
      }
    });
}


export default { post };
