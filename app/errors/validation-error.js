import httpStatus from 'http-status';
import ExtendableError from 'es6-error';
import winstonInstance from '../config/winston';

const { BAD_REQUEST } = httpStatus;

class ValidationError extends ExtendableError {

	constructor(errors, status = BAD_REQUEST, isPublic = false) {
		super('Validation Error');
    this.status = status;
    this.validations = errors;
	}
}

export default ValidationError;
