import { Platform, StyleSheet, Text } from 'react-native'
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'

export function TestGestureHandler() {
    const isPressed = useSharedValue(false)
    const onTouchesDownWasCalled = useSharedValue(false)
    const onBeginWasCalled = useSharedValue(false)
    const onStartWasCalled = useSharedValue(false)
    const onTouchesUpWasCalled = useSharedValue(false)
    const onEndWasCalled = useSharedValue(false)
    const onFinalizeWasCalled = useSharedValue(false)

    const longPressGesture = Gesture.LongPress()
        .onTouchesDown(() => {
            isPressed.value = true
            onTouchesDownWasCalled.value = true
            onBeginWasCalled.value = false
            onStartWasCalled.value = false
            onTouchesUpWasCalled.value = false
            onEndWasCalled.value = false
            onFinalizeWasCalled.value = false
        })
        .onBegin(() => {
            onBeginWasCalled.value = true
        })
        .onStart(() => {
            onStartWasCalled.value = true
        })
        .onTouchesUp(() => {
            onTouchesUpWasCalled.value = true
        })
        .onEnd(() => {
            onEndWasCalled.value = true
        })
        .onFinalize(() => {
            isPressed.value = false
            onFinalizeWasCalled.value = true
        })

    const onTouchesDownStyles = useAnimatedStyle(() => ({
        opacity: onTouchesDownWasCalled.value ? 1 : 0,
    }))

    const onBeginStyles = useAnimatedStyle(() => ({
        opacity: onBeginWasCalled.value ? 1 : 0,
    }))

    const onStartStyles = useAnimatedStyle(() => ({
        opacity: onStartWasCalled.value ? 1 : 0,
    }))

    const onTouchesUpStyles = useAnimatedStyle(() => ({
        opacity: onTouchesUpWasCalled.value ? 1 : 0,
    }))

    const onEndStyles = useAnimatedStyle(() => ({
        opacity: onEndWasCalled.value ? 1 : 0,
    }))

    const onFinalizeStyles = useAnimatedStyle(() => ({
        opacity: onFinalizeWasCalled.value ? 1 : 0,
    }))

    const ballAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: isPressed.value ? 'yellow' : 'red',
    }))

    return (
        <GestureHandlerRootView style={styles.container}>
            <Text style={styles.text}>
                {Platform.OS === 'web' ? 'Web Version' : 'Native Version'}
            </Text>
            <Animated.View style={onTouchesDownStyles}>
                <Text style={styles.text}>`onTouchesDown()` was called.</Text>
            </Animated.View>
            <Animated.View style={onBeginStyles}>
                <Text style={styles.text}>`onBegin()` was called.</Text>
            </Animated.View>
            <Animated.View style={onStartStyles}>
                <Text style={styles.text}>`onStart()` was called.</Text>
            </Animated.View>
            <Animated.View style={onTouchesUpStyles}>
                <Text style={styles.text}>`onTouchesUp()` was called.</Text>
            </Animated.View>
            <Animated.View style={onEndStyles}>
                <Text style={styles.text}>`onEnd()` was called.</Text>
            </Animated.View>
            <Animated.View style={onFinalizeStyles}>
                <Text style={styles.text}>`onFinalize()` was called.</Text>
            </Animated.View>
            <GestureDetector gesture={longPressGesture}>
                <Animated.View style={[styles.ball, ballAnimatedStyles]} />
            </GestureDetector>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        paddingBottom: 16,
        fontSize: 16,
    },
    ball: {
        width: 128,
        height: 128,
        borderRadius: 64,
    },
})