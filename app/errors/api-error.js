import httpStatus from 'http-status';
import NodeAuthError from './node-auth-error';

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class ApiError extends NodeAuthError {
	/**
	 * Creates an API error.
	 * @param {string} message - Error message.
	 * @param {number} status - HTTP status code of error.
	 * @param {boolean} isPublic - Whether the message should be visible to user or not.
	 */
	constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
		super(message, status, isPublic);
	}
}

export default ApiError;
