import React from "react";
import { View, Dimensions, Text, I18nManager, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { NativeRouter, Route, Routes, useNavigate } from "react-router-native";
import { SkiaScreen } from "./mobile/skia.screen";
import uuid from "react-native-uuid";
import { DragScreen } from "./mobile/drag.screen";
import { PicScreen } from "./mobile/pic.screen";

const APP_LINKS = [
  { uuid: uuid.v4(), path: "/", alias: "home", element: <PicScreen /> },
  {
    uuid: uuid.v4(),
    path: "/gesture",
    alias: "gesture",
    element: <DragScreen />,
  },
  { uuid: uuid.v4(), path: "/skia", alias: "skia", element: <SkiaScreen /> },
  { uuid: uuid.v4(), path: "/r3f", alias: "r3f", element: <></> },
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
  return (
    <DrawerLayout
      // ios only
      enableTrackpadTwoFingerGesture
      edgeWidth={100}
      drawerWidth={200}
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
