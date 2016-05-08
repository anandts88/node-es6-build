import httpStatus from 'http-status';
import ExtendableError from 'es6-error';
import winstonInstance from '../config/winston';

const { INTERNAL_SERVER_ERROR } = httpStatus;

class ValidationError extends ExtendableError {

	constructor(err, status = INTERNAL_SERVER_ERROR) {
		super(err.errmsg);
    this.status = status;
    this.id = err.code;
	}
}

export default ValidationError;
