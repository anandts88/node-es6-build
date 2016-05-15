import lodash from 'lodash';
import Model from './model';
import SqlError from '../errors/sql-error';
import ApiError from '../errors/api-error';

function post(req, res, next) {
  const { agency } = req.body;
  const Agency = new Model(agency);

  Agency
    .save()
    .then((agency) => {
      res.json({ agency });
    })
    .catch((err) => {
      next(new SqlError(err));
    });
}

function put(req, res, next) {
  const { id } = req.params;
  const { agency } = req.body;

  Model
    .findById(id)
    .then((_agency) => {
      if (_agency) {
        return lodash
          .assign(_agency, agency)
          .save();
      }
      throw new ApiError('Agency not found.');
    })
    .then((agency) => {
      res.json({ agency });
    })
    .catch((err) => {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(new SqlError(err));
    });
}


export default { post, put };
