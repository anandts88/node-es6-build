import Promise from 'bluebird';
import lodash from 'lodash';
import ApiError from '../errors/api-error';
import Model from '../models/user';
import constants from '../utility/constants';

const CLIENT_FILEDS = [
  'ssn',
  'race',
  'ethnicity',
  'insurance'
];

const {
  ROLE
} = constants;

export default {
  clientToUser(client) {
    let _client = lodash.pick(client, CLIENT_FILEDS);
    let user;

    user = lodash.assign(client, {
      client: _client,
      role: ROLE.CLIENT
    });

    user = lodash.omit(user, CLIENT_FILEDS);

    return user;
  },

  userToClient(user) {
    let _client = lodash.pick(user.client, CLIENT_FILEDS);
    let client = lodash.assign(user, _client);

    client = lodash.omit(client, ['client']);

    return client;
  },

  userPresent(user, isPut) {
    let query;

    // Query to check if email id already present in the system.
    query = lodash.pick(user, [
      'email'
    ]);

    if (isPut) {
      query = lodash.assign(query, {
        _id: { $ne: user._id }
      });
    }

    return new Promise((resolve, reject) => {
      Model
        .findOne(query)
        .exec()
        .then((result) => {
          if (!lodash.isEmpty(result)) {
            return reject(new ApiError('Client already present in the system.'));
          }

          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  clientPresent(user, isPut) {
    let query;

    query = lodash.pick(user, [
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
      dob: new Date(user.dob)
    });

    if (isPut) {
      query = lodash.assign(query, {
        _id: { $ne: user._id }
      });
    }

    return new Promise((resolve, reject) => {
      Model
        .find(query)
        .exec()
        .then((result) => {
          if (!lodash.isEmpty(result)) {
            return reject(new ApiError('Client already present in the system.'));
          }

          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  save(client) {
    const User = new Model(client);

    return User.save();
  },

  update(client) {
    return client.save();
  },

  remove(client) {
    return client.remove();
  },

  find(query) {
    return Model.find(query);
  },

  findById(id) {
    return new Promise((resolve, reject) => {
      Model
        .findById(id)
        .then((result) => {
          if (!lodash.isEmpty(result)) {
            return resolve(result);
          }

          reject(new ApiError('Client not found.'));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
