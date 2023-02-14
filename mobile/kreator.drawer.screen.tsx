import { atom } from "jotai/vanilla";
import { useAtomValue, useSetAtom } from "jotai/react";
import { $ } from "jotai-signal";
import { useEffect, useRef } from "react";
import { Dimensions, Text, View } from "react-native";
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
    const setX = useSetAtom(_leftTranslationX);
    // shared
    const x = useSharedValue(INITIAL_LEFT_X);
    const cX = useSharedValue(0);

    const setTranslationX = () => {
        setX(x.value);
    };

    useLogRenders('content');

    const gesture = Gesture.Pan().onStart(() => {
        cX.value = x.value;
    }).onUpdate(({ translationX }) => {
        x.value = translationX + cX.value;
        runOnJS(setTranslationX)();
    });

    const aStyle = useAnimatedStyle(() => {
        return {
            borderRadius: 60,
            width: DRAWER_WIDTH,
            transform: [
                { translateX: x.value },
            ],
        };
    });

    // console.log(settings)
    return (
        <View className="flex flex-row flex-1 bg-indigo-400 opacity-50">
            {
                /**
                 * for testing on the fly
                 * we should turn off the helper views!
                 * @todo toggle helper views
                 * should toggle drawer functionality too
                 */
            }
            <GestureDetector gesture={gesture}>
                <Animated.View
                    className="absolute top-0 bottom-0 z-10 bg-yellow-400 border-t-8 border-b-8 border-r-8 border-indigo-600 opacity-50"
                    style={aStyle}
                >
                </Animated.View>
            </GestureDetector>

            <View
                className="absolute top-0 bottom-0 z-20 bg-red-400 border-t-8 border-b-8 border-l-8 border-red-600 opacity-50"
                style={{
                    borderRadius: 60,
                    /**
                     * I use right in order to
                     * hide the right border radius
                     * since we don't want to show them!
                     * would be cool to have
                     * something like: "48% 0% 0% 49% / 23% 0% 0% 25%"
                     * @see https://9elements.github.io/fancy-border-radius/full-control.html#23.48.0.49-75.100.100.100-.
                     */
                    // width: DRAWER_THRESHOLD.right, borderRadius: 60
                    width: DRAWER_WIDTH,
                    right: -1 * (DRAWER_WIDTH - DRAWER_THRESHOLD.right),
                }}
            >
                <LogPanel$ />
            </View>
        </View>
    );
}

function LogPanel() {
    const leftX = useAtomValue(_leftTranslationX);
    useLogRenders('log-panel');
    return (
        <View className="justify-center flex-1">
            <Text className="text-xl bg-purple-600 text-slate-100">
                {leftX}
            </Text>
        </View>
    )
}

function LogPanel$() {
    useLogRenders('$log-panel');
    return (
        <View className="justify-center flex-1">
            <Text className="text-xl bg-purple-600 text-slate-100">
                {$(_leftTranslationX)}
            </Text>
        </View>
    )
}

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
    return (
        <DrawerLayout
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
                // console.log(status)
            }}
        >
            <LeftDrawer />
        </DrawerLayout>
    );
}
