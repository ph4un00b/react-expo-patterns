import uuid from "react-native-uuid";
// Notice the import path `@shopify/react-native-skia/lib/module/web`
// This is important only to pull the code responsible for loading Skia.
// @ts-expect-error
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Text } from "react-native"
export const specialRoutes = [
    {
        uuid: uuid.v4(),
        path: "/skia",
        alias: "skia",
        /** @see https://shopify.github.io/react-native-skia/docs/getting-started/web/#unsupported-features */
        element: (
          <WithSkiaWeb
            getComponent={() => import("./mobile/skia.screen")}
            fallback={<Text>Loading Skia...</Text>}
          />
        ),
      },
  {
    uuid: uuid.v4(),
    path: "/skia-pic",
    alias: "pic (skia)",
    /** @see https://reactjs.org/docs/code-splitting.html#named-exports */
    element: (
        <WithSkiaWeb
          getComponent={() => import("./mobile/pic.screen")}
          fallback={<Text>Loading Skia...</Text>}
        />
      ),
  },
];
