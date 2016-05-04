import app from './express';
import environment from './config/environment';
import winston from './config/winston';

const { port } = environment;

app.listen(port, () => {
	winston.info(
		`node-authentication server started on port ${environment.port}`);
});

export default app;
