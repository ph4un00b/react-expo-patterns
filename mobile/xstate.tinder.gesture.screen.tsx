import {
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    forwardRef,
    Ref,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
    Gesture,
    GestureDetector,
    RectButton,
} from "react-native-gesture-handler";
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

export const profiles: ProfileModel[] = [
    {
        id: "1",
        name: "Caroline",
        age: 24,
        profile: require("./assets/necro.webp"),
    },
    {
        id: "2",
        name: "Jack",
        age: 30,
        profile: require("./assets/necro.webp"),
    },
    {
        id: "3",
        name: "Anet",
        age: 21,
        profile: require("./assets/necro.webp"),
    },
    {
        id: "4",
        name: "John",
        age: 28,
        profile: require("./assets/necro.webp"),
    },
];

export function GestureTinder() {
    return <Profiles {...{ profiles }} />;
}

interface ProfilesProps {
    profiles: ProfileModel[];
}

function Profiles({ profiles: defaultProfiles }: ProfilesProps) {
    const topCard = useRef<SwiperRef>(null);
    const [profiles, setProfiles] = useState(defaultProfiles);
    const onSwipe = useCallback(() => {
        console.log("re-order");
        setProfiles(
            profiles.slice(0, profiles.length - 1),
        );
    }, [profiles]);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.screenHeader}>
                <Icon name="user" size={32} color="gray" />
                <Icon name="message-circle" size={32} color="gray" />
            </View>
            <View style={styles.cards}>
                {profiles.map((profile, index) => {
                    const onTop = index == profiles.length - 1;
                    const ref = onTop ? topCard : null;
                    return (
                        <Swipeable
                            ref={ref}
                            key={profile.id}
                            profile={profile}
                            onSwipe={onSwipe}
                            onTop={onTop}
                        />
                    );
                })}
            </View>
            <View style={styles.screenFooter}>
                <RectButton
                    style={styles.circle}
                    onPress={() => topCard.current?.swipeLeft()}
                >
                    <Icon name="x" size={32} color="#ec5288" />
                </RectButton>
                <RectButton
                    style={styles.circle}
                    onPress={() => topCard.current?.swipeRight()}
                >
                    <Icon name="heart" size={32} color="#6ee3b4" />
                </RectButton>
            </View>
        </SafeAreaView>
    );
}

interface SwiperProps {
    onSwipe: () => void;
    profile: ProfileModel;
    onTop: boolean;
}

type SwiperRef = {
    swipeLeft: () => void;
    swipeRight: () => void;
};

const { width, height } = Dimensions.get("window");
const alpha = Math.PI / 12; // 30 degrees
const Point = Math.sin(alpha) * height +
    Math.cos(alpha) * width;

console.log({ Point });
const snapPoints = [-Point, 0, Point];

const Swipeable = forwardRef(
    ({ profile, onTop, onSwipe }: SwiperProps, ref: Ref<SwiperRef>) => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        /**
         * @abstract imperative handler pattern
         */
        useImperativeHandle(
            ref,
            () => {
                return {
                    swipeLeft() {
                        swipeOrBounceBack(translateX, -Point, 10, onSwipe, translateY, 10);
                    },
                    swipeRight() {
                        swipeOrBounceBack(translateX, Point, 10, onSwipe, translateY, 10);
                    },
                };
            },
        );

        const ctx = useSharedValue({ x: 0, y: 0 });
        const gesture = Gesture.Pan()
            .onStart(() => {
                ctx.value = { x: translateX.value, y: translateY.value };
            })
            .onUpdate(({ translationX, translationY }) => {
                translateX.value = translationX + ctx.value.x;
                translateY.value = translationY + ctx.value.y;
            })
            .onEnd(({ velocityX, velocityY }) => {
                const computedEnd = snapPoint(
                    translateX.value,
                    velocityX,
                    snapPoints,
                );
                console.log({ end: computedEnd });
                swipeOrBounceBack(
                    translateX,
                    computedEnd,
                    velocityX,
                    onSwipe,
                    translateY,
                    velocityY,
                );
            });
        return (
            <GestureDetector gesture={gesture}>
                <Animated.View style={StyleSheet.absoluteFill}>
                    <Profile
                        translateX={translateX}
                        translateY={translateY}
                        profile={profile}
                        onTop={onTop}
                    />
                </Animated.View>
            </GestureDetector>
        );
    },
);

export interface ProfileModel {
    id: string;
    name: string;
    age: number;
    profile: number;
}

interface CardProps {
    profile: ProfileModel;
    onTop: boolean;
    translateX: Animated.SharedValue<number>;
    translateY: Animated.SharedValue<number>;
}

function swipeOrBounceBack(
    translateX: SharedValue<number>,
    computedEnd: number,
    velocityX: number,
    onSwipe: () => void,
    translateY: SharedValue<number>,
    velocityY: number,
) {
    "worklet";
    /**
     * @abstract bouncing back pattern
     */
    translateX.value = withSpring(computedEnd, {
        velocity: velocityX,
        /**
         * @fix animation preventing
         * card reordering by
         * increasing velocity
         */
        restSpeedThreshold: computedEnd == 0 ? 0.001 : 500,
        restDisplacementThreshold: computedEnd == 0 ? 0.001 : 500,
    }, () => {
        /**
         * make new card on top
         * swipeable
         */
        if (computedEnd == 0) {
            return;
        }
        runOnJS(onSwipe)();
    });
    translateY.value = withSpring(0, { velocity: velocityY });
}

function Profile({ profile, translateX, translateY }: CardProps) {
    const aStyle = useAnimatedStyle(() => {
        const num = interpolate(
            translateX.value,
            [-width * 0.5, 0, width * 0.5],
            // angle
            [alpha, 0, -alpha],
            Extrapolate.CLAMP,
        );

        console.log({ num, width, alpha });
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotateZ: `${num}rad` },
            ],
        };
    });

    const aLikeStyle = useAnimatedStyle(() => {
        const num = interpolate(
            translateX.value,
            [0, width * 0.5],
            // angle
            [0, 1],
            Extrapolate.CLAMP,
        );

        console.log({ num, width, alpha });
        return {
            opacity: num,
        };
    });

    const aNopeStyle = useAnimatedStyle(() => {
        const num = interpolate(
            translateX.value,
            [-width * 0.5, 0],
            // angle
            [1, 0],
            Extrapolate.CLAMP,
        );

        console.log({ num, width, alpha });
        return {
            opacity: num,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    ...StyleSheet.absoluteFillObject,
                    // @ts-ignore for webs
                    willChange: "transform",
                },
                aStyle,
            ]}
        >
            <Image style={styles.image} source={profile.profile} />
            <View style={styles.overlay}>
                <View style={styles.cardHeader}>
                    <Animated.View style={[styles.like, aLikeStyle]}>
                        <Text style={styles.likeLabel}>LIKE</Text>
                    </Animated.View>
                    <Animated.View style={[styles.nope, aNopeStyle]}>
                        <Text style={styles.nopeLabel}>NOPE</Text>
                    </Animated.View>
                </View>
                <View style={styles.cardFooter}>
                    <Text style={styles.name}>{profile.name}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: "space-evenly",
    },
    screenHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
    },
    cards: {
        flex: 1,
        marginHorizontal: 16,
        zIndex: 100,
    },
    screenFooter: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 16,
    },
    circle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        shadowColor: "gray",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 2,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        borderRadius: 8,
    },
    overlay: {
        flex: 1,
        justifyContent: "space-between",
        padding: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardFooter: {
        flexDirection: "row",
    },
    name: {
        color: "white",
        fontSize: 32,
    },
    like: {
        borderWidth: 4,
        borderRadius: 5,
        padding: 8,
        borderColor: "#6ee3b4",
    },
    likeLabel: {
        fontSize: 32,
        color: "#6ee3b4",
        fontWeight: "bold",
    },
    nope: {
        borderWidth: 4,
        borderRadius: 5,
        padding: 8,
        borderColor: "#ec5288",
    },
    nopeLabel: {
        fontSize: 32,
        color: "#ec5288",
        fontWeight: "bold",
    },
});
