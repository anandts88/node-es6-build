import app from './express';
import environment from './config/environment';
import winston from './config/winston';

app.listen(environment.port, () => {
	winston.info(`node-authentication server started on port ${environment.port}`);
});

export default app;
