import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const prefix = "cache";
const expiryInMinutes = 5;

const store = async (key, value) => {
	try {
		const item = {
			value,
			timestamp: Date.now(),
		};
		await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
	} catch (error) {
		console.log(error);
	}
};

const isExpired = (item) => {
	const now = moment(Date.now());
	const storedTime = moment(item.timestamp);
	return now.diff(storedTime, "minutes") > expiryInMinutes;
};

const get = async (key) => {
	try {
		const value = await AsyncStorage.getItem(prefix + key);
		const item = JSON.parse(value);

		if (!item) return null;

		if (isExpired(item)) {
			// Command - Changes the state of a system
			// Command Query Seperation (CQS)
			// Query - Gets or returns the state of a system
			// Functions should only Command or Query and not do both
			await AsyncStorage.removeItem(prefix + key);
			console.log("isExpired is the cause!");
			return null;
		}

		return item.value;
	} catch (error) {
		console.log(error);
	}
};

export default { store, get };
