import lodash from 'lodash';
import Model from '../models/user';
import SqlError from '../errors/sql-error';
import ApiError from '../errors/api-error';
import constants from '../utility/constants';

const {
  USER_STATUS,
  ROLE
} = constants;

function post(req, res, next) {
  const agency = 1;
  const { client } = req.body;
  const clientProps = [
    'ssn',
    'race',
    'ethnicity',
    'insurance'
  ];
  let User;
  let _client;
  let query;

  _client = lodash.assign(client, {
    client: lodash.pick(client, clientProps),
    role: ROLE.CLIENT,
    status: USER_STATUS.ACTIVE,
    agency
  });

  // Query to check if email id already present in the system.
  query = lodash.pick(_client, [
    'email'
  ]);

  Model
    .findOne(query)
    .exec()
    .then((_user) => {
      if (!lodash.isEmpty(_user)) {
        throw new ApiError('Client already present in the system.');
      }

      // Query to check if same client already present in the system.
      query = lodash.pick(_client, [
        'agency',
        'firstName',
        'lastName',
        'address1',
        'address2',
        'city',
        'state',
        'zip',
        'role',
        'gender'
      ]);

      query = lodash.assign(query, {
        dob: new Date(_client.dob)
      });

      return Model
        .find(query)
        .exec();
    })
    .then((_user) => {
      if (!lodash.isEmpty(_user)) {
        throw new ApiError('Client already present in the system.');
      }

      User = new Model(lodash.omit(_client, clientProps));

      return User.save();
    })
    .then((client) => {
      res.json({ client });
    })
    .catch((err) => {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(new SqlError(err));
    });
}

function put(req, res, next) {
  const { id } = req.params;
  const { client } = req.body;

  Model
    .findById(id)
    .then((_client) => {
      if (_client) {
        return lodash
          .assign(_client, client)
          .save();
      }
      throw new ApiError('Client not found.');
    })
    .then((client) => {
      res.json({ client });
    })
    .catch((err) => {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(new SqlError(err));
    });
}


export default { post, put };
