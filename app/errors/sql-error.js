import httpStatus from 'http-status';
import ExtendableError from 'es6-error';

const { INTERNAL_SERVER_ERROR } = httpStatus;

class SqlError extends ExtendableError {

	constructor(err, status = INTERNAL_SERVER_ERROR) {
		const {
			errors,
			errmsg
		} = err;

		super(errmsg || 'Validation Fails');
    this.status = status;
    this.id = err.code;
		if (errors) {
			this.errors = { errors };
		} else {
			this.errors = {
				errors: [
					{
						id: err.code,
						message: err.errmsg
					}
				]
			};
		}
	}
}

export default SqlError;
