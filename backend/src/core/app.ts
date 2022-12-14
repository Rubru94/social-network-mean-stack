import { UserController } from '@user/controllers/user.controller';
import { json, text, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response, static as expressStatic } from 'express';
import helmet from 'helmet';
import { Server } from 'typescript-rest';
import handleError from './middlewares/error-handler.middleware';

class App {
    private app: Application;

    async start(): Promise<Application> {
        this.app = express();
        this.build();
        this.config();
        this.capture();
        return this.app;
    }

    private build() {
        /* this.app.use('/api/user', userRoutes);
        this.app.use('/api/follow', followRoutes);
        this.app.use('/api/publication', publicationRoutes);
        this.app.use('/api/message', messageRoutes); */
        Server.buildServices(this.app, UserController);
        Server.ignoreNextMiddlewares(true);
    }

    private config() {
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

            next();
        });
        this.app.use(handleError);
    }
}

export default new App();
