'use strict';

const dotenvFlow = require('dotenv-flow');
const http = require('http');
const mongoose = require('mongoose');
const moduleAlias = require('module-alias');

dotenvFlow.config({ path: 'environments' });
moduleAlias.addAliases({
    '@core': `${__dirname}/core`,
    '@utils': `${__dirname}/utils`,
    '@follow': `${__dirname}/follow`,
    '@message': `${__dirname}/message`,
    '@publication': `${__dirname}/publication`,
    '@user': `${__dirname}/user`,
    '@root': __dirname
});

const app = require('@core/app');
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;

mongoose.Promise = global.Promise;
mongoose
    .connect('mongodb://localhost:27017/social_network_mean', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async (db) => {
        const server = http.createServer(app);
        server.listen(port, +host, () => {
            console.info(`Server listening on host: ${host} and port ${port}`);
        });
        console.log('Db is connected');
    })
    .catch((err) => console.error(err));
