import { Portal } from "@gorhom/portal";
import { setDeep } from "@react-three/fiber/dist/declarations/src/core/utils";
import { useMachine } from "@xstate/react";
import { Fragment, ReactElement } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { assign } from "xstate";
import { sortableMachine } from "./xstate.sortable";
const { width } = Dimensions.get("window");

const ASPECT_RATIO = 228 / 362;
const CARD_WIDTH = width * 0.5;
const CARD_HEIGHT = CARD_WIDTH * ASPECT_RATIO;

const assets = [
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
    require("./assets/necro.webp"),
];

enum Cards {
    Card1 = 0,
    Card2 = 1,
    Card3 = 2,
    Card4 = 3,
    Card5 = 4,
    Card6 = 5,
}

const cards = [Cards.Card1, Cards.Card2, Cards.Card3, Cards.Card4];

export function RefactoredSortableScreen() {
    return (
        <SortableList itemWidth={width} itemHeight={CARD_HEIGHT + 32}>
            {cards.map((card, index) => (
                <View style={styles.card} key={index}>
                    <Card card={card} />
                </View>
            ))}
        </SortableList>
    );
}

interface CardProps {
    card: Cards;
}

function Card({ card }: CardProps) {
    return <Image style={styles.cardImg} source={assets[card]} />;
}

interface SortableListProps {
    children: ReactElement[];
    itemWidth: number;
    itemHeight: number;
}

function SortableList({ children, itemHeight, itemWidth }: SortableListProps) {
    const offsets = children.map((_, idx) => ({
        y: useSharedValue(itemHeight * idx),
    }));

    return (
        <ScrollView
            contentContainerStyle={{
                height: itemHeight * children.length,
                width: itemWidth,
            }}
        >
            {children.map((child, idx) => {
                return (
                    <Fragment key={idx}>
                        <SortableItem
                            itemIdx={idx}
                            offsets={offsets}
                            itemWidth={itemWidth}
                            itemHeight={itemHeight}
                        >
                            {child}
                        </SortableItem>
                    </Fragment>
                );
            })}
        </ScrollView>
    );
}

type SortableProps = {
    itemIdx: number;
    offsets: Array<{ y: Animated.SharedValue<number> }>;
    children: ReactElement;
    itemWidth: number;
    itemHeight: number;
};

function SortableItem(
    {
        itemIdx: itemId,
        offsets: boundaries,
        children,
        itemHeight: h,
        itemWidth,
    }: SortableProps,
) {
    const start = boundaries[itemId];
    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const safeX = useSharedValue(0);
    const safeY = useSharedValue(0);
    const isDragging = useSharedValue(false);
    const isFinishing = useSharedValue(false);
    const isIdle = useSharedValue(true);

    const gesture = Gesture.Pan()
        .onStart(() => {
            isIdle.value = false;
            isDragging.value = true;
            setSafeXY: {
                safeX.value = x.value;
                safeY.value = start.y.value;
            }
        })
        .onUpdate(({ translationX, translationY }) => {
            updateXY: {
                x.value = translationX + safeX.value;
                y.value = translationY + safeY.value;
            }

            const computedY = h * (Math.round(y.value / h));

            swapIfReachNewCell: {
                boundaries.forEach((b, idx) => {
                    if (itemId == idx) return;
                    if (b.y.value != computedY) return;
                    [b.y.value, start.y.value] = [start.y.value, b.y.value];
                });
            }
        })
        .onEnd(({ velocityX }) => {
            isFinishing.value = true;
            bouncingBackX: {
                x.value = withSpring(0, {
                    stiffness: 100,
                    mass: 1,
                    damping: 10,
                    overshootClamping: false,
                    restSpeedThreshold: 0.001,
                    restDisplacementThreshold: 0.001,
                    velocity: velocityX,
                });
            }
            bouncingToStartY: {
                y.value = withTiming<number>(
                    start.y.value,
                    {},
                    () => {
                        isDragging.value = false;
                        isFinishing.value = false;
                    },
                );
            }
        })
        .onFinalize(() => {
            isIdle.value = true;
        });

    const translateY = useDerivedValue(() => {
        return isDragging.value ? y.value : withTiming(start.y.value);
    });

    const aStyle = useAnimatedStyle(() => {
        return {
            zIndex: isDragging.value || isFinishing.value ? 100 : 0,
            borderWidth: isDragging.value || isFinishing.value ? 2 : 0,
            borderColor: "red",
            position: "absolute",
            top: 0,
            left: 0,
            width: itemWidth,
            height: h,
            transform: [
                { translateX: x.value },
                { translateY: translateY.value },
                // scale pattern
                { scale: withSpring(isDragging.value ? 1.1 : 1) },
            ],
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    {
                        // @ts-ignore for webs
                        willChange: "transform",
                    },
                    aStyle,
                ]}
            >
                {children}
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    card: {
        height: CARD_HEIGHT,
        width: "100%",
        alignItems: "center",
        marginTop: 32,
    },
    cardImg: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
    },
});
