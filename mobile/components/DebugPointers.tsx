import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";

interface Pointer {
    visible: boolean;
    x: number;
    y: number;
}

function DebugPointers({ children }: { children: React.ReactNode }) {
    const trackedPointers: Animated.SharedValue<Pointer>[] = [];
    const active = useSharedValue(false);

    for (let i = 0; i < 12; i++) {
        trackedPointers[i] = useSharedValue<Pointer>({
            visible: false,
            x: 0,
            y: 0,
        });
    }

    const gesture = Gesture.Manual()
        .onTouchesMove((e, _manager) => {
            for (const touch of e.changedTouches) {
                console.log(touch.id);
                trackedPointers[touch.id].value = {
                    visible: true,
                    x: touch.x,
                    y: touch.y,
                };
            }
        })
        .onTouchesUp((e, manager) => {
            for (const touch of e.changedTouches) {
                trackedPointers[touch.id].value = {
                    visible: false,
                    x: touch.x,
                    y: touch.y,
                };
            }

            if (e.numberOfTouches === 0) {
                manager.end();
            }
        })
        .onStart(() => {
            active.value = true;
        })
        .onEnd(() => {
            active.value = false;
        });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={{ flex: 1, zIndex: 10 }}>
                {trackedPointers.map((pointer, index) => (
                    <PointerElement pointer={pointer} active={active} key={index} />
                ))}
                {children}
            </Animated.View>
        </GestureDetector>
    );
}

function PointerElement(props: {
    pointer: Animated.SharedValue<Pointer>;
    active: Animated.SharedValue<boolean>;
}) {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: props.pointer.value.x },
            { translateY: props.pointer.value.y },
            {
                scale: (props.pointer.value.visible ? 1 : 0) *
                    (props.active.value ? 1.3 : 1),
            },
        ],
        backgroundColor: props.active.value ? "red" : "brown",
    }));

    return <Animated.View style={[styles.pointer, animatedStyle]} />;
}

const styles = StyleSheet.create({
    pointer: {
        zIndex: 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "red",
        position: "absolute",
        marginStart: -30,
        marginTop: -30,
    },
});
