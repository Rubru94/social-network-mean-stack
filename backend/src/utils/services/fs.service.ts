import fs from 'fs';

class FileSystemService {
    async existsPromise(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err) => {
                if (err) resolve(null);
                resolve(path);
            });
        });
    }

    async unlinkPromise(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) reject(err);
                resolve(path);
            });
        });
    }
}

export default new FileSystemService();
