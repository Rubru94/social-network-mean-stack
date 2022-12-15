export class UtilService {
    static isEmptyObject(obj: any): boolean {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    static strToBoolean(value: string) {
        switch (value?.toLowerCase()?.trim()) {
            case 'true':
            case 'yes':
            case '1':
                return true;

            case 'false':
            case 'no':
            case '0':
            case null:
            case undefined:
                return false;

            default:
                return JSON.parse(value);
        }
    }

    static findValue(obj: any, key: string) {
        let value: any;
        Object.keys(obj).some((k: string) => {
            if (k === key) {
                value = obj[k];
                return true;
            }
            if (obj[k] && typeof obj[k] === 'object') {
                value = this.findValue(obj[k], key);
                return value !== undefined;
            }
            return null;
        });
        return value;
    }
}
