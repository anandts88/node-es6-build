import httpStatus from 'http-status';
import ExtendableError from 'es6-error';


class ApiError extends ExtendableError {

	constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR) {
		super(message);
		this.status = status;
	}
}

export default ApiError;
