import uuid from "react-native-uuid";
// Notice the import path `@shopify/react-native-skia/lib/module/web`
// This is important only to pull the code responsible for loading Skia.
// @ts-expect-error
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Text } from "react-native";
import { AppLinks } from "./routes";
export const specialRoutes: AppLinks = [
  {
    uuid: uuid.v4().toString(),
    path: "/skia",
    alias: "skia",
    /** @see https://shopify.github.io/react-native-skia/docs/getting-started/web/#unsupported-features */
    element: (
      <WithSkiaWeb
        /** @ts-ignore */
        getComponent={() => import("./mobile/skia.screen")}
        fallback={<Text>Loading Skia...</Text>}
      />
    ),
  },
  {
    uuid: uuid.v4().toString(),
    path: "/pic",
    alias: "pic (skia)",
    /** @see https://reactjs.org/docs/code-splitting.html#named-exports */
    element: (
      <WithSkiaWeb
        /** @ts-ignore */
        getComponent={() => import("./mobile/pic.skia.screen")}
        fallback={<Text>Loading Skia...</Text>}
      />
    ),
  },

  {
    uuid: uuid.v4().toString(),
    path: "/actions",
    alias: "actions (skia)",
    element: (
      <WithSkiaWeb
        /** @ts-ignore */
        getComponent={() => import("./mobile/actions.screen")}
        fallback={<Text>Loading Skia...</Text>}
      />
    ),
  },
];
