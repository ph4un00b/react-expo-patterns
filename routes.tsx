import uuid from "react-native-uuid";

import { specialRoutes } from "./App.special-routes";
import { DragScreen } from "./mobile/drag.screen";
import { GUI_1 } from "./mobile/gestures/gui1.reanimated";
import { KreatorDrawerEnhancedScreen } from "./mobile/kreator.drawer.enhanced.screen";
import { KreatorDrawerScreen } from "./mobile/kreator.drawer.screen";
import { KreatorUXDrawerScreen } from "./mobile/kreator.drawer.ux.screen";
import { DreiPic } from "./mobile/pic.drei.screen";
import AssetScreen from "./mobile/pic.expo.screen";
import { PicR3f } from "./mobile/pic.r3f.screen";
import { PicThreeScreen } from "./mobile/pic.three.screen";
import { PivotScreen } from "./mobile/pivot.r3f.screen";
import { ThreeScreen } from "./mobile/r3f.screen";
import { SnackSvgIssue } from "./mobile/snack.screen";
import { SpringR3f } from "./mobile/spring.r3f.screen";
import { TestGestureHandler } from "./mobile/test-gesture-handler.screen";
import { GestureCircleCursor } from "./mobile/xstate.circle-cursor.gesture.screen";
import { GestureCircleProgress } from "./mobile/xstate.circle-progress.gesture.screen";
import { GesturePanel } from "./mobile/xstate.panel.gesture.screen";
import { XSMPanel } from "./mobile/xstate.panel.screen";
import { GestureSortableScreen } from "./mobile/xstate.sortable.gesture.screen";
import { GridSortableScreen } from "./mobile/xstate.sortable.grid.screen";
import { RefactoredSortableScreen } from "./mobile/xstate.sortable.refactored.screen";
import { GestureGraph } from "./mobile/xstate.svg-path.gesture.screen";
import { GestureTinder } from "./mobile/xstate.tinder.gesture.screen";

type LinkProp = {
	color?: string;
	uuid: string;
	path:
	| "/"
	| "/gesture"
	| "/skia"
	| "/pic"
	| "/actions"
	| "/r3f-basic"
	| "/r3f-spring"
	| "/expo-assets"
	| "/drei"
	| "/pic-r3f"
	| "/drei-pivot"
	| "/gui1"
	| "/panel"
	| "/ux-drawer"
	| "/xstate-panel";
	alias: string;
	element: JSX.Element;
};

export type AppLinks = LinkProp[];
export const APP_LINKS: AppLinks = [
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/",
		alias: "home (r3f)",
		element: <PicThreeScreen />,
		// element: <SnackSvgIssue />,
		// element: <GestureSortableScreen />,
		// element: <RefactoredSortableScreen />,
		// element: <KreatorDrawerScreen />,
		// element: <GridSortableScreen />,
		// element: <RefactoredSortableScreen />,
		// element: <GestureTinder />,
		// element: <GestureGraph />,
		// element: <SnackSvgIssue />,
		// element: <GestureCircleProgress />,
		// element: <GestureCircleCursor />,
		// element: <XSM_Panel />,
		// element: <TestGestureHandler />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/ux-drawer",
		alias: "ux-nested-drawer",
		element: <KreatorUXDrawerScreen />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/xstate-panel",
		alias: "xsm-panel",
		element: <XSMPanel />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/panel",
		alias: "panel",
		element: <GesturePanel />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/gui1",
		alias: "gui 1",
		element: <GUI_1 />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/drei-pivot",
		alias: "pivot (drei)",
		element: <PivotScreen />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/drei",
		alias: "drei (r3f)",
		element: <DreiPic />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/pic-r3f",
		alias: "pic (r3f)",
		element: <PicR3f />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "purple",
		path: "/expo-assets",
		alias: "assets (expo)",
		element: <AssetScreen />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/r3f-spring",
		alias: "spring (r3f)",
		element: <SpringR3f />,
	},
	{
		uuid: uuid.v4().toString(),
		color: "peru",
		path: "/r3f-basic",
		alias: "basic (r3f)",
		element: <ThreeScreen />,
	},
	{
		uuid: uuid.v4().toString(),
		path: "/gesture",
		alias: "gesture",
		element: <DragScreen />,
	},
	...specialRoutes,
];
