'use strict';

const mongoosePagination = require('mongoose-pagination');
const error = require('@core/models/error.model');
const User = require('@user/models/user.model');
const bcryptService = require('@utils/services/bcrypt.service');
const PublicUser = require('@user/models/public-user.model');
const ImageUser = require('@user/models/image-user.model');
const jwtService = require('@utils/services/jwt.service');
const mongooseService = require('@utils/services/mongoose.service');
const isImage = require('is-image');
const fsService = require('@utils/services/fs.service');

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
            .paginate(page, itemsPerPage, (err, users, total) => {
                if (err) next(err);
                if (!users) throw new error.NotFoundError('Users not found');
                return res.status(200).send({ users, total, pages: Math.ceil(total / itemsPerPage) });
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

        res.status(200).send(user);
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
        const userId = req.params.id;
        const currentUserId = req.user.sub;
        if (userId !== currentUserId) throw new error.UnauthorizedError('You do not have permissions to update user image');

        if (!req.files?.image) throw new error.BadRequestError('There is no attached image');
        const filePath = req.files.image.path;
        const fileName = filePath.split('\\').pop();

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

module.exports = {
    hello,
    getAll,
    findById,
    register,
    login,
    update,
    uploadImage
};
