import moment from 'moment';
import constants from '../utility/constants';

const {
  DATE_FORMAT
} = constants;

function user(req, res, next) {
  const { admin } = req.body;
  const session = req.session.user;
  let {
    email,
    agency,
    dob,
    lastName
  } = admin;

  let dobformatted = moment(dob, DATE_FORMAT.ISO_DATE).format(DATE_FORMAT.DATE1);
  let firstInitial = lastName.substr(1).toUpperCase();
  
  // Default Password is first initial of last name followed by DOB in format YYYYMMDD
  let password = `${firstInitial}${dobformatted}`;

  if (session) {
    agency = session.agency;
  }

  req.user = {
    email,
    password,
    agency,
    role: 'Admin'
  };

  next();
}

export default { post };
