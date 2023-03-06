import { forwardRef } from "react";
import { TextInput } from "react-native";

import { useLogRenders } from "./utils/hooks";

export const LogPanelRef = forwardRef<TextInput, { type: "left" | "right" }>(
	({ type }, ref) => {
		// const setTranslationX = () => {
		// 	/**
		// 	 * @abstract setNativeProps pattern
		// 	 * no working on TextNode <Text />
		// 	 * they will add setNativeProps
		// 	 * o fabric soon
		// 	 * @see https://github.com/facebook/react-native/commit/874881e73e83c03df5f1a376972f6d2e6e5e1214
		// 	 */
		// 	ref.current.setNativeProps({ text: x.value.toFixed(2) });
		// };

		/**
		 * @abstract animated text pattern
		 * fallback with ref
		 * add the code below on the parent node
		 */
		useLogRenders("log-panel-ref-" + type);
		return (
			<TextInput
				ref={ref}
				editable={false}
				value="x value"
				className="w-1/3 text-xl bg-purple-600 text-slate-100"
			/>
		);
	},
);
