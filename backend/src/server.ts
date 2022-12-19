import { config } from 'dotenv-flow';
import http from 'http';
import { addAliases } from 'module-alias';

config({ path: 'environments' });
addAliases({
    '@core': `${__dirname}/core`,
    '@utils': `${__dirname}/utils`,
    '@follow': `${__dirname}/follow`,
    '@message': `${__dirname}/message`,
    '@publication': `${__dirname}/publication`,
    '@user': `${__dirname}/user`,
    '@root': __dirname
});

import App from '@core/app';
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;

async function bootstrap(): Promise<void> {
    try {
        const app = await App.start();
        const server: http.Server = http.createServer(app);
        if (process.env.DOCKER)
            server.listen(port, () => {
                console.info(`Server listening on port: ${port}`);
            });
        else
            server.listen(port, +host, () => {
                console.info(`Server listening on host: ${host} and port ${port}`);
            });
    } catch (err) {
        console.error(err);
    }
}

bootstrap();
