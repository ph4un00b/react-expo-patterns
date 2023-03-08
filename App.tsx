import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { Fragment, Suspense, useRef } from "react";
import { Button, Dimensions, I18nManager, Text, View } from "react-native";
import {
	DrawerLayout,
	GestureHandlerRootView,
	TouchableOpacity,
} from "react-native-gesture-handler";
import {
	NativeRouter,
	NavigateFunction,
	Route,
	Routes,
	useNavigate,
} from "react-router-native";

import { DEVICE_WIDTH } from "./mobile/utils/constants";
import { APP_LINKS } from "./routes";

import "./styles";

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: "#cece" }}>
			<ActionSheetProvider>
				<PortalProvider>
					<NativeRouter>
						<Suspense>
							<RoutesConfig />
						</Suspense>
					</NativeRouter>
				</PortalProvider>
			</ActionSheetProvider>
		</GestureHandlerRootView>
	);
}

function RoutesConfig() {
	const navigate = useNavigate();
	const drawer = useRef<DrawerLayout>(null!);
	return (
		<DrawerLayout
			ref={drawer}
			/** @see https://reactnative.dev/docs/drawerlayoutandroid.html#drawerlockmode */
			drawerLockMode="locked-open"
			// ios only
			enableTrackpadTwoFingerGesture
			// common props
			minSwipeDistance={320}
			userSelect="text"
			edgeWidth={100}
			drawerWidth={DEVICE_WIDTH * 0.5}
			drawerPosition={I18nManager.isRTL ? "right" : "left"}
			drawerType="slide"
			drawerBackgroundColor="#b3b3b3"
			onDrawerSlide={(status: any) => console.log(status)}
			renderNavigationView={() => (
				<Sidebar drawer={drawer} navigate={navigate} />
			)}
		>
			<OpenDrawer drawer={drawer} />
			{/* visual log */}
			<View className="flex items-center justify-center bg-purple-400">
				<Text className="text-xl text-slate-100">
					<PortalHost name="global-btn" />
					<PortalHost name="global-log" />
				</Text>
			</View>

			<Routes>
				{APP_LINKS.map((link) => {
					return (
						<Fragment key={link.uuid}>
							<Route path={link.path} element={link.element} />
						</Fragment>
					);
				})}
			</Routes>
		</DrawerLayout>
	);
}

function Sidebar(
	{ drawer, navigate }: {
		drawer: React.MutableRefObject<DrawerLayout>;
		navigate: NavigateFunction;
	},
) {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignContent: "center",
			}}
		>
			<CloseDrawer drawer={drawer} />
			<Text style={{ textAlign: "center" }}>Links</Text>
			{APP_LINKS.map((link) => {
				return (
					<Fragment key={link.uuid}>
						<Button onPress={() => navigate(link.path)} title={link.alias} />
					</Fragment>
				);
			})}
		</View>
	);
}

function OpenDrawer(
	{ drawer }: { drawer: React.MutableRefObject<DrawerLayout> },
) {
	return (
		<View>
			<TouchableOpacity onPress={() => drawer.current.openDrawer()}>
				<MaterialCommunityIcons name="backburger" size={64} color="black" />
			</TouchableOpacity>
		</View>
	);
}

function CloseDrawer(
	{ drawer }: { drawer: React.MutableRefObject<DrawerLayout> },
) {
	return (
		<View>
			<TouchableOpacity onPress={() => drawer.current.closeDrawer()}>
				<MaterialCommunityIcons name="backburger" size={64} color="black" />
			</TouchableOpacity>
		</View>
	);
}
