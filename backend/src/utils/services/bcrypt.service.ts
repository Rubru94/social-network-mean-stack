import bcrypt from 'bcrypt-nodejs';

class Bcrypt {
    async hashPromise(data): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(data, null, null, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    async comparePromise(data: string, encrypted: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(data, encrypted, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }
}

export default new Bcrypt();
