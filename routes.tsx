import uuid from "react-native-uuid";
import { DragScreen } from "./mobile/drag.screen";
import { specialRoutes } from "./App.special-routes";
import { ThreeScreen } from "./mobile/r3f.screen";
import { DreiPic } from "./mobile/pic.drei.screen";
import { PicR3f } from "./mobile/pic.r3f.screen";
import AssetScreen from "./mobile/pic.expo.screen";
import { SpringR3f } from "./mobile/spring.r3f.screen";
import { PicThreeScreen } from "./mobile/pic.three.screen";

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
    | "/pic-r3f";
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
