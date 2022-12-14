import { config } from 'dotenv-flow';
import http from 'http';
import { connect } from 'mongoose';
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

connect('mongodb://localhost:27017/social_network_mean')
    .then(async (db) => {
        const app = await App.start();
        const server = http.createServer(app);
        server.listen(port, +host, () => {
            console.info(`Server listening on host: ${host} and port ${port}`);
        });
        console.log('Db is connected');
    })
    .catch((err) => console.error(err));
