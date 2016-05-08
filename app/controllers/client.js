import Client from '../models/client';
import clientService from '../services/client';

function post(req, res, next) {
  const client = new Client(req.body.client);

  clientService
    .save(client)
    .then((client) => {
      res.json({ client });
    })
    .catch((err) => {
      next(err);
    });
}

export default { post };
