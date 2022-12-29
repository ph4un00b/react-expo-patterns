import uuid from "react-native-uuid";
import SkiaScreen from "./mobile/skia.screen";
import PicScreen from "./mobile/pic.screen";

export const specialRoutes = [
  { uuid: uuid.v4(), path: "/skia", alias: "skia", element: <SkiaScreen /> },
  {
    uuid: uuid.v4(),
    path: "/skia-pic",
    alias: "pic (skia)",
    element: <PicScreen />,
  },
];
