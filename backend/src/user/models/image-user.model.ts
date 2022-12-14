import { IUser } from './user.model';

export class ImageUser {
    image: IUser['image'];

    constructor(image: IUser['image']) {
        this.image = image;
    }
}
