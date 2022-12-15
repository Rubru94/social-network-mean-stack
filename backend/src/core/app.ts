import { UserPublicController } from '@user/controllers/user-public.controller';
import { UserController } from '@user/controllers/user.controller';
import { json, text, urlencoded } from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response, static as expressStatic } from 'express';
import httpContext from 'express-http-context';
import helmet from 'helmet';
import { Server } from 'typescript-rest';
import ensureAuth from './middlewares/auth.middleware';
import handleError from './middlewares/error-handler.middleware';

class App {
    private app: Application;

    async start(): Promise<Application> {
        this.app = express();
        this.config();
        this.capture();
        this.build();
        this.handling();
        return this.app;
    }

    private config() {
        this.app.use(httpContext.middleware);
        this.app.use(compression());
        this.app.use(json({ limit: '1mb' }));
        this.app.use(text({ type: 'text/html' }));
        this.app.use(cors());
        this.app.use(urlencoded({ extended: false }));
        this.app.use(helmet());
        this.app.disable('x-powered-by');
        this.app.use('/static', expressStatic(`${__dirname}/static`));
    }

    private capture() {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header(
                'Access-Control-Allow-Headers',
                'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
            );
            res.header('Access-Control-Expose-Headers', 'Authorization');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

            httpContext.set('request', req);

            next();
        });

        /**
         * @info all routes that contains '/user/', '/follow/' has middleware 'ensureAuth'
         */
        this.app.use(/^.*((\/user\/)|(\/follow\/)).*$/, ensureAuth);
    }

    private build() {
        /* this.app.use('/api/user', userRoutes);
        this.app.use('/api/follow', followRoutes);
        this.app.use('/api/publication', publicationRoutes);
        this.app.use('/api/message', messageRoutes); */

        /**
         * @info
         *
         * All 'this.app.use' before 'Server.buildServices' because 'this.app' it pass as first param
         * Except handling errors that should run after.
         */
        Server.buildServices(this.app, UserPublicController, UserController);
        Server.ignoreNextMiddlewares(true);
    }

    private handling() {
        this.app.use(handleError);
    }
}

export default new App();
