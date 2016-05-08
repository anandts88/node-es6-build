import httpStatus from 'http-status';
import ExtendableError from 'es6-error';
import lodash from 'lodash';

const { BAD_REQUEST } = httpStatus;

class ValidationError extends ExtendableError {

	constructor(errors = [], status = BAD_REQUEST) {
		let _errors;

		super('Validation Error');
    this.status = status;

		_errors = lodash.map(errors, (error, index) => {
			error.id = index;

			return error;
		});

    this.validations = { errors: _errors };
	}
}

export default ValidationError;
