import { createMachine } from "xstate";
export const PanelMachine =

  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGA7MAbAdBATqlDgJYRZgDEADgPYnoAuY+EtA7ugNoAMAuolB1YJRiVrpBIAB6IATAA4AnDgUBmACwaA7NvUBGBXu0A2ADQgAnogC0+gKwacPJfb08Tck-v3alAX38LNExcAiI8QigoBigaeiYWAFdqXgEkEGFRcUkM2QR7HjkcE29TNUMTDR5tOQtrBBta5x57QpMPUr81OUDgjGxIiPDo2PiGZnwAYwwp7DSpLLEJKXzC4tLfEwqFKpq6q3knNQ69BXslfQ1zpW0+kBDBkaHR9Di6CZYAW1oANzAFhkljlVogrjglDUlBoqvoePClGptGp6rZ7CU5JCfPYHIiFL4NPdHmEoi8Ym9xol8LQkoxAUJaCJlrlQGsiiUyttKtVaqiEPo5DwcLVtDx1HINEoTDi5GoiQMScMouS4jN0HMsPTMozsis8oh7F5hT0HOcTIiBfo+bLtCUjBp7GocZ4BfLQjgprQsFhUNRYGAcOhaPgvqgsJQtcC9az5G0SrU1B4nbU4bs+YaVHo1JdzW0eq43YNPd7ff6PV6fX7IBH+IsdczQQg5HGTAmk245KnzIcENc1Kp9ObOxLtBoeg7AkEQEGIHApMS60yQfrGvjnEpBY77MolJDtnybPnnNorvZvDjEVLC4qoIvdSyZLY1P2XJunTu9yiezYJfocNuTkMNRlCKIw7inYkXlIcgwDvBsV20R0IQ0fREyMQ0aiKPlsxwGF1ERVtRX0KUAgghUoJGFU4OXGN+WuZwjGAjw3GlQUvwaOFbV8WUCNuHE9GvcsSyrajo0fBB1Fw0UCM7PxdjabCpRwfMXHxR1RUdOUyPdYtKzLIMQzDUSH3yVC-x0FwTlkpR5PsPlrltbZajkWV4UxbxBN00sAy8qsIGMxsHT-bNFEHTxdwUMV7MhHBUOc1yiilWVJ38IA */
  createMachine({
    id: "Panel",
    tsTypes: {} as import("./xstate.panel.typegen").Typegen0,
    schema: {
      context: {} as {
        width: number;
        pointerId: null | number;
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
