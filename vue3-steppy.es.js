(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode("body[data-v-dc56ec53]{width:100%;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif}.tx-default-2[data-v-dc56ec53]{color:var(--primaryColor1);font-weight:600}.wrapper-steppy[data-v-dc56ec53]{padding:60px}.steppy[data-v-dc56ec53]{display:flex;align-items:center;justify-content:space-between;width:auto;position:relative;z-index:0;margin-bottom:5px}.steppy-progress[data-v-dc56ec53]{position:absolute;background-color:#c5c5c5;height:2px;z-index:-1;left:0;right:0;margin:0 auto}.steppy-progress-bar[data-v-dc56ec53]{position:absolute;left:0;height:100%;width:0;background-color:var(--primaryColor1);transition:all .5s ease}.steppy-item[data-v-dc56ec53]{display:flex;flex-direction:column;align-items:center;color:#c5c5c5;transition:all .5s ease}.steppy-item-counter[data-v-dc56ec53]{height:68px;width:68px;display:grid;place-items:center;background-color:var(--primaryColor2);border-radius:100%;border:2px solid #c5c5c5;position:relative}.steppy-item-counter .icon-success[data-v-dc56ec53]{position:absolute;opacity:0;transform:scale(0);width:24px;transition:all .5s ease}.steppy-item-counter .number[data-v-dc56ec53]{font-size:22px;transition:all .5s ease}.steppy-item .steppy-item-text[data-v-dc56ec53]{position:absolute;text-align:center;bottom:-58px;width:100%;display:flex;flex-direction:column;align-items:center;gap:2px}.steppy-item .steppy-item-title[data-v-dc56ec53]{font-size:14px;font-weight:500}.steppy-item .steppy-item-description[data-v-dc56ec53]{font-size:12px;color:#999;transition:all .5s ease}.steppy-item.success .steppy-item-counter[data-v-dc56ec53]{border-color:var(--primaryColor1);font-weight:600;height:var(--circleSize);width:var(--circleSize)}.steppy-item.success .steppy-item-counter .icon-success[data-v-dc56ec53]{opacity:1;transform:scale(1);width:calc(var(--circleSize) * .35)}.steppy-item.success .steppy-item-counter .number[data-v-dc56ec53]{opacity:0;transform:scale(0);font-size:calc(var(--circleSize) * .32)}.steppy-item.success .steppy-item-title[data-v-dc56ec53]{color:var(--primaryColor1)}.steppy-item.success .steppy-item-description[data-v-dc56ec53]{color:var(--primaryColor1);opacity:.7}.steppy-item.current .steppy-item-counter[data-v-dc56ec53]{border-color:var(--primaryColor1);background-color:var(--primaryColor1);color:#fff;font-weight:600}.steppy-item.current .steppy-item-title[data-v-dc56ec53]{color:#818181}.steppy-item.current .steppy-item-description[data-v-dc56ec53]{color:#999}.steppy-pane[data-v-dc56ec53]{color:#333;text-align:center;background-color:var(--backgroundColor);border-radius:15px;padding:25px;box-shadow:0 0 10px #0000004d;margin:var(--contentMarginTop) 0 20px 0}.controls[data-v-dc56ec53]{display:flex}.btn[data-v-dc56ec53]{display:flex;justify-content:center;align-items:center;padding:6px 16px;text-align:center;vertical-align:middle;cursor:pointer;line-height:1.5;transition:all .15s;border-radius:4px;width:fit-content;font-size:.75rem;color:#333;background-color:#f0f0f0;border:1px solid #f0f0f0}.btn[data-v-dc56ec53]:disabled{opacity:.5;pointer-events:none}.btn--default-2[data-v-dc56ec53]{background-color:var(--primaryColor1);border-color:var(--primaryColor1);color:#fff;margin-left:auto}.loader[data-v-dc56ec53]{width:20px;height:20px;border:2px solid #fff;border-bottom-color:transparent;border-radius:50%;display:inline-block;box-sizing:border-box;animation:rotation-dc56ec53 1s linear infinite}@keyframes rotation-dc56ec53{0%{transform:rotate(0)}to{transform:rotate(360deg)}}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { openBlock as e, createElementBlock as s, normalizeStyle as u, createElementVNode as c, reactive as v, computed as y, Fragment as m, renderList as k, normalizeClass as C, createBlock as x, toDisplayString as r, createCommentVNode as b, renderSlot as z } from "vue";
const V = {
  __name: "CheckMark",
  props: {
    color: {
      type: String,
      default: "black"
    }
  },
  setup(n) {
    return (i, l) => (e(), s("svg", {
      viewBox: "0 0 24 24",
      style: u({ fill: n.color })
    }, [...l[0] || (l[0] = [
      c("path", { d: "M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" }, null, -1)
    ])], 4));
  }
}, T = (n, i) => {
  const l = n.__vccOpts || n;
  for (const [t, d] of i)
    l[t] = d;
  return l;
}, M = { class: "steppy" }, B = { class: "steppy-progress" }, N = ["src"], $ = { class: "number" }, w = { class: "steppy-item-text" }, D = { class: "steppy-item-title" }, E = {
  key: 0,
  class: "steppy-item-description"
}, F = {
  key: 0,
  class: "steppy-pane"
}, A = { class: "controls" }, I = ["disabled"], L = ["disabled"], O = {
  key: 0,
  class: "loader"
}, P = { key: 1 }, j = {
  __name: "Vue3Steppy",
  props: {
    step: {
      type: Number,
      default: 1
    },
    tabs: {
      type: Array,
      default: v([
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
      type: Function,
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
    loading: {
      type: Boolean,
      default: !1
    },
    primaryColor1: {
      type: String,
      default: "orange"
    },
    primaryColor2: {
      type: String,
      default: "#fff"
    },
    backgroundColor: {
      type: String,
      default: "#fff"
    },
    circleSize: {
      type: Number,
      default: 68
    },
    contentMarginTop: {
      type: Number,
      default: 60
    }
  },
  emits: ["update:step"],
  setup(n, { emit: i }) {
    const l = i, t = n, d = y(() => ({
      "--primaryColor1": t.primaryColor1,
      "--primaryColor2": t.primaryColor2,
      "--backgroundColor": t.backgroundColor,
      "--circleSize": `${t.circleSize}px`,
      "--contentMarginTop": `${t.contentMarginTop}px`
    })), g = () => {
      const a = t.step + 1;
      l("update:step", a);
    }, S = () => {
      const a = t.step - 1;
      l("update:step", a);
    }, _ = y(() => 100 / (t.tabs.length - 1) * (t.step - 1) + "%"), h = y(() => ({
      height: `${t.circleSize}px`,
      width: `${t.circleSize}px`
    }));
    return (a, f) => (e(), s("div", {
      class: "wrapper-steppy",
      style: u(d.value)
    }, [
      c("div", M, [
        c("div", B, [
          c("div", {
            class: "steppy-progress-bar",
            style: u("width:" + _.value)
          }, null, 4)
        ]),
        (e(!0), s(m, null, k(t.tabs, (o, p) => (e(), s("div", {
          class: C(["steppy-item", {
            current: t.step === p + 1,
            success: t.step > p + 1
          }]),
          key: p
        }, [
          c("div", {
            class: "steppy-item-counter",
            style: u(h.value)
          }, [
            o.iconSuccess ? (e(), s("img", {
              key: 0,
              class: "icon-success",
              src: o.iconSuccess,
              alt: "Check Mark"
            }, null, 8, N)) : (e(), x(V, {
              key: 1,
              class: "icon-success",
              color: n.primaryColor1,
              alt: "Check Mark"
            }, null, 8, ["color"])),
            c("span", $, r(p + 1), 1)
          ], 4),
          c("div", w, [
            c("span", D, r(o.title), 1),
            o.description ? (e(), s("span", E, r(o.description), 1)) : b("", !0)
          ])
        ], 2))), 128))
      ]),
      (e(!0), s(m, null, k(t.tabs.length, (o) => (e(), s("div", {
        class: "steppy-content",
        key: o
      }, [
        t.step === o ? (e(), s("div", F, [
          z(a.$slots, o, {}, void 0, !0)
        ])) : b("", !0)
      ]))), 128)),
      c("div", A, [
        t.step !== 1 ? (e(), s("button", {
          key: 0,
          class: "btn",
          type: "button",
          onClick: S
        }, r(t.backText), 1)) : b("", !0),
        t.step !== t.tabs.length ? (e(), s("button", {
          key: 1,
          class: "btn btn--default-2",
          type: "button",
          onClick: g,
          disabled: !t.tabs[t.step - 1].isValid
        }, r(t.nextText), 9, I)) : (e(), s("button", {
          key: 2,
          class: "btn btn--default-2",
          type: "button",
          onClick: f[0] || (f[0] = (...o) => n.finalize && n.finalize(...o)),
          disabled: !t.tabs[t.step - 1].isValid || n.loading
        }, [
          n.loading ? (e(), s("span", O)) : (e(), s("span", P, r(t.doneText), 1))
        ], 8, L))
      ])
    ], 4));
  }
}, G = /* @__PURE__ */ T(j, [["__scopeId", "data-v-dc56ec53"]]);
export {
  G as Steppy
};
