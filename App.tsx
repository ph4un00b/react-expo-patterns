import React, { ComponentType, RefAttributes, useRef } from "react";
import { View, Dimensions, Text, I18nManager, Button } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandlerProps,
  TouchableOpacity,
} from "react-native-gesture-handler";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { NativeRouter, Route, Routes, useNavigate } from "react-router-native";
import { SkiaScreen } from "./mobile/skia.screen";
import uuid from "react-native-uuid";
import { DragScreen } from "./mobile/drag.screen";
import { PicScreen } from "./mobile/pic.screen";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const APP_LINKS = [
  { uuid: uuid.v4(), path: "/", alias: "home", element: <DragScreen /> },
  {
    uuid: uuid.v4(),
    path: "/gesture",
    alias: "gesture",
    element: <DragScreen />,
  },
  // { uuid: uuid.v4(), path: "/skia", alias: "skia", element: <SkiaScreen /> },
  // { uuid: uuid.v4(), path: "/r3f", alias: "r3f", element: <></> },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#cece" }}>
      <NativeRouter>
        <RoutesConfig />
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
      minSwipeDistance={320}
      userSelect="text"
      edgeWidth={100}
      drawerWidth={300}
      drawerPosition={I18nManager.isRTL ? "right" : "left"}
      drawerType="front"
      drawerBackgroundColor={"#b3b3b3"}
      renderNavigationView={() => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <View>
            <TouchableOpacity onPress={() => drawer.current.closeDrawer()}>
              <MaterialCommunityIcons
                name="backburger"
                size={64}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: "center" }}>Links</Text>
          {APP_LINKS.map((link) => {
            return (
              <React.Fragment key={link.uuid.toString()}>
                <Button
                  onPress={() => navigate(link.path)}
                  title={link.alias}
                />
              </React.Fragment>
            );
          })}
        </View>
      )}
      onDrawerSlide={(status) => console.log(status)}
    >
      <View>
        <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
          <MaterialCommunityIcons name="backburger" size={64} color="black" />
        </TouchableOpacity>
      </View>
      <Routes>
        {APP_LINKS.map((link) => {
          return (
            <React.Fragment key={link.uuid.toString()}>
              <Route path={link.path} element={link.element} />
            </React.Fragment>
          );
        })}
      </Routes>
    </DrawerLayout>
  );
}
