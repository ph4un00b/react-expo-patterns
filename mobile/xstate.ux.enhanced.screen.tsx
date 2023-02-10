import { MutableRefObject, useRef } from "react";
import { Dimensions, Text, View } from "react-native";
import { DrawerLayout, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";

export function GestureUXEnhancedScreen() {
    return <RightDrawer />;
}

const { width: DRAWER_WIDTH } = Dimensions.get("window");
const DRAWER_THRESHOLD = DRAWER_WIDTH;
const DRAWER_DARKED_COLOR = { left: "transparent", right: "transparent" };

function Content(
    { left, right, isLeftBack, isLeftOpening, isLeftDragging }: {
        left: SharedValue<number>;
        right: SharedValue<number>;
        isLeftBack: SharedValue<boolean>;
        isLeftOpening: SharedValue<boolean>;
        isLeftDragging: SharedValue<boolean>;
    },
) {
    console.log({ left, right });

    const leftTranslateX = useDerivedValue(() => {
        // if (isLeftBack.value) {
        //     return withTiming(0);
        // } else if (isLeftOpening.value) {
        //     return withTiming(DRAWER_WIDTH);
        // } else {
        return left.value;
        // }
    });

    const astyle = useAnimatedStyle(() => {
        console.log(leftTranslateX.value);
        return {
            transform: [
                { translateX: leftTranslateX.value },
            ],
        };
    });

    return (
        <Animated.View
            className="absolute top-0 bottom-0 left-0 right-0 flex flex-row flex-1 bg-indigo-400"
            style={[{
                width: DRAWER_THRESHOLD,
            }, astyle]}
        >
            <View
                className="absolute top-0 bottom-0 left-0 z-10 bg-yellow-400 opacity-50"
                style={{ width: DRAWER_THRESHOLD }}
            >
                <Text>
                    CAMERA
                </Text>
            </View>
            <View
                className="absolute top-0 bottom-0 right-0 z-20 bg-red-400 opacity-50"
                style={{ width: DRAWER_THRESHOLD }}
            >
                <Text className="absolute bottom-0">
                    MESSAGES
                </Text>
            </View>
        </Animated.View>
    );
}

function LeftDrawer({ right }: { right: SharedValue<number> }) {
    const left = useSharedValue(0);
    const isLeftBack = useSharedValue(false);
    const isLeftOpening = useSharedValue(false);
    const isLeftDragging = useSharedValue(false);
    const gesture = useRef<DrawerLayout>(null!);
    const leftDrag = useRef(null!)

    return (
        <DrawerLayout
            ref={gesture}
            overlayColor={DRAWER_DARKED_COLOR.left}
            edgeWidth={DRAWER_THRESHOLD}
            drawerWidth={DRAWER_WIDTH}
            drawerPosition="right"
            drawerType="front"
            drawerBackgroundColor="#ddd"
            renderNavigationView={() => (
                <View>
                    <Text>I am in the RIGHT drawer!</Text>
                </View>
            )}
            onGestureRef={(ref) => {
                // console.log(ref.defaultProps)
            }}

            // renderNavigationView={(progress) => {
            //     console.log(progress)
            // }}
            onDrawerStateChanged={(...props) => {
                /**
                 *  ['Dragging', false]
                 *  ['Settling', false]
                 *  ['Idle', false]
                 */
                console.log(props);
                const [state, val] = props;

                if (state == "Dragging" && val == true) {
                    isLeftDragging.value = true;
                }
                if (state == "Settling" && val == false) {
                    left.value = 0;

                    isLeftBack.value = true;
                    isLeftDragging.value = false;
                }

                if (state == "Settling" && val == true) {
                    left.value = DRAWER_WIDTH;

                    isLeftOpening.value = true;
                    isLeftBack.value = false;
                    isLeftDragging.value = false;
                }

                if (state == "Idle" && val == false) {
                    // reset
                    isLeftOpening.value = false;
                    isLeftBack.value = false;
                    isLeftDragging.value = false;
                }
            }}
            onDrawerSlide={(status) => {
                /**
                 * dragX is only working on web
                 * on android is always 0
                 */
                console.log(gesture.current.state, null, 2)
                // const dragX = JSON.parse(JSON.stringify(gesture.current.state, null, 2)).dragX

                /**
                 * status
                 * from 0 to 1
                 * on both sides
                 */
                left.value = status
            }}
        >
            <Content
                left={left}
                isLeftDragging={isLeftDragging}
                isLeftOpening={isLeftOpening}
                isLeftBack={isLeftBack}
                right={right}
            />
        </DrawerLayout>
    );
}

function RightDrawer() {
    const right = useSharedValue(0);
    const gesture = useRef<DrawerLayout>(null!);

    return (
        <DrawerLayout
            ref={gesture}
            overlayColor={DRAWER_DARKED_COLOR.right}
            edgeWidth={DRAWER_THRESHOLD}
            drawerWidth={DRAWER_WIDTH}
            drawerPosition="left"
            drawerType="front"
            drawerBackgroundColor="#ddd"
            renderNavigationView={() => (
                <View>
                    <Text>I am in the LEFT drawer!</Text>
                </View>
            )}
            onDrawerClose={() => console.log("closed!")}
            onDrawerOpen={() => console.log("open!")}
            onDrawerStateChanged={(...props) => {
                /**
                 *  ['Dragging', false]
                 *  ['Settling', false]
                 *  ['Idle', false]
                 */
                const [state, val] = props;
                // if (state == "Dragging")
            }}
            onDrawerSlide={(status) => {
                // console.log(JSON.stringify(gesture.current.state, null, 2))
                // console.log(status)

                right.value = status;
            }}
        >
            <LeftDrawer right={right} />
        </DrawerLayout>
    );
}
