import { openBlock as t, createElementBlock as s, normalizeStyle as d, createElementVNode as n, reactive as g, computed as y, unref as m, Fragment as b, renderList as f, normalizeClass as C, createBlock as v, toDisplayString as a, renderSlot as x, createCommentVNode as k } from "vue";
const V = /* @__PURE__ */ n("path", { d: "M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" }, null, -1), z = [
  V
], T = {
  __name: "CheckMark",
  props: {
    color: {
      type: String,
      default: "black"
    }
  },
  setup(r) {
    return (c, e) => (t(), s("svg", {
      viewBox: "0 0 24 24",
      style: d({ fill: r.color })
    }, z, 4));
  }
};
const B = (r, c) => {
  const e = r.__vccOpts || r;
  for (const [i, u] of c)
    e[i] = u;
  return e;
}, M = { class: "stepper" }, N = { class: "stepper-progress" }, $ = { class: "stepper-item-counter" }, w = ["src"], D = { class: "number" }, E = { class: "stepper-item-title" }, O = {
  key: 0,
  class: "stepper-pane"
}, j = { class: "controls" }, A = ["disabled"], F = ["disabled"], I = {
  __name: "Steppo",
  props: {
    step: {
      type: Number,
      default: 1
    },
    tabs: {
      type: Array,
      default: g([
        {
          title: "Step 1",
          iconSuccess: null,
          isValid: !0
        },
        {
          title: "Step 2",
          iconSuccess: null,
          isValid: !0
        },
        {
          title: "Step 3",
          iconSuccess: null,
          isValid: !0
        }
      ])
    },
    finalize: {
      type: Object,
      default: function() {
        return {};
      }
    },
    backText: {
      type: String,
      default: "Back"
    },
    nextText: {
      type: String,
      default: "Next"
    },
    doneText: {
      type: String,
      default: "Done"
    },
    primaryColor1: {
      type: String,
      default: "orange"
    },
    primaryColor2: {
      type: String,
      default: "#C5C5C5"
    }
  },
  emits: ["update:step"],
  setup(r, { emit: c }) {
    const e = r, i = y(() => ({
      "--primaryColor1": e.primaryColor1,
      "--primaryColor2": e.primaryColor2
    })), u = () => {
      const l = e.step + 1;
      c("update:step", l);
    }, S = () => {
      const l = e.step - 1;
      c("update:step", l);
    }, h = y(() => 100 / (e.tabs.length - 1) * (e.step - 1) + "%");
    return (l, _) => (t(), s("div", {
      class: "wrapper-stepper",
      style: d(m(i))
    }, [
      n("div", M, [
        n("div", N, [
          n("div", {
            class: "stepper-progress-bar",
            style: d("width:" + m(h))
          }, null, 4)
        ]),
        (t(!0), s(b, null, f(e.tabs, (o, p) => (t(), s("div", {
          class: C(["stepper-item", { current: e.step === p + 1, success: e.step > p + 1 }]),
          key: p
        }, [
          n("div", $, [
            o.iconSuccess ? (t(), s("img", {
              key: 0,
              class: "icon-success",
              src: o.iconSuccess,
              alt: "Check Mark"
            }, null, 8, w)) : (t(), v(T, {
              key: 1,
              class: "icon-success",
              color: r.primaryColor1,
              alt: "Check Mark"
            }, null, 8, ["color"])),
            n("span", D, a(p + 1), 1)
          ]),
          n("span", E, a(o.title), 1)
        ], 2))), 128))
      ]),
      (t(!0), s(b, null, f(e.tabs.length, (o) => (t(), s("div", {
        class: "stepper-content",
        key: o
      }, [
        e.step === o ? (t(), s("div", O, [
          x(l.$slots, o, {}, void 0, !0)
        ])) : k("", !0)
      ]))), 128)),
      n("div", j, [
        e.step !== 1 ? (t(), s("button", {
          key: 0,
          class: "btn",
          onClick: S
        }, a(e.backText), 1)) : k("", !0),
        e.step !== e.tabs.length ? (t(), s("button", {
          key: 1,
          class: "btn btn--default-2",
          onClick: u,
          disabled: !e.tabs[e.step - 1].isValid
        }, a(e.nextText), 9, A)) : (t(), s("button", {
          key: 2,
          class: "btn btn--default-2",
          onClick: _[0] || (_[0] = (...o) => r.finalize && r.finalize(...o)),
          disabled: !e.tabs[e.step - 1].isValid
        }, a(e.doneText), 9, F))
      ])
    ], 4));
  }
}, P = /* @__PURE__ */ B(I, [["__scopeId", "data-v-35fe0d4e"]]);
export {
  P as Steppo
};
