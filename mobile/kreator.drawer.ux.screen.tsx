/** @jsxImportSource jotai-signal */
import { useActionSheet } from "@expo/react-native-action-sheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atom } from "jotai/vanilla";
import { $ } from "jotai-signal";
import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import {
	Button,
	Dimensions,
	Platform,
	Text,
	TextInput,
	View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { DrawerLockMode, DrawerType } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";

import { AnimatedText } from "./utils/animated-text";

export function KreatorUXDrawerScreen() {
	return <Content />;
}

const { width: DRAWER_WIDTH } = Dimensions.get("window");
const SCREEN_WIDTH = DRAWER_WIDTH;
const DRAWER_THRESHOLD = {
	left: SCREEN_WIDTH * 0.3,
	right: SCREEN_WIDTH * 0.4,
};
const DRAWER_DARKED_COLOR = { left: "transparent", right: "transparent" };

const INITIAL_LEFT_X = -1 * (SCREEN_WIDTH - DRAWER_THRESHOLD.left);
const INITIAL_RIGHT_X = 1 * (SCREEN_WIDTH - DRAWER_THRESHOLD.right);

// defaults
const _toggleDrawers = atom(false);
const _leftTranslationX = atom(INITIAL_LEFT_X);
const _rightTranslationX = atom(INITIAL_RIGHT_X);
/**
 * @see https://docs.swmansion.com/react-native-gesture-handler/docs/api/components/drawer-layout#drawertype
 */
const _leftDrawerType = atom<DrawerType | string>("front");
const _rightDrawerType = atom<DrawerType | string>("front");
/**
 * @see https://github.com/software-mansion/react-native-gesture-handler/blob/main/src/components/DrawerLayout.tsx#L187
 */
const _leftLockMode = atom<DrawerLockMode | string>("unlocked");
const _rightLockMode = atom<DrawerLockMode | string>("unlocked");

const hashAtoms = {
	"type": { left: _leftDrawerType, right: _rightDrawerType },
	"lock": { left: _leftLockMode, right: _rightLockMode },
	"x": { left: _leftTranslationX, right: _rightTranslationX },
};

/** @todo get type opts dynamically from hash */
type Actions = "type" | "lock";
const __actions = atom(hashAtoms);
// derived
const _settings = atom((r) => ({
	isOpen: r(_toggleDrawers),
	leftX: r(_leftTranslationX),
	rightX: r(_rightTranslationX),
	leftType: r(_leftDrawerType),
	rightType: r(_rightDrawerType),
	leftLock: r(_leftLockMode),
	rightLock: r(_rightLockMode),
}));

function Content() {
	const lastTouched = useSharedValue<"left" | "right">("left");
	useLogRenders("content");

	return (
		<>
			<View className="flex flex-row flex-1 bg-indigo-400 opacity-50">
				<DrawerHelper
					lastTouched={lastTouched}
					type="left"
					initialX={INITIAL_LEFT_X}
				/>
				<DrawerHelper
					lastTouched={lastTouched}
					type="right"
					initialX={INITIAL_RIGHT_X}
				/>
			</View>
			{Platform.select({ web: <UpperLog />, native: <BottomLog /> })}
		</>
	);
}

function BottomLog() {
	// ref
	const bottomSheetRef = useRef<BottomSheet>(null);

	// variables
	const snapPoints = useMemo(() => ["25%", "50%"], []);

	// callbacks
	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index);
	}, []);

	const handleClosePress = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	const handleOpenPress = useCallback(() => {
		bottomSheetRef.current?.expand();
	}, []);

	const data = useAtomValue(_settings);
	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={1}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
		>
			<View className="flex items-center justify-center bg-purple-400">
				<Portal hostName="global-btn">
					<Button title="Close" onPress={() => handleClosePress()} />;
					<Button title="Open" onPress={() => handleOpenPress()} />;
				</Portal>
				<Text className="text-slate-100">
					{JSON.stringify(data, null, 2)}
				</Text>
			</View>
		</BottomSheet>
	);
}

function UpperLog() {
	const data = useAtomValue(_settings);
	return (
		<Portal hostName="global-log">
			<Text className="text-slate-100">
				{JSON.stringify(data, null, 2)}
			</Text>
		</Portal>
	);
}

type HelperProps = {
	type: "left" | "right";
	initialX: number;
	lastTouched: SharedValue<"left" | "right">;
};

function DrawerHelper({ type, initialX, lastTouched }: HelperProps) {
	// atoms
	const leftX = useSetAtom(_leftTranslationX);
	const rightX = useSetAtom(_rightTranslationX);
	// refs
	const ref = useRef<TextInput>(null!);
	// shared
	const x = useSharedValue(initialX);
	const safeX = useSharedValue(0);
	// flags
	const isIdle = useSharedValue(true);

	const setTranslation = () => {
		if (type == "left") {
			leftX(x.value);
		} else {
			rightX(x.value);
		}
	};

	const gesture = Gesture.Pan()
		.onStart(() => {
			lastTouched.value = type;
			isIdle.value = false;
			safeX.value = x.value;
		})
		.onUpdate(({ translationX }) => {
			x.value = clampTranslateX({ value: translationX + safeX.value, type });
			if (Platform.OS == "web") setTranslation();
		})
		.onFinalize(() => {
			isIdle.value = true;
			runOnJS(setTranslation)();
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
				<View
					className="justify-center flex-1"
					style={{ alignItems: type == "left" ? "flex-end" : "flex-start" }}
				>
					{Platform.select({
						web: <LogPanelSignal type={type} />,
						native: <LogPanelShared type={type} leftX={x} />,
					})}
					<ActionBtn
						type={type}
						action="lock"
					/>
					<ActionBtn
						type={type}
						action="type"
					/>
				</View>
			</Animated.View>
		</GestureDetector>
	);
}

type ActionBtnProps = {
	type: "left" | "right";
	action: Actions;
};

const actions = {
	"lock": ["unlocked", "locked-closed", "locked-open"] as const,
	"type": ["front", "back", "slide"] as const,
};

function ActionBtn({ type, action }: ActionBtnProps) {
	const validValues = actions[action];
	const actionAtoms = useAtomValue(__actions);
	const [lAction, setLAction] = useAtom(actionAtoms[action].left);
	const [rAction, setRAction] = useAtom(actionAtoms[action].right);

	const { showActionSheetWithOptions } = useActionSheet();

	const onPress = () => {
		const sheetOptions = ["default", ...validValues, "exit"] as const;
		const defaultOpt = 0;
		const cancelOpt = sheetOptions.length - 1;

		showActionSheetWithOptions({
			options: sheetOptions as unknown as string[],
			cancelButtonIndex: cancelOpt,
			destructiveButtonIndex: defaultOpt,
		}, (selectedIndex) => {
			/**
			 * beware of undefined and 0 bugs!
			 */
			if (selectedIndex == undefined) return;
			if (!validValues.includes(sheetOptions[selectedIndex])) return;
			const set = type == "left" ? setLAction : setRAction;
			set(sheetOptions[selectedIndex]);
		});
	};

	return (
		<Button
			onPress={onPress}
			title={`type: ${type == "left" ? lAction : rAction}`}
		/>
	);
}

type SharedPanelProps = {
	leftX: Animated.SharedValue<number>;
	type: "left" | "right";
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

type PanelProps = {
	type: "left" | "right";
};

function LogPanelSignal({ type }: PanelProps) {
	const translateX = hashAtoms["x"][type];
	useLogRenders("log-panel-signal-" + type);
	return (
		<Text className="w-1/3 text-xl bg-purple-600 text-slate-100">
			{$(translateX).toFixed(2)}
		</Text>
		// <TextInput
		// 	editable={false}
		// 	value="x value"
		// 	className="w-1/3 text-xl bg-purple-600 text-slate-100"
		// />
	);
}

function LogPanelShared({ leftX, type }: SharedPanelProps) {
	useLogRenders("log-panel-shared-" + type);
	return (
		<AnimatedText
			className="text-xl bg-purple-600 text-slate-100"
			text={leftX}
		/>
	);
}

const LogPanelRef = forwardRef<TextInput, PanelProps>(({ type }, ref) => {
	// const setTranslationX = () => {
	// 	/**
	// 	 * @abstract setNativeProps pattern
	// 	 * no working on TextNode <Text />
	// 	 * they will add setNativeProps
	// 	 * o fabric soon
	// 	 * @see https://github.com/facebook/react-native/commit/874881e73e83c03df5f1a376972f6d2e6e5e1214
	// 	 */
	// 	ref.current.setNativeProps({ text: x.value.toFixed(2) });
	// };

	/**
	 * @abstract animated text pattern
	 * fallback with ref
	 * add the code below on the parent node
	 */
	useLogRenders("log-panel-ref-" + type);
	return (
		<TextInput
			ref={ref}
			editable={false}
			value="x value"
			className="w-1/3 text-xl bg-purple-600 text-slate-100"
		/>
	);
});

function useLogRenders(name: string) {
	const rerender = useRef(0);
	useEffect(() => {
		rerender.current += 1;
		console.log(`${name}: `, rerender.current);
	});
}
