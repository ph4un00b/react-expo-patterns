// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "setSafeY" | "setX" | "setXAnimation" | "setY" | "setYAnimation";
    delays: never;
    guards: "ctx.y is at new cell";
    services: never;
  };
  eventsCausingActions: {
    "setSafeY": "start";
    "setX": "update";
    "setXAnimation": "end";
    "setY": "update";
    "setYAnimation": "end";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "ctx.y is at new cell": "";
  };
  eventsCausingServices: {};
  matchesStates:
    | "drag"
    | "drag.dragging"
    | "drag.finishing"
    | "drag.idle"
    | "position"
    | "position.initial"
    | "position.new"
    | {
      "drag"?: "dragging" | "finishing" | "idle";
      "position"?: "initial" | "new";
    };
  tags: never;
}
