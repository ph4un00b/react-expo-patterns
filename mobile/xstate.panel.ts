import { createMachine } from "xstate";
export const PanelMachine =

  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGA7MAbAdBATqlDgJYRZgDEADgPYnoAuY+EtA7ugNoAMAuolB1YJRiVrpBIAB6IALDwCsOAOwqeAZh4BGAGxzdigEzGANCACeibYp44AnCoAci+zx7rtKuSo0BfP3M0TFwCIjxCKCgGKBp6JhYAV2peASQQYVFxSXTZBA1bHF1tExUje217J2qncysEIx0cOUVFGx45OUbyp39AkGDsCPCwqJi4hmZ8AGMMaexUqUyxCSk8grti0vLKmtrLRHKVVSM9cscjIw1tDRUAoIwh0eGx9Fi6SZYAW1oANzBFulltk1tYlDhrrpdFUSpodBp9vVITgjAY3HJ7EZnDxevcBo9QpEXtE3hMEvhaIlGIChLQRCscqB1oUtooyhUqjU6ogNPYNA5qtoePZbKiNEYXHjBoSRpESbFZuh5lgaRk6VlVrkeSySmydpzqtyEBi7CYWk43OLdBpOlKCThprQsFhUNRYGAcOhaPgvqgsJRVcDNUzrPZdDghVptJHvDxLkbvNoBXH7C02rYEXaQg6nS63R7Hc7Xe6IAH+Et1QzQQhKuHIzoYwp4wcENDwzoOjxdKc1ELFAF+l6IHApNKK-SQVqEABaVFG2f8+xL5cr5dOLNPSLjjWMmSHexG63NC3lDO2Jy+O79aUvUjkMDbqtTtl2OQaYolPm8pxvo3i-m6MKBRXL0ui9PYG4ysQozyo+k4hggahGnIXg4G0GgIp0ihOO4S6QTmRb5nBwZ7g0ciHjiaGnCUQpeCKTi6PhhZ5u6nrer6WDEbueRlIeS44L0ehlNocjVChV4PNmzHFgWuYyRAXHVrySZODcvKKAUOH6LoKgJnGEKQsJok-l4A5+EAA */
  createMachine({
    id: "Panel",
    tsTypes: {} as import("./xstate.panel.typegen").Typegen0,
    schema: {
      context: {} as {
        width: number;
        pointerId: null | number;
        prevWidth: number;
      },
      events: {} as
        | { type: "pointerdown" }
        | { type: "pointerup" }
        | { type: "pointermove" }
        | { type: "pointerout" }
        | { type: "cancel" }
        | { type: "pointercancel" },
    },
    type: "parallel",
    states: {
      drag: {
        initial: "idle",
        states: {
          idle: {
            on: {
              pointerdown: "dragging",
            },
          },

          dragging: {
            invoke: {
              src: "cancel",
            },
            on: {
              pointerup: {
                target: "idle",
                actions: "releasePointerCapture",
              },

              pointercancel: {
                target: "idle",
                actions: "releasePointerCapture",
              },

              pointermove: {
                target: "dragging",
                internal: true,
                actions: "updatePanelWidth",
              },

              pointerout: {
                target: "idle",
                actions: "releasePointerCapture",
              },

              cancel: {
                target: "idle",
                actions: "setWidth",
              },
            },
            entry: ["setPointerCapture", "setPreviousWidth"],
          },
        },
      },
      collapse: {
        states: {
          normal: {
            always: {
              target: "collapsed",
              cond: "ctx.width < 100px",
            },
          },

          collapsed: {
            tags: ["collapsed"],

            always: {
              target: "normal",
              cond: "ctx.width >= 100px",
            },
          },
        },

        initial: "normal",
      },
    },
  });
