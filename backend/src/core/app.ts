import { FollowController } from '@follow/controllers/follow.controller';
import { MessageController } from '@message/controllers/message.controller';
import { PublicationPublicController } from '@publication/controllers/publication-public.controller';
import { PublicationController } from '@publication/controllers/publication.controller';
import { uploadsPath as publicationUploadsPath } from '@publication/models/publication.model';
import { UserPublicController } from '@user/controllers/user-public.controller';
import { UserController } from '@user/controllers/user.controller';
import { uploadsPath as userUploadsPath } from '@user/models/user.model';
import { json, text, urlencoded } from 'body-parser';
import compression from 'compression';
import multipart from 'connect-multiparty';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response, static as expressStatic } from 'express';
import httpContext from 'express-http-context';
import helmet from 'helmet';
import { Server } from 'typescript-rest';
import DB from './database';
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
        DB.connect();
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
         * @info all routes that contains 'api/user', 'api/follow', 'api/publication', 'api/message' has middleware 'ensureAuth'
         */
        this.app.use(/^.*((api\/user)|(api\/follow)|(api\/publication)|(api\/message)).*$/, ensureAuth);

        this.app.use(/^.*\/user\/upload-image.*$/, multipart({ uploadDir: userUploadsPath }));
        this.app.use(/^.*\/publication\/upload-image.*$/, multipart({ uploadDir: publicationUploadsPath }));
    }

    private build() {
        /**
         * @info
         *
         * All 'this.app.use' before 'Server.buildServices' because 'this.app' it pass as first param
         * Except handling errors that should run after.
         */
        Server.buildServices(
            this.app,
            UserPublicController,
            UserController,
            FollowController,
            PublicationPublicController,
            PublicationController,
            MessageController
        );
        Server.ignoreNextMiddlewares(true);
    }

    private handling() {
        this.app.use(handleError);
    }
}

export default new App();
