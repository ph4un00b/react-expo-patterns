// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions:
      | "releasePointerCapture"
      | "setPointerCapture"
      | "setPreviousWidth"
      | "setWidth"
      | "updatePanelWidth";
    delays: never;
    guards: "ctx.width < 100px" | "ctx.width >= 100px";
    services: never;
  };
  eventsCausingActions: {
    "releasePointerCapture": "pointercancel" | "pointerout" | "pointerup";
    "setPointerCapture": "pointerdown" | "pointermove";
    "setPreviousWidth": "pointerdown" | "pointermove";
    "setWidth": "cancel";
    "updatePanelWidth": "pointermove";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "ctx.width < 100px": "";
    "ctx.width >= 100px": "";
  };
  eventsCausingServices: {};
  matchesStates:
    | "collapse"
    | "collapse.collapsed"
    | "collapse.normal"
    | "drag"
    | "drag.dragging"
    | "drag.idle"
    | { "collapse"?: "collapsed" | "normal"; "drag"?: "dragging" | "idle" };
  tags: never;
}
