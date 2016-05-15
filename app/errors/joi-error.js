import httpStatus from 'http-status';
import ExtendableError from 'es6-error';
import lodash from 'lodash';

const { BAD_REQUEST } = httpStatus;

class JoiError extends ExtendableError {

	constructor(errors = [], status = BAD_REQUEST) {
    const { details } = errors;
		let _errors;

		super('Joi Validation Error');
    this.status = status;

		_errors = lodash.map(details, (error, index) => {
			error.id = index;
      delete error.context;

			return error;
		});

    this.validations = { errors: _errors };
	}
}

export default JoiError;
