import { atom } from "jotai/vanilla";
import { useAtomValue, useSetAtom } from "jotai/react";
import { $ } from "jotai-signal";
import { forwardRef, useEffect, useRef } from "react";
import { Dimensions, Platform, Text, TextInput, View } from "react-native";
import {
    DrawerLayout,
    Gesture,
    GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { AnimatedText } from "./utils/animated-text";
import { Portal } from "@gorhom/portal";

export function KreatorDrawerScreen() {
    return <RightDrawer />;
}

const { width: DRAWER_WIDTH } = Dimensions.get("window");
const DRAWER_THRESHOLD = {
    left: DRAWER_WIDTH * 0.3,
    right: DRAWER_WIDTH * 0.4,
};
const DRAWER_DARKED_COLOR = { left: "transparent", right: "transparent" };

const INITIAL_LEFT_X = -1 * (DRAWER_WIDTH - DRAWER_THRESHOLD.left);

const _toggleDrawers = atom(false);
const _leftTranslationX = atom(INITIAL_LEFT_X);

// derived
const _settings = atom((r) => ({
    isOpen: r(_toggleDrawers),
    leftX: r(_leftTranslationX),
}));

function Content() {
    useLogRenders("content");

    return (
        <View className="flex flex-row flex-1 bg-indigo-400 opacity-50">
            <Portal hostName="global-log">
                <Text className="text-slate-100">
                    from portal
                </Text>
            </Portal>
            {
                /**
                 * for testing on the fly
                 * we should turn off the helper views!
                 * @todo toggle helper views
                 * should toggle drawer functionality too
                 */
            }
            <DrawerHelper
                type="left"
                initialX={-1 * (DRAWER_WIDTH - DRAWER_THRESHOLD.left)}
            />
            <DrawerHelper
                type="right"
                initialX={1 * (DRAWER_WIDTH - DRAWER_THRESHOLD.right)}
            />
        </View>
    );
}

type HelperProps = {
    type: "left" | "right";
    initialX: number;
};

function DrawerHelper({ type, initialX }: HelperProps) {
    const staticStyles = type == "left"
        ? "absolute top-0 bottom-0 z-10 bg-yellow-400 border-t-8 border-b-8 border-r-8 border-indigo-600 opacity-50"
        : "absolute top-0 bottom-0 z-20 bg-red-400 border-t-8 border-b-8 border-l-8 border-red-600 opacity-50";
    const ref = useRef<TextInput>(null!);
    // shared
    const x = useSharedValue(initialX);
    const cX = useSharedValue(0);

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
            cX.value = x.value;
        })
        .onUpdate(({ translationX }) => {
            x.value = translationX + cX.value;
            if (Platform.OS == "web") runOnJS(setTranslationX)();
        });

    const animatedStyles = useAnimatedStyle(() => {
        return {
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
                className={staticStyles}
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
                console.log(status)
            }}
        >
            <LeftDrawer />
        </DrawerLayout>
    );
}
