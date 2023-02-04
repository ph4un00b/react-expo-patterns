import { Fragment, ReactElement } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
const { width } = Dimensions.get("window");

const ASPECT_RATIO = 228 / 362;
const CARD_WIDTH = width * 0.8;
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

export function GestureSortableScreen() {
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

    const currentActiveCardId = useSharedValue(-1);

    useAnimatedReaction(() => {
        return currentActiveCardId;
    }, (id) => {
        console.log({ currentActiveCardId: id.value });
    });
    // console.log({ offsets });
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
                            currentActiveCardId={currentActiveCardId}
                        >
                            {child}
                        </SortableItem>
                    </Fragment>
                );
            })}
        </ScrollView>
    );
}

function SortableItem(
    { itemIdx, offsets, children, itemHeight, itemWidth, currentActiveCardId }: {
        itemIdx: number;
        offsets: Array<{ y: Animated.SharedValue<number> }>;
        children: ReactElement;
        itemWidth: number;
        itemHeight: number;
        currentActiveCardId: Animated.SharedValue<number>;
    },
) {
    const currentOffsetY = offsets[itemIdx];
    const x = useSharedValue(0);
    const y = useSharedValue<number>(currentOffsetY.y.value);
    const ctxY = useSharedValue(0);
    const isCardActive = useSharedValue(false);
    const gesture = Gesture.Pan()
        .onStart(() => {
            isCardActive.value = true;
            currentActiveCardId.value = itemIdx;
            ctxY.value = y.value;
        })
        .onUpdate(({ translationX, translationY }) => {
            x.value = translationX;
            y.value = translationY + ctxY.value;
        })
        .onEnd(() => {
            /**
             * @abstract bouncing back pattern
             */
            x.value = withSpring(0);
            y.value = withTiming<number>(
                currentOffsetY.y.value,
                {},
                () => {
                    isCardActive.value = false;
                },
            );
        });

    console.log({ itemIdx, currentOffsetY: y.value.toFixed(2) });
    const aStyle = useAnimatedStyle(() => {
        // console.log({ x: x.value, y: y.value })
        return {
            zIndex: currentActiveCardId.value == itemIdx ? 1000 : 0,
            borderWidth: currentActiveCardId.value == itemIdx ? 2 : 0,
            borderColor: "red",
            position: "absolute",
            top: 0,
            left: 0,
            width: itemWidth,
            height: itemHeight,
            transform: [
                { translateY: y.value },
                { translateX: x.value },
                { scale: withSpring(isCardActive.value ? 1.4 : 1) },
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
