import httpStatus from 'http-status';
import ExtendableError from 'es6-error';

class InfoError extends ExtendableError {

	constructor(id, status = httpStatus.INTERNAL_SERVER_ERROR) {
		super('Information');
    this.id = id;
		this.status = status;
	}
}

export default InfoError;
