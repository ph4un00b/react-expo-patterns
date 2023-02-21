import { Portal } from "@gorhom/portal";
import { useAtomValue, useSetAtom } from "jotai/react";
import { atom } from "jotai/vanilla";
// import { $ } from "jotai-signal";
import { forwardRef, useEffect, useRef } from "react";
import { Dimensions, Platform, Text, TextInput, View } from "react-native";
import {
	DrawerLayout,
	Gesture,
	GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";

import { AnimatedText } from "./utils/animated-text";

export function KreatorDrawerScreen() {
	return <RightDrawer />;
}

const { width: DRAWER_WIDTH } = Dimensions.get("window");
const SCREEN_WIDTH = DRAWER_WIDTH;
const DRAWER_THRESHOLD = {
	left: SCREEN_WIDTH * 0.3,
	right: SCREEN_WIDTH * 0.4,
};
const DRAWER_DARKED_COLOR = { left: "transparent", right: "transparent" };

const INITIAL_LEFT_X = -1 * (SCREEN_WIDTH - DRAWER_THRESHOLD.left);

const _toggleDrawers = atom(false);
const _leftTranslationX = atom(INITIAL_LEFT_X);

// derived
const _settings = atom((r) => ({
	isOpen: r(_toggleDrawers),
	leftX: r(_leftTranslationX),
}));

function Content() {
	const lastTouched = useSharedValue<"left" | "right">("left");
	useLogRenders("content");

	return (
		<View className="flex flex-row flex-1 bg-indigo-400 opacity-50">
			<Portal hostName="global-log">
				<Text className="text-slate-100">
					from portal
				</Text>
			</Portal>
			<DrawerHelper
				lastTouched={lastTouched}
				type="left"
				initialX={-1 * (SCREEN_WIDTH - DRAWER_THRESHOLD.left)}
			/>
			<DrawerHelper
				lastTouched={lastTouched}
				type="right"
				initialX={1 * (SCREEN_WIDTH - DRAWER_THRESHOLD.right)}
			/>
		</View>
	);
}

type HelperProps = {
	type: "left" | "right";
	initialX: number;
	lastTouched: SharedValue<"left" | "right">;
};

function DrawerHelper({ type, initialX, lastTouched }: HelperProps) {
	const ref = useRef<TextInput>(null!);
	// shared
	const x = useSharedValue(initialX);
	const safeX = useSharedValue(0);
	// flags
	const isIdle = useSharedValue(true);

	const setTranslationX = () => {
		/**
		 * @abstract setNativeProps pattern
		 * no working on TextNode <Text />
		 * they will add setNativeProps
		 * o fabric soon
		 * @see https://github.com/facebook/react-native/commit/874881e73e83c03df5f1a376972f6d2e6e5e1214
		 */
		ref.current.setNativeProps({ text: x.value.toFixed(2) });
	};

	const gesture = Gesture.Pan()
		.onStart(() => {
			lastTouched.value = type;
			isIdle.value = false;
			safeX.value = x.value;
		})
		.onUpdate(({ translationX }) => {
			x.value = clampTranslateX({ value: translationX + safeX.value, type });
			if (Platform.OS == "web") runOnJS(setTranslationX)();
		})
		.onFinalize(() => {
			isIdle.value = true;
		});

	const animatedStyles = useAnimatedStyle(() => {
		return {
			zIndex: isIdle.value && (lastTouched.value != type) ? 0 : 100,
			backgroundColor: type == "left" ? "peru" : "pink",
			borderRadius: 60,
			/**
			 * I use borderRadius in order to
			 * hide the unneeded border radius
			 * since we don't want to show them!
			 * would be cool to have
			 * something like: "48% 0% 0% 49% / 23% 0% 0% 25%"
			 * @see https://9elements.github.io/fancy-border-radius/full-control.html#23.48.0.49-75.100.100.100-.
			 */
			width: DRAWER_WIDTH,
			transform: [
				{ translateX: x.value },
			],
		};
	});

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View
				className="absolute top-0 bottom-0 border-8 border-indigo-600 opacity-90"
				style={animatedStyles}
			>
				{Platform.OS == "web"
					/**
					 * @abstract animated text pattern
					 * fallback
					 */
					? <LogPanelRef float={type} ref={ref} />
					: <LogPanelShared float={type} leftX={x} />}
			</Animated.View>
		</GestureDetector>
	);
}

type SharedPanelProps = {
	leftX: Animated.SharedValue<number>;
	float: "left" | "right";
};

function clampTranslateX({ value, type }: { value: number; type: string }) {
	"worklet";
	const padding = SCREEN_WIDTH * 0.15;
	return type == "left"
		? clamp(
			value,
      /* lower */ -SCREEN_WIDTH + padding,
      /* upper */ -padding,
		)
		: clamp(
			value,
      /* lower */ padding,
      /* upper */ SCREEN_WIDTH - padding,
		);
}

function LogPanelShared({ leftX, float }: SharedPanelProps) {
	useLogRenders("log-panel-shared");
	return (
		<View
			className="justify-center flex-1"
			style={{ alignItems: float == "left" ? "flex-end" : "flex-start" }}
		>
			<AnimatedText
				className="text-xl bg-purple-600 text-slate-100"
				text={leftX}
			/>
		</View>
	);
}

type RefPanelProps = {
	float: "left" | "right";
};
const LogPanelRef = forwardRef<TextInput, RefPanelProps>(({ float }, ref) => {
	useLogRenders("log-panel-ref");
	return (
		<View
			className="justify-center flex-1"
			style={{ alignItems: float == "left" ? "flex-end" : "flex-start" }}
		>
			<TextInput
				ref={ref}
				editable={false}
				value="x value"
				className="w-1/3 text-xl bg-purple-600 text-slate-100"
			/>
		</View>
	);
});

// function LogPanel() {
//     const leftX = useAtomValue(_leftTranslationX);
//     useLogRenders("log-panel");
//     return (
//         <View className="justify-center flex-1">
//             <Text className="text-xl bg-purple-600 text-slate-100">
//                 {leftX}
//             </Text>
//         </View>
//     );
// }

// function LogPanel$() {
//     useLogRenders("$log-panel");
//     return (
//         <View className="justify-center flex-1">
//             <Text className="text-xl bg-purple-600 text-slate-100">
//                 {$(_leftTranslationX).value}
//             </Text>
//         </View>
//     );
// }

function useLogRenders(name: string) {
	const rerender = useRef(0);
	useEffect(() => {
		rerender.current += 1;
		console.log(`${name}: `, rerender.current);
	});
}

function LeftDrawer() {
	const isDrawerOpen = useAtomValue(_toggleDrawers);
	return (
		<DrawerLayout
			drawerLockMode={isDrawerOpen ? "unlocked" : "locked-closed"}
			overlayColor={DRAWER_DARKED_COLOR.left}
			edgeWidth={DRAWER_THRESHOLD.left}
			drawerWidth={DRAWER_WIDTH}
			drawerPosition="left"
			drawerType="front"
			drawerBackgroundColor="#ddd"
			renderNavigationView={() => (
				<View>
					<Text>I am in the LEFT drawer!</Text>
				</View>
			)}
		>
			<Content />
		</DrawerLayout>
	);
}

function RightDrawer() {
	const isDrawerOpen = useAtomValue(_toggleDrawers);
	return (
		<DrawerLayout
			drawerLockMode={isDrawerOpen ? "unlocked" : "locked-closed"}
			overlayColor={DRAWER_DARKED_COLOR.right}
			edgeWidth={DRAWER_THRESHOLD.right}
			drawerWidth={DRAWER_WIDTH}
			drawerPosition="right"
			drawerType="front"
			drawerBackgroundColor="#ddd"
			renderNavigationView={() => (
				<View>
					<Text>I am in the RIGHT drawer!</Text>
				</View>
			)}
			onDrawerSlide={(status) => {
				console.log(status);
			}}
		>
			<LeftDrawer />
		</DrawerLayout>
	);
}
