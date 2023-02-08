import Animated, { useSharedValue } from "react-native-reanimated";
import { createMachine } from "xstate";
export const sortableMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QGUD2AnALgQwEYBswACASUzAFsA6CdbKGuqKASwDsoBiMNiAbQAMAXUSgADqlgtMLVG1EgAHogCsAgOxUAzAK0A2LSvXrdATlPqVAGhABPRPq1UALKb0AmQwEYAHOr0+AioAvsE2aFh4hKTk1LT0jPSsHJwArmIQ2OSCIkggElIycgrKCFpa7lQ+FuruegI+Kiru6lo29ggtXlTqXgF6zp7OFVo+oeEYOATEZJSJDABm7CywABbsXJh0bIWybAC0PPzCCgXSeyWI7qaVzs6WJqYqjfWt7YheKqZUKvWDWk93Pd1OMQBEptFZnEmFQWBBCJxYDgsDlTpJzsU8qUvDoejivqNPuUtJZ3mV-FU3D4AXpeiYaaDwVEZrEqGcimxYWxzth8JxUXl2RcsR9TN0vLoBL4NGpWs4yV9NFocYEgq11OZ3KEwiA2KgIHAFEzpjFKGjdpjQKV9kCyfsvJobipnF5nNTXACniCdcbIaz4lBzRj5CLOvK7Ig9N9fqMfBKjM4PHpGZNmaboQkA8lA4L0RzLmUWlUCT4hr9qVpwx1PT0fM4jCTTPo9B4Qj7UyaofMqEtuWsNkH86G9DiqLSgdUKk9qV4yZ9oyplT5aY13AJ196JpFO-6YXDCIPhVbELU50YqEElyvmuuNCnt365kLLfk80elFcq6oGheDKY7uo9wCJ4Xj3hCLJPm+chcjy+CHi+pSnhGCBfCoPyLu4LTNL89ZjO2D4QdQz6cmwYAAO7wSGx5lIElIjnoBJuPUs7Iah6EVFh7g4c82rBEAA */
  createMachine({
    predictableActionArguments: true,
    preserveActionOrder: true,
    id: "Sortable Item",
    tsTypes: {} as import("./xstate.sortable.typegen").Typegen0,

    schema: {
      context: {} as {
        safeY: number;
        x: number;
        y: number;
      },
      events: {} as
        | { type: "end" }
        | { type: "transition-end" }
        | { type: "update" }
        | { type: "start" },
    },

    // context: {
    //   safeY: useSharedValue(0),
    // },

    type: "parallel",

    states: {
      drag: {
        states: {
          dragging: {
            on: {
              end: {
                target: "finishing",
                actions: ["setXAnimation", "setYAnimation"],
              },
              update: {
                target: "dragging",
                internal: true,
                actions: ["setX", "setY"],
              },
            },
          },

          finishing: {
            on: {
              "transition-end": "idle",
            },
          },

          idle: {
            on: {
              start: {
                target: "dragging",
                actions: "setSafeY",
              },
            },
          },
        },

        initial: "idle",
      },
      position: {
        states: {
          initial: {
            always: {
              target: "new",
              cond: "ctx.y is at new cell",
            },
          },

          new: {},
        },

        initial: "initial",
      },
    },
  });
