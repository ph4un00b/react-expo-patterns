import { Platform, StyleSheet, TextInput } from "react-native";
import type { TextInputProps, TextProps as RNTextProps } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";

/**
 * @abstract retext pattern
 * @see https://github.com/wcandillon/react-native-redash/blob/master/src/ReText.tsx
 */
const styles = StyleSheet.create({
	baseStyle: {
		color: "black",
	},
});

Animated.addWhitelistedNativeProps({ text: true });

interface TextProps extends Omit<TextInputProps, "value" | "style"> {
	text: Animated.SharedValue<string | number>;
	style?: Animated.AnimateProps<RNTextProps>["style"];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function AnimatedText(props: TextProps) {
	const { style, text, ...rest } = props;

	const animatedProps = useAnimatedProps(() => {
		// console.log(text.value)
		const value = typeof text.value == "string"
			? text.value
			: text.value.toFixed(2);

		if (Platform.OS != "web") {
			return {
				text: value,
			} as any;
		} else {
			return {
				value,
				// Here we use any because the text prop is not available in the type
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any;
		}
	});
	return (
		<AnimatedTextInput
			underlineColorAndroid="red"
			editable={false}
			value={typeof text.value == "string" ? text.value : text.value.toString()}
			style={[styles.baseStyle, style || undefined]}
			{...rest}
			animatedProps={animatedProps}
		/>
	);
}
