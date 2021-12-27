import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

export default useLocation = () => {
	const [location, setLocation] = useState();

	const getLocation = async () => {
		try {
			const { granted } =
				await Location.requestForegroundPermissionsAsync();
			if (!granted) return;
			const result = await Location.getLastKnownPositionAsync();
			if (result) {
				const { latitude, longitude } = result.coords;
				setLocation({ latitude, longitude });
			} else {
				setLocation(null);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getLocation();
	}, []);

	return location;
};
