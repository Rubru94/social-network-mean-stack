import { CustomError, NotFoundError } from '@core/models/error.model';
import { IFollow } from '@follow/models/follow.model';
import Service from '@follow/services/follow.service';
import { Payload } from '@utils/services/jwt.service';
import httpContext from 'express-http-context';
import { Types } from 'mongoose';
import { DELETE, GET, Path, PathParam, POST, QueryParam } from 'typescript-rest';

@Path('api/follow')
export class FollowController {
    @POST
    async create(follow: IFollow): Promise<IFollow> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.create(payload, follow);
        } catch (err) {
            throw new CustomError(err);
        }
    }

    @Path('/:id')
    @DELETE
    async remove(@PathParam('id') id: string): Promise<IFollow[]> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.remove(payload, id);
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/following/:page?')
    @GET
    async getFollowingUsers(
        @PathParam('page') page?: string,
        @QueryParam('itemsPerPage') itemsPerPage?: string,
        @QueryParam('user') user?: string
    ): Promise<{ follows: IFollow[]; followings: Types.ObjectId[]; followers: Types.ObjectId[]; total: number; pages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getFollowingUsers(payload, +page, +itemsPerPage, user);
            if (!res) throw new NotFoundError('Follows not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }
}

/* const error = require('@core/models/error.model');
const Follow = require('@follow/models/follow.model');
const mongoosePagination = require('mongoose-pagination');
const mongooseService = require('@utils/services/mongoose.service');
const PublicUser = require('@user/models/public-user.model');
const utilService = require('@utils/services/util.service'); */

/* async function create(req, res, next) {
    try {
        delete req.body._id;
        let follow = new Follow(req.body);
        follow.user = follow.user ?? req.user.sub;
        if (follow.validateSync()) throw new error.BadRequestError(follow.validateSync().message);

        
        // @info Every ObjectId instance supports the "equals" method allowing you to provide your comparison value
         
        if (follow.user.equals(follow.followed)) throw new error.BadRequestError('User & followed cannot be the same user');

        follow = await follow.save();
        if (!follow) throw new error.BadRequestError('Follow not saved');

        return res.status(200).send(follow);
    } catch (err) {
        next(err);
    }
} */

/* async function remove(req, res, next) {
    try {
        const user = req.user.sub;
        const followed = req.params.id;
        if (!mongooseService.isValidObjectId(followed)) throw new error.BadRequestError('Invalid id');

        const follow = await Follow.find({ user, followed });
        await Follow.find({ user, followed }).deleteMany();

        return res.status(200).send(follow);
    } catch (err) {
        next(err);
    }
} */

/* async function getFollowingUsers(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const user = req.query?.user ? req.query.user : req.user.sub;
        if (!mongooseService.isValidObjectId(user)) throw new error.BadRequestError('Invalid user id');
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        Follow.find({ user })
            .sort('_id')
            .populate({ path: 'followed' })
            .paginate(page, itemsPerPage, async (err, follows, total) => {
                if (err) return next(err);
                if (!follows) throw new error.NotFoundError('Follows not found');

                const followings = (await Follow.find({ user: req.user.sub })).map((following) => following.followed);
                const followers = (await Follow.find({ followed: req.user.sub })).map((follower) => follower.user);

                return res.status(200).send({
                    follows: follows.map((follow) => {
                        follow.followed = new PublicUser(follow.followed);
                        return follow;
                    }),
                    followings,
                    followers,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
    } catch (err) {
        next(err);
    }
} */

/* async function getFollowers(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const user = req.query?.user ? req.query.user : req.user.sub;
        if (!mongooseService.isValidObjectId(user)) throw new error.BadRequestError('Invalid user id');
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        Follow.find({ followed: user })
            .sort('_id')
            .populate({ path: 'user' })
            .paginate(page, itemsPerPage, async (err, follows, total) => {
                if (err) return next(err);
                if (!follows) throw new error.NotFoundError('Follows not found');

                const followings = (await Follow.find({ user: req.user.sub })).map((following) => following.followed);
                const followers = (await Follow.find({ followed: req.user.sub })).map((follower) => follower.user);

                return res.status(200).send({
                    follows: follows.map((follow) => {
                        follow.followed = new PublicUser(follow.followed);
                        return follow;
                    }),
                    followings,
                    followers,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
    } catch (err) {
        next(err);
    }
} */

/* async function getFollows(req, res, next) {
    try {
        const user = req.user.sub;
        if (!mongooseService.isValidObjectId(user)) throw new error.BadRequestError('Invalid user id');

        const find = Follow.find(utilService.strToBoolean(req.query?.followed) ? { followed: user } : { user });

        const follows = await find.sort('_id').populate({ path: 'user followed' });
        if (!follows) throw new error.NotFoundError('Follows not found');
        return res.status(200).send(follows);
    } catch (err) {
        next(err);
    }
} */
