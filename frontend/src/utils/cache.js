
import SecureLS from 'secure-ls';
import dayjs from "dayjs";
const ls = new SecureLS({ encodingType: "aes" });

const prefix = "cache";
const expiryInMinutes = 5;

const store = async (key, value) => {
    try {
        const item = {
            value,
            timestamp: Date.now(),
        };
        await ls.set(prefix + key, JSON.stringify(item));
    } catch (error) {
        console.log(error);
    }
};

const isExpired = (item) => {
    const now = dayjs();
    const storedTime = dayjs(item.timestamp);
    return now.diff(storedTime, "minute") > expiryInMinutes;
};

const get = async (key) => {
    try {
        const value = await ls.get(prefix + key);
        const item = JSON.parse(value);

        if (!item) return null;

        if (isExpired(item)) {
            // Command Query Separation (CQS)
            await ls.remove(prefix + key);
            return null;
        }

        return item.value;
    } catch (error) {
        console.log(error);
    }
};

const _expObject = {
    store,
    get,
}
export default _expObject;