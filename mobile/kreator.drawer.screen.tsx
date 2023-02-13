import { atom, useAtomValue } from "jotai";
import { Dimensions, Text, View } from "react-native";
import { DrawerLayout } from "react-native-gesture-handler";

export function KreatorDrawerScreen() {
    return <RightDrawer />;
}

const { width: DRAWER_WIDTH } = Dimensions.get("window");
const DRAWER_THRESHOLD = { left: DRAWER_WIDTH * 0.4, right: DRAWER_WIDTH * 0.4 };
const DRAWER_DARKED_COLOR = { left: "transparent", right: "transparent" };

const _settings = atom({
    one: 1,
    two: 2,
    three: 3,
})

function Content() {
    const json = useAtomValue(_settings)

    return (
        <View className="flex flex-row flex-1 bg-indigo-400 opacity-50">
            {/**
             * for testing on the fly
             * we should turn off the helper views!
             * @todo toggle helper views
             * should toggle drawer functionality too
             * */}
            <View
                className="absolute top-0 bottom-0 z-10 bg-yellow-400 border-t-8 border-b-8 border-r-8 border-indigo-600 opacity-50"
                style={{
                    borderRadius: 60,
                    width: DRAWER_WIDTH,
                    // left: -1 * (DRAWER_WIDTH - DRAWER_THRESHOLD.left)
                    left: -1 * (DRAWER_WIDTH - DRAWER_THRESHOLD.left)
                }}
            >
                {/**
                 * item-end to show the name
                 * we might display the name at the top
                 */}
                <View className="items-end justify-center flex-1">
                    <Text className="text-3xl text-red-100 bg-purple-600">
                        jamon!
                    </Text>
                </View>
            </View>
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
                    right: -1 * (DRAWER_WIDTH - DRAWER_THRESHOLD.right)
                }}
            >
                <View className="justify-center flex-1">
                    <Text className="text-xl bg-purple-600 text-slate-100">
                        MESSAGES
                        {JSON.stringify(json, null, 2)}
                    </Text>
                </View>
            </View>
        </View >
    );
}

function LeftDrawer() {
    return (
        <DrawerLayout
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
