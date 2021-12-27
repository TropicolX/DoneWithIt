import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import AccountNavigator from "./AccountNavigator";
import expoPushTokensApi from "../api/expoPushTokens";
import FeedNavigator from "./FeedNavigator";
import ListingEditScreen from "../screens/ListingEditScreen";
import navigation from "./rootNavigation";
import NewListingButtton from "./NewListingButtton";
import routes from "./routes";

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

const AppNavigator = () => {
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	const registerForPushNotifications = async () => {
		try {
			const permission = await Notifications.getPermissionsAsync();
			if (!permission.granted) return;

			const token = await Notifications.getExpoPushTokenAsync();
			expoPushTokensApi.register(token.data);

			if (Platform.OS === "android") {
				Notifications.setNotificationChannelAsync("default", {
					name: "default",
					importance: Notifications.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: "#FF231F7C",
				});
			}
		} catch (error) {
			console.log("Error getting a push token", error);
		}
	};

	useEffect(() => {
		registerForPushNotifications();

		// This listener is fired whenever a notification is received while the app is foregrounded
		// Notifications.addNotificationReceivedListener((notification) => {
		// 	navigation.navigate("Account");
		// });

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		Notifications.addNotificationResponseReceivedListener((response) => {
			navigation.navigate("Account");
		});

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(
				responseListener.current
			);
		};
	}, []);

	return (
		<Tab.Navigator>
			<Tab.Screen
				name="Feed"
				component={FeedNavigator}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="home"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="ListingEdit"
				component={ListingEditScreen}
				options={({ navigation }) => ({
					headerShown: false,
					tabBarButton: () => (
						<NewListingButtton
							onPress={() =>
								navigation.navigate(routes.LISTING_EDIT)
							}
						/>
					),
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="plus-circle"
							color={color}
							size={size}
						/>
					),
				})}
			/>
			<Tab.Screen
				name="Account"
				component={AccountNavigator}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account"
							color={color}
							size={size}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default AppNavigator;
