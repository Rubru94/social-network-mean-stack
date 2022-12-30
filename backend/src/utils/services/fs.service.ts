import fs from 'fs';

class FileSystemService {
    async existsPromise(path: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err) => {
                if (err) resolve(null);
                resolve(path);
            });
        });
    }

    async unlinkPromise(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async readFile(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
}

export default new FileSystemService();
