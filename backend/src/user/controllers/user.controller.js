'use strict';

const bcryptService = require('@utils/services/bcrypt.service');
const error = require('@core/models/error.model');
const Follow = require('@follow/models/follow.model');
const fsService = require('@utils/services/fs.service');
const ImageUser = require('@user/models/image-user.model');
const isImage = require('is-image');
const jwtService = require('@utils/services/jwt.service');
const mongoosePagination = require('mongoose-pagination');
const mongooseService = require('@utils/services/mongoose.service');
const path = require('path');
const PublicUser = require('@user/models/public-user.model');
const User = require('@user/models/user.model');
const utilService = require('@utils/services/util.service');

function hello(req, res) {
    res.status(200).send({ msg: 'hello world !' });
}

async function getAll(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        /**
         * @info using callback()
         */
        User.find()
            .sort('_id')
            .paginate(page, itemsPerPage, async (err, users, total) => {
                if (err) return next(err);
                if (!users) throw new error.NotFoundError('Users not found');

                const followings = (await Follow.find({ user: req.user.sub })).map((following) => following.followed);
                const followers = (await Follow.find({ followed: req.user.sub })).map((follower) => follower.user);

                return res.status(200).send({ users, followings, followers, total, pages: Math.ceil(total / itemsPerPage) });
            });
    } catch (err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const id = req.params?.id;
        if (!mongooseService.isValidObjectId(id)) throw new error.BadRequestError('Invalid id');
        const user = await User.findById(id);
        if (!user) throw new error.NotFoundError('User not found');

        const following = await Follow.findOne({ user: req.user.sub, followed: id });
        const follower = await Follow.findOne({ user: id, followed: req.user.sub });

        res.status(200).send({ user: new PublicUser(user), following, follower });
    } catch (err) {
        next(err);
    }
}

async function followCounters(req, res, next) {
    try {
        const user = req.query?.user ?? req.user.sub;
        if (!mongooseService.isValidObjectId(user)) throw new error.BadRequestError('Invalid id');

        const followingCount = await Follow.count({ user });
        const followerCount = await Follow.count({ followed: user });

        res.status(200).send({ followingCount, followerCount });
    } catch (err) {
        next(err);
    }
}

async function register(req, res, next) {
    try {
        const user = new User(req.body);
        if (user.validateSync()) throw new error.BadRequestError(user.validateSync().message);

        const userExistent = await User.findOne({ email: user.email });
        if (userExistent) throw new error.BadRequestError('Email already used');

        user.password = await bcryptService.hashPromise(user.password);

        return res.status(200).send(await user.save());
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const user = new User(req.body);
        if (user.validateSync()) throw new error.BadRequestError(user.validateSync().message);

        const userExistent = await User.findOne({ email: user.email });
        if (!userExistent) throw new error.NotFoundError('User not exist');

        let isValidPassword = await bcryptService.comparePromise(user.password, userExistent.password);
        if (!isValidPassword) throw new error.BadRequestError('Invalid password');

        if (req.query?.token) return res.status(200).send({ token: jwtService.createToken(userExistent) });
        return res.status(200).send(new PublicUser(userExistent));
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const userId = req.params.id;
        const currentUserId = req.user.sub;
        if (userId !== currentUserId) throw new error.UnauthorizedError('You do not have permissions to update user data');

        let updatedUser = new PublicUser(req.body);
        /**
         * @info { new: true } --> It returns updated object. By default it returns object to update (old object).
         */
        updatedUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
        if (!updatedUser) throw new error.NotFoundError('Failed to update user');

        return res.status(200).send(updatedUser);
    } catch (err) {
        next(err);
    }
}

async function uploadImage(req, res, next) {
    try {
        const userId = req.params?.userId;
        if (!mongooseService.isValidObjectId(userId)) throw new error.BadRequestError('Invalid id');
        const currentUserId = req.user.sub;
        if (userId !== currentUserId) throw new error.UnauthorizedError('You do not have permissions to update user image');

        if (utilService.isEmptyObject(req.files)) throw new error.BadRequestError('There is no attached image');
        const isValidParam = !!req.files.image;
        const filePath = isValidParam ? req.files.image.path : utilService.findValue(req.files, 'path');
        const fileName = filePath.split('\\').pop();

        if (!isValidParam) {
            await fsService.unlinkPromise(filePath);
            throw new error.BadRequestError('Invalid image param');
        }

        if (!isImage(fileName)) {
            await fsService.unlinkPromise(filePath);
            throw new error.BadRequestError('Invalid image format/extension');
        }
        const updatedUser = await User.findByIdAndUpdate(userId, new ImageUser(fileName), { new: true });
        if (!updatedUser) throw new error.NotFoundError('Failed to update image user');

        return res.status(200).send(updatedUser);
    } catch (err) {
        next(err);
    }
}

async function getImageFile(req, res, next) {
    try {
        if (!req.params?.imageFile) throw new error.BadRequestError('No param imageFile');
        const filePath = `./src/user/uploads/${req.params.imageFile}`;

        const file = await fsService.existsPromise(filePath);
        if (!file) throw new error.NotFoundError('Image does not exist');

        res.status(200).sendFile(path.resolve(filePath));
    } catch (err) {
        next(err);
    }
}

module.exports = {
    hello,
    getAll,
    findById,
    followCounters,
    register,
    login,
    update,
    uploadImage,
    getImageFile
};
