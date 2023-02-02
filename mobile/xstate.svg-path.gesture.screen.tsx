import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { ReText, round, Vector } from "react-native-redash";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import * as shape from "d3-shape";
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDecay,
} from "react-native-reanimated";
import { getPointAtLength, parsePath } from "./utils/svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";

const { width } = Dimensions.get("window");
const height = width;
const data: [number, number][] = [
    { x: new Date(2020, 5, 1), y: 4371 },
    { x: new Date(2020, 5, 2), y: 6198 },
    { x: new Date(2020, 5, 3), y: 5310 },
    { x: new Date(2020, 5, 4), y: 7188 },
    { x: new Date(2020, 5, 5), y: 8677 },
    { x: new Date(2020, 5, 6), y: 5012 },
].map((p) => [p.x.getTime(), p.y]);

const domain = {
    x: [Math.min(...data.map(([x]) => x)), Math.max(...data.map(([x]) => x))],
    y: [Math.min(...data.map(([, y]) => y)), Math.max(...data.map(([, y]) => y))],
};

const range = {
    x: [0, width],
    y: [height, 0],
};

const scale = (v: number, d: number[], r: number[]) => {
    "worklet";
    return interpolate(v, d, r, Extrapolate.CLAMP);
};

const scaleInvert = (y: number, d: number[], r: number[]) => {
    "worklet";
    return interpolate(y, r, d, Extrapolate.CLAMP);
};

const d = shape
    .line()
    .x(([x]) => scale(x, domain.x, range.x))
    .y(([, y]) => scale(y, domain.y, range.y))
    .curve(shape.curveBasis)(data) as string;

const graphPath = parsePath(d);
// console.log({ graphPath });

export function GestureGraph() {
    /**
     * @abstract getting 4 values
     */
    // const point = {
    //     coord: { x: 0, y: 0 },
    //     data: {
    //         x: scaleInvert(0, domain.x, range.x),
    //         y: scaleInvert(0, domain.y, range.y),
    //     },
    // };
    const len = useSharedValue(0);
    const p = useDerivedValue(() => {
        const coord = getPointAtLength(graphPath, len.value);
        return {
            coord,
            data: {
                x: scaleInvert(coord.x, domain.x, range.x),
                y: scaleInvert(coord.y, domain.y, range.y),
            },
        };
    });
    return (
        <View style={styles.container}>
            <Label point={p} />
            <View>
                <Svg {...{ width, height }}>
                    <Defs>
                        <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
                            <Stop stopColor="#CDE3F8" offset="0%" />
                            <Stop stopColor="#eef6fd" offset="80%" />
                            <Stop stopColor="#FEFFFF" offset="100%" />
                        </LinearGradient>
                    </Defs>
                    <Path
                        fill="transparent"
                        stroke="#367be2"
                        strokeWidth={50}
                        d={d}
                    />
                    <Path
                        d={`${d}  L ${width} ${height} L 0 ${height}`}
                        fill="url(#gradient)"
                    />
                </Svg>
                <Cursor path={graphPath} length={len} point={p} />
            </View>
        </View>
    );
}

type BezierCurve = {
    from: Vector;
    to: Vector;
    c1: Vector;
    c2: Vector;
    start: number;
    end: number;
};

type PathProps = {
    curves: BezierCurve[];
    length: number;
};

const CURSOR_SIZE = 100;

type CursorProps = {
    path: PathProps;
    length: Animated.SharedValue<number>;
    point: Animated.SharedValue<DataPoint>;
};

function Cursor({ path, length, point }: CursorProps) {
    const offsetX = useSharedValue(0);
    const gesture = Gesture.Pan()
        .onStart(() => {
            /**
             * @abstract remember pattern
             */
            offsetX.value = interpolate(
                length.value,
                [0, path.length],
                /**
                 * switching normalization
                 */
                [0, width],
                Extrapolate.CLAMP,
            );
        })
        .onUpdate((e) => {
            length.value = interpolate(
                offsetX.value + e.translationX,
                [0, width],
                [0, path.length],
                Extrapolate.CLAMP,
            );
        })
        .onEnd(({ velocityX }) => {
            if (Platform.OS != "web") {
                /**
                 * @abstract on web
                 * decay behaves different
                 * at least in this sample!
                 */
                length.value = withDecay({
                    velocity: velocityX,
                    clamp: [0, path.length],
                });
            }
        });

    const astyle = useAnimatedStyle(() => {
        const { coord } = point.value;
        const translateX = coord.x - CURSOR_SIZE / 2;
        const translateY = coord.y - CURSOR_SIZE / 2;
        return {
            transform: [{ translateX }, { translateY }],
        };
    });
    return (
        <View style={StyleSheet.absoluteFill}>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[astyle, styles.cursorContainer]}>
                    <View style={styles.cursor} />
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

type DataPoint = {
    coord: {
        x: number;
        y: number;
    };
    data: {
        x: number;
        y: number;
    };
};

type LabelProps = {
    point: Animated.SharedValue<DataPoint>;
};

function Label({ point }: LabelProps) {
    const [priceText, setDate] = useState("");
    const [dateText, setPrice] = useState("");

    const date = useDerivedValue(() => {
        const tmp = new Date(point.value.data.x).toLocaleDateString("es-MX", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        /**
         * todo: lift up this logic at component level
         * <WebLabel/> and <Label/>
         */
        runOnJS(() => {
            setDate(tmp)
        })()

        return tmp;
    }
    );

    const price = useDerivedValue(() => {
        const tmp = `$${round(point.value.data.y, 2).toLocaleString("es-MX", {
            currency: "USD",
        })
            }`;

        runOnJS(() => {
            setPrice(tmp)
        })()

        return tmp;
    });

    if (Platform.OS == "web") {
        return (
            <View>
                <Text style={styles.date}>{dateText}</Text>
                <Text style={styles.date}>{priceText}</Text>
            </View>
        );
    }

    return (
        <View>
            <ReText style={styles.date} text={date} />
            <ReText style={styles.date} text={price} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    cursorContainer: {
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor: "rgba(100, 200, 300, 0.4)",
    },
    cursor: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: "#367be2",
        borderWidth: 4,
        backgroundColor: "white",
    },
    date: {
        fontSize: 22,
        lineHeight: 26,
        textAlign: "center",
    },
    price: {
        fontSize: 28,
        lineHeight: 34,
        textAlign: "center",
    },
});
