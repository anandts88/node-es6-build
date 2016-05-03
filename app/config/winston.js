import winston from 'winston';
import moment from 'moment';

const { Logger, transports } = winston;

const { Console } = transports;

const logger = new Logger({
	transports: [
		new Console({
			json: true,
			colorize: true,
			timestamp: () => moment().format('YYYY:MM:DD HH:mm:ss:SS')
		})
	]
});

export default logger;
