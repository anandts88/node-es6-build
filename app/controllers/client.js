import User from '../models/user';
import userService from '../services/user';


function post(req, res, next) {
  const {
    userName,
    password,
    role
  } = req.body.user;

  const user = new User({ userName, password, role });

  userService
    .save(user)
    .then((user) => {
      res.json({ user });
    })
    .error((err) => {
      next(err);
    });
}

export default { post };
