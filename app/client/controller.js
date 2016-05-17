import lodash from 'lodash';
import httpStatus from 'http-status';
import service from './service';
import SqlError from '../errors/sql-error';
import ApiError from '../errors/api-error';
import InfoError from '../errors/info-error';
import constants from '../utility/constants';

const {
  USER_STATUS
} = constants;

const {
  NO_CONTENT
} = httpStatus;

function post(req, res, next) {
  const agency = 1; // TODO: Get `agency` from session. Currently it is hardcoded.
  const { client } = req.body;
  let user;

  // Convert `client` object reviced in reqest to `user` object.
  user = service.clientToUser(client);

  // Set `status` to `ACTIVE`
  user = lodash.assign(client, {
    status: USER_STATUS.ACTIVE,
    agency
  });

  service
    .userPresent(user)
    .then(() => service.clientPresent(user))
    .then(() => service.save(user))
    .then((user) => res.json({ client: service.userToClient(user.toJSON()) }))
    .catch((err) => {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(new SqlError(err));
    });
}

function put(req, res, next) {
  const agency = 1; // TODO: Get `agency` from session. Currently it is hardcoded.
  const { id } = req.params;
  const { client } = req.body;
  let user;
  let _user;

  // Convert `client` object reviced in reqest to `user` object.
  _user = service.clientToUser(client);

  service
    .findById(id)
    .then((_client) => {
      if (_user.agency !== _client.agency) {
        throw new ApiError('You dont have access to change the agency of client.');
      } else if (_client.agency !== agency) {
        throw new ApiError('Client not belongs to your agency.');
      } else {
        user = lodash.assign(_client, _user);

        return service.userPresent(user, true);
      }
    })
    .then(() => service.userPresent(user, true))
    .then(() => service.clientPresent(user, true))
    .then(() => service.update(user))
    .then((user) => res.json({ client: service.userToClient(user) }))
    .catch((err) => {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(new SqlError(err));
    });
}

function remove(req, res, next) {
  const agency = 1; // TODO: Get `agency` from session. Currently it is hardcoded.
  const { id } = req.params;

  service
    .findById(id)
    .then((_client) => {
      if (_client.agency !== agency) {
        throw new ApiError('Client not belongs to your agency.');
      } else {
        return service.remove(_client);
      }
    })
    .then(() => res.status(NO_CONTENT).send())
    .catch((err) => {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(new SqlError(err));
    });
}

function get(req, res, next) {
  const agency = 1; // TODO: Get `agency` from session. Currently it is hardcoded.
  let {
    page,
    size
  } = req.query;
  let paginate = page && size;
  let total;
  let query;
  let promise;

  query = { agency };

  if (paginate) {
    page = Number(page || 1);
    size = Number(size || 20);

    promise = service
      .find(query)
      .count()
      .then((count) => {
        let pages = count/size;

        pages = (pages === 0 ? pages : pages + 1);
        total = count;

        if (count === 0 || page < 1 || page > pages || page > size) {
          throw new InfoError(1);
        } else {
          return service
            .find(query)
            .limit(size)
            .skip(size * page)
            .exec();
        }
      });
  } else {
    promise = service
      .find(query)
      .exec();
  }

  promise
    .then((clients) => {
      let _clients = lodash.map(clients, (client) => service.userToClient(client.toJSON()));
      let result = { clients: _clients };

      if (paginate) {
        result.meta = { total, page, size };
      }

      res.json(result);
    })
    .catch((err) => {
      if (err instanceof InfoError) {
        return res.json({ clients: [] });
      }

      if (err instanceof ApiError) {
        return next(err);
      }
      next(new SqlError(err));
    });
}

export default { post, put, remove, get };
