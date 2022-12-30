import React, { Suspense, useRef } from "react";
import { View, Dimensions, Text, I18nManager, Button } from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import {
  NativeRouter,
  NavigateFunction,
  Route,
  Routes,
  useNavigate,
} from "react-router-native";

import uuid from "react-native-uuid";
import { DragScreen } from "./mobile/drag.screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
const APP_LINKS: AppLinks = [
  {
    uuid: uuid.v4().toString(),
    color: "purple",
    path: "/",
    alias: "home (r3f)",
    element: <PicThreeScreen />,
  },
  {
    uuid: uuid.v4().toString(),
    color: "purple",
    path: "/drei",
    alias: "drei (r3f)",
    element: <DreiPic />,
  },
  {
    uuid: uuid.v4().toString(),
    color: "purple",
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
  // {
  //   uuid: uuid.v4().toString(),
  //   color: "peru",
  //   path: "/r3f-spring",
  //   alias: "spring (r3f)",
  //   // element: <ThreeScreen />,
  //   element: <SpringR3f />,
  // },
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

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#cece" }}>
      <NativeRouter>
        <Suspense>
          <RoutesConfig />
        </Suspense>
      </NativeRouter>
    </GestureHandlerRootView>
  );
}

function RoutesConfig() {
  const navigate = useNavigate();
  const drawer = useRef<DrawerLayout>(null!);
  return (
    <DrawerLayout
      ref={drawer}
      /** @see https://reactnative.dev/docs/drawerlayoutandroid.html#drawerlockmode */
      drawerLockMode="locked-open"
      // ios only
      enableTrackpadTwoFingerGesture
      // common props
      minSwipeDistance={320}
      userSelect="text"
      edgeWidth={100}
      drawerWidth={300}
      drawerPosition={I18nManager.isRTL ? "right" : "left"}
      drawerType="front"
      drawerBackgroundColor={"#b3b3b3"}
      onDrawerSlide={(status) => console.log(status)}
      renderNavigationView={() => sidebar(drawer, navigate)}
    >
      {openDrawer(drawer)}
      <Routes>
        {APP_LINKS.map((link) => {
          return (
            <React.Fragment key={link.uuid}>
              <Route path={link.path} element={link.element} />
            </React.Fragment>
          );
        })}
      </Routes>
    </DrawerLayout>
  );
}

function sidebar(
  drawer: React.MutableRefObject<DrawerLayout>,
  navigate: NavigateFunction
): React.ReactNode {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {closeDrawer(drawer)}
      <Text style={{ textAlign: "center" }}>Links</Text>
      {APP_LINKS.map((link) => {
        return (
          <React.Fragment key={link.uuid}>
            <Button onPress={() => navigate(link.path)} title={link.alias} />
          </React.Fragment>
        );
      })}
    </View>
  );
}

function openDrawer(drawer: React.MutableRefObject<DrawerLayout>) {
  return (
    <View>
      <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
        <MaterialCommunityIcons name="backburger" size={64} color="black" />
      </TouchableOpacity>
    </View>
  );
}

function closeDrawer(drawer: React.MutableRefObject<DrawerLayout>) {
  return (
    <View>
      <TouchableOpacity onPress={() => drawer.current.closeDrawer()}>
        <MaterialCommunityIcons name="backburger" size={64} color="black" />
      </TouchableOpacity>
    </View>
  );
}
