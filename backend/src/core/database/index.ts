import { connect } from 'mongoose';

class Database {
    private connection = {
        name: process.env.DB_MONGO_DEFAULT_NAME,
        host: process.env.DB_MONGO_DEFAULT_HOST,
        port: Number(process.env.DB_MONGO_DEFAULT_PORT)
    };

    get connectionStr() {
        return `mongodb://${this.connection.host}:${this.connection.port}/${this.connection.name}`;
    }

    async connect(): Promise<void> {
        try {
            await connect(this.connectionStr);
            console.log('Db is connected');
        } catch (error) {
            console.error(`Db Connection error: ${error.message}`);
        }
    }
}

export default new Database();
