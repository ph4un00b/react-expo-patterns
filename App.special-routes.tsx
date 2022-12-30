import uuid from "react-native-uuid";
import SkiaScreen from "./mobile/skia.screen";
import PicScreen from "./mobile/pic.skia.screen";
import ActionsScreen from "./mobile/actions.screen";
import { AppLinks } from "./App";

export const specialRoutes: AppLinks = [
  { uuid: uuid.v4().toString(), path: "/skia", alias: "skia", element: <SkiaScreen /> },
  {
    uuid: uuid.v4().toString(),
    path: "/pic",
    alias: "pic (skia)",
    element: <PicScreen />,
  },
  {
    uuid: uuid.v4().toString(),
    path: "/actions",
    alias: "actions (skia)",
    element: <ActionsScreen />,
  },
];
