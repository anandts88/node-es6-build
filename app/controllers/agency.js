import Agency from '../models/agency';
import agencyService from '../services/agency';
import ValidationError from '../errors/validation-error';
import SqlError from '../errors/sql-error';
import winstonInstance from '../config/winston';

function post(req, res, next) {
  const { name } = req.body.agency;
  const validators = {
    'agency.name': {
      notEmpty: true
    }
  };
  let errors;
  let agency;

  req.checkBody(validators);

  errors = req.validationErrors();

  if (errors) {
    winstonInstance.info('Validation Fails');
    next(new ValidationError(errors));
  } else {
    agency = new Agency({ name });

    agencyService
      .save(agency)
      .then((agency) => {
        res.json({ agency });
      })
      .catch((err) => {
        next(new SqlError(err));
      });
  }
}

export default { post };
