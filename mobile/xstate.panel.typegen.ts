// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "cancel": "done.invoke.Panel.drag.dragging:invocation[0]";
  };
  missingImplementations: {
    actions:
      | "releasePointerCapture"
      | "setPointerCapture"
      | "setPreviousWidth"
      | "setWidth"
      | "updatePanelWidth";
    delays: never;
    guards: "ctx.width < 100px" | "ctx.width >= 100px";
    services: "cancel";
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
  eventsCausingServices: {
    "cancel": "pointerdown" | "pointermove";
  };
  matchesStates:
    | "collapse"
    | "collapse.collapsed"
    | "collapse.normal"
    | "drag"
    | "drag.dragging"
    | "drag.idle"
    | { "collapse"?: "collapsed" | "normal"; "drag"?: "dragging" | "idle" };
  tags: "collapsed";
}
