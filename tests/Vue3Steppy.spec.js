import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-vue";
import { cdp, page, userEvent } from "vitest/browser";
import Vue3Steppy from "@/components/Vue3Steppy.vue";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Same three tabs as the demo in src/App.vue.
const demoTabs = () => [
  {
    title: "Personal Info",
    description: "Enter your details",
    isValid: true,
    iconSuccess: null,
  },
  {
    title: "Account Setup",
    description: "Configure your account",
    isValid: true,
    iconSuccess: null,
  },
  {
    title: "Verification",
    description: "Verify your email",
    isValid: true,
    iconSuccess: null,
  },
];

// Five tabs, two of them with very long titles and descriptions.
const longTabs = () => [
  {
    title: "Personal information and contact preferences",
    description:
      "Tell us who you are, where we can reach you and how you would like to hear from us",
    isValid: true,
  },
  { title: "Account", description: "Pick a username", isValid: true },
  { title: "Plan", description: "Choose a plan", isValid: true },
  {
    title: "Billing address and payment method details",
    description:
      "Add the address and the card that we should use for your monthly invoices",
    isValid: true,
  },
  { title: "Done", description: "All set", isValid: true },
];

const renderSteppy = (props = {}) =>
  render(Vue3Steppy, { props: { tabs: demoTabs(), ...props } });

const circles = () => [...document.querySelectorAll(".steppy-item-counter")];
const items = () => [...document.querySelectorAll(".steppy-item")];
const texts = () => [...document.querySelectorAll(".steppy-item-text")];
const progressBar = () => document.querySelector(".steppy-progress-bar");

// Values of every `update:step` event emitted so far, in order.
const stepEvents = (view) =>
  (view.emitted()["update:step"] ?? []).map((args) => args[0]);

const isClickable = (circle) => circle.classList.contains("clickable");
const clickableFlags = () => circles().map(isClickable);

const button = (name) => page.getByRole("button", { name, exact: true });

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

describe("Controls", () => {
  it("does not show Back on the first step", async () => {
    await renderSteppy({ step: 1 });

    await expect.element(button("Back")).not.toBeInTheDocument();
    await expect.element(button("Next")).toBeInTheDocument();
  });

  it("emits step + 1 when Next is clicked", async () => {
    const view = await renderSteppy({ step: 1 });

    await userEvent.click(button("Next"));

    expect(stepEvents(view)).toEqual([2]);
  });

  it.each([
    [2, 1],
    [3, 2],
  ])(
    "emits step - 1 when Back is clicked on step %i",
    async (step, expected) => {
      const view = await renderSteppy({ step });

      await userEvent.click(button("Back"));

      expect(stepEvents(view)).toEqual([expected]);
    },
  );

  it("disables Next when the current tab is not valid", async () => {
    const tabs = demoTabs();
    tabs[0].isValid = false;
    await renderSteppy({ tabs, step: 1 });

    await expect.element(button("Next")).toBeDisabled();
  });

  it("only looks at the validity of the current tab", async () => {
    const tabs = demoTabs();
    tabs[0].isValid = false;
    const view = await renderSteppy({ tabs, step: 2 });

    await expect.element(button("Next")).toBeEnabled();

    await view.rerender({ step: 1 });
    await expect.element(button("Next")).toBeDisabled();
  });

  it("renders with the forward button disabled when step is out of range", async () => {
    const tabs = demoTabs().slice(0, 2);
    await renderSteppy({ tabs, step: 5 });

    await expect.element(button("Next")).toBeDisabled();
  });

  it("renders with the forward button disabled when there are no tabs", async () => {
    await renderSteppy({ tabs: [], step: 1 });

    await expect.element(button("Next")).toBeDisabled();
  });

  it("shows Done instead of Next on the last step and calls finalize", async () => {
    const finalize = vi.fn();
    await renderSteppy({ step: 3, finalize });

    await expect.element(button("Next")).not.toBeInTheDocument();
    await expect.element(button("Done")).toBeEnabled();

    await userEvent.click(button("Done"));

    expect(finalize).toHaveBeenCalledTimes(1);
  });

  it("uses the custom button texts", async () => {
    const view = await renderSteppy({
      step: 2,
      backText: "Previous",
      nextText: "Continue",
      doneText: "Finish",
    });

    await expect.element(button("Previous")).toBeInTheDocument();
    await expect.element(button("Continue")).toBeInTheDocument();

    await view.rerender({ step: 3 });
    await expect.element(button("Finish")).toBeInTheDocument();
  });

  it("disables Done when the last tab is not valid", async () => {
    const tabs = demoTabs();
    tabs[2].isValid = false;
    const finalize = vi.fn();
    await renderSteppy({ tabs, step: 3, finalize });

    await expect.element(button("Done")).toBeDisabled();
    expect(finalize).not.toHaveBeenCalled();
  });

  it("disables Done and shows the loader while loading", async () => {
    const finalize = vi.fn();
    await renderSteppy({ step: 3, loading: true, finalize });

    const done = document.querySelector(".controls .btn--default-2");
    expect(done.querySelector(".loader")).not.toBeNull();
    await expect.element(done).toBeDisabled();
    expect(finalize).not.toHaveBeenCalled();
  });

  it("keeps an accessible name and exposes the busy state while loading", async () => {
    await renderSteppy({ step: 3, loading: true });

    const done = button("Done");
    await expect.element(done).toBeInTheDocument();
    await expect.element(done).toHaveAttribute("aria-busy", "true");
    expect(document.querySelector(".loader").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("hides the Done text visually while loading", async () => {
    await renderSteppy({ step: 3, loading: true });

    const label = document.querySelector(".controls .visually-hidden");
    expect(label.textContent.trim()).toBe("Done");
    const rect = label.getBoundingClientRect();
    expect(rect.width).toBeLessThanOrEqual(1);
    expect(rect.height).toBeLessThanOrEqual(1);
  });

  it("shows the Done text and no busy state when not loading", async () => {
    await renderSteppy({ step: 3, loading: false });

    await expect.element(button("Done")).not.toHaveAttribute("aria-busy");
    expect(document.querySelector(".controls .visually-hidden")).toBeNull();
  });

  it("does not show the loader when not loading", async () => {
    await renderSteppy({ step: 3, loading: false });

    expect(document.querySelector(".loader")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

describe("Defaults", () => {
  it("renders three placeholder steps when no tabs are given", async () => {
    await render(Vue3Steppy);

    expect(items()).toHaveLength(3);
  });

  it("gives every instance its own default tabs array", () => {
    const makeTabs = Vue3Steppy.props.tabs.default;

    expect(typeof makeTabs).toBe("function");
    expect(makeTabs()).not.toBe(makeTabs());
    expect(makeTabs()).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

describe("Progress bar", () => {
  it.each([
    [1, "0%"],
    [2, "50%"],
    [3, "100%"],
  ])("is %s -> width %s with three tabs", async (step, width) => {
    await renderSteppy({ step });

    expect(progressBar().style.width).toBe(width);
  });

  it("follows the step when the parent updates it", async () => {
    const view = await renderSteppy({ step: 1 });
    expect(progressBar().style.width).toBe("0%");

    await view.rerender({ step: 2 });
    expect(progressBar().style.width).toBe("50%");

    await view.rerender({ step: 3 });
    expect(progressBar().style.width).toBe("100%");
  });

  it.each([
    [1, "0%"],
    [3, "50%"],
    [5, "100%"],
  ])("is %s -> width %s with five tabs", async (step, width) => {
    await renderSteppy({ tabs: longTabs(), step });

    expect(progressBar().style.width).toBe(width);
  });

  it("stays at 0% with a single tab (no division by zero)", async () => {
    await renderSteppy({
      tabs: [{ title: "Only step", isValid: true }],
      step: 1,
    });

    // A NaN% or Infinity% value is dropped by the browser, leaving "".
    expect(progressBar().style.width).toBe("0%");
  });
});

// ---------------------------------------------------------------------------
// Linear navigation (default)
// ---------------------------------------------------------------------------

describe("Linear navigation", () => {
  it("makes only the completed steps clickable", async () => {
    await renderSteppy({ step: 3 });

    const [first, second, third] = circles();

    for (const [index, circle] of [first, second].entries()) {
      const title = demoTabs()[index].title;
      expect(isClickable(circle)).toBe(true);
      expect(circle.getAttribute("role")).toBe("button");
      expect(circle.getAttribute("tabindex")).toBe("0");
      expect(circle.getAttribute("aria-label")).toBe(
        `Go to step ${index + 1}: ${title} (completed)`,
      );
    }

    expect(isClickable(third)).toBe(false);
    expect(third.hasAttribute("role")).toBe(false);
    expect(third.hasAttribute("tabindex")).toBe(false);
    expect(third.hasAttribute("aria-label")).toBe(false);
  });

  it("exposes the clickable circles as buttons with an accessible name", async () => {
    await renderSteppy({ step: 3 });

    await expect
      .element(button("Go to step 1: Personal Info (completed)"))
      .toBeInTheDocument();
    await expect
      .element(button("Go to step 2: Account Setup (completed)"))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: /Go to step 3/ }))
      .not.toBeInTheDocument();
  });

  it("emits the target step when a completed step is clicked", async () => {
    const view = await renderSteppy({ step: 3 });

    await userEvent.click(circles()[0]);

    expect(stepEvents(view)).toEqual([1]);
  });

  it("emits nothing when a future step is clicked", async () => {
    const view = await renderSteppy({ step: 1 });

    await userEvent.click(circles()[2]);
    await userEvent.click(circles()[1]);

    expect(view.emitted()["update:step"]).toBeUndefined();
  });

  it("emits nothing when the current step is clicked", async () => {
    const view = await renderSteppy({ step: 2 });

    await userEvent.click(circles()[1]);

    expect(view.emitted()["update:step"]).toBeUndefined();
  });

  it("unlocks earlier steps as the parent advances the step", async () => {
    const view = await renderSteppy({ step: 1 });
    expect(clickableFlags()).toEqual([false, false, false]);

    await view.rerender({ step: 2 });
    expect(clickableFlags()).toEqual([true, false, false]);

    await view.rerender({ step: 3 });
    expect(clickableFlags()).toEqual([true, true, false]);

    await userEvent.click(circles()[1]);
    expect(stepEvents(view)).toEqual([2]);
  });
});

// ---------------------------------------------------------------------------
// Keyboard
// ---------------------------------------------------------------------------

describe("Keyboard", () => {
  let sentinel;

  // A focusable element before the stepper makes "the first Tab" deterministic,
  // whatever the previous test left as the sequential focus starting point.
  beforeEach(() => {
    sentinel = document.createElement("button");
    sentinel.textContent = "before";
    document.body.prepend(sentinel);
    sentinel.focus();
  });

  afterEach(() => {
    sentinel.remove();
  });

  it("focuses the first completed step on the first Tab", async () => {
    await renderSteppy({ step: 3 });

    await userEvent.tab();

    expect(document.activeElement).toBe(circles()[0]);
  });

  it("skips circles that are not clickable", async () => {
    await renderSteppy({ step: 3 });

    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement).toBe(circles()[1]);

    await userEvent.tab();
    expect(circles()).not.toContain(document.activeElement);
    expect(document.activeElement).toBe(button("Back").element());
  });

  it("shows a solid outline on the focused circle", async () => {
    await renderSteppy({ step: 3 });

    await userEvent.tab();

    const style = getComputedStyle(circles()[0]);
    expect(document.activeElement).toBe(circles()[0]);
    expect(style.outlineStyle).toBe("solid");
    expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2);
    expect(parseFloat(style.outlineOffset)).toBe(3);
  });

  it("shows no outline on circles that are not focused", async () => {
    await renderSteppy({ step: 3 });

    expect(getComputedStyle(circles()[0]).outlineStyle).toBe("none");
  });

  it("navigates on Enter", async () => {
    const view = await renderSteppy({ step: 3 });

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(stepEvents(view)).toEqual([1]);
  });

  it("navigates on Space", async () => {
    const view = await renderSteppy({ step: 3 });

    await userEvent.tab();
    await userEvent.keyboard(" ");

    expect(stepEvents(view)).toEqual([1]);
  });

  it("navigates to the focused circle, not the first one", async () => {
    const view = await renderSteppy({ step: 3 });

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(stepEvents(view)).toEqual([2]);
  });
});

// ---------------------------------------------------------------------------
// Non-linear
// ---------------------------------------------------------------------------

describe("Non-linear navigation (linear: false)", () => {
  it("makes every other step clickable", async () => {
    await renderSteppy({ step: 1, linear: false });

    expect(clickableFlags()).toEqual([false, true, true]);
    for (const circle of circles().slice(1)) {
      expect(circle.getAttribute("role")).toBe("button");
      expect(circle.getAttribute("tabindex")).toBe("0");
    }
  });

  it("does not call a step completed unless it is before the current one", async () => {
    await renderSteppy({ step: 2, linear: false });

    expect(circles()[0].getAttribute("aria-label")).toBe(
      "Go to step 1: Personal Info (completed)",
    );
    expect(circles()[2].getAttribute("aria-label")).toBe(
      "Go to step 3: Verification",
    );
  });

  it("emits the target when a later step is clicked", async () => {
    const view = await renderSteppy({ step: 1, linear: false });

    await userEvent.click(circles()[2]);

    expect(stepEvents(view)).toEqual([3]);
  });

  it("emits the target when an earlier step is clicked", async () => {
    const view = await renderSteppy({ step: 3, linear: false });

    await userEvent.click(circles()[0]);

    expect(stepEvents(view)).toEqual([1]);
  });

  it.each([
    [1, [false, true, true]],
    [2, [true, false, true]],
    [3, [true, true, false]],
  ])("never makes the current step (%i) clickable", async (step, flags) => {
    const view = await renderSteppy({ step, linear: false });

    expect(clickableFlags()).toEqual(flags);

    await userEvent.click(circles()[step - 1]);
    expect(view.emitted()["update:step"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Loading lock
// ---------------------------------------------------------------------------

describe("Loading lock", () => {
  it("makes no circle clickable while loading", async () => {
    const view = await renderSteppy({ step: 3, loading: true });

    expect(clickableFlags()).toEqual([false, false, false]);
    for (const circle of circles()) {
      expect(circle.hasAttribute("role")).toBe(false);
      expect(circle.hasAttribute("tabindex")).toBe(false);
      expect(circle.hasAttribute("aria-label")).toBe(false);
    }

    await userEvent.click(circles()[0]);
    await userEvent.click(circles()[1]);
    expect(view.emitted()["update:step"]).toBeUndefined();
  });

  it("also locks non-linear navigation", async () => {
    const view = await renderSteppy({ step: 1, linear: false, loading: true });

    expect(clickableFlags()).toEqual([false, false, false]);

    await userEvent.click(circles()[2]);
    expect(view.emitted()["update:step"]).toBeUndefined();
  });

  it("unlocks again when loading ends", async () => {
    const view = await renderSteppy({ step: 3, loading: true });
    expect(clickableFlags()).toEqual([false, false, false]);

    await view.rerender({ loading: false });
    expect(clickableFlags()).toEqual([true, true, false]);
  });
});

// ---------------------------------------------------------------------------
// ARIA
// ---------------------------------------------------------------------------

describe("ARIA", () => {
  it.each([1, 2, 3])(
    "marks only the current step (%i) with aria-current",
    async (step) => {
      await renderSteppy({ step });

      const current = items().map((item) => item.getAttribute("aria-current"));
      expect(current).toEqual(
        [1, 2, 3].map((number) => (number === step ? "step" : null)),
      );
    },
  );

  it("moves aria-current when the step changes", async () => {
    const view = await renderSteppy({ step: 1 });
    expect(items()[0].getAttribute("aria-current")).toBe("step");

    await view.rerender({ step: 2 });
    expect(items()[0].hasAttribute("aria-current")).toBe(false);
    expect(items()[1].getAttribute("aria-current")).toBe("step");
  });
});

describe("Check marks", () => {
  it("hides the built-in check mark from assistive technology", async () => {
    await renderSteppy({ step: 2 });

    const icons = document.querySelectorAll(".icon-success");
    expect(icons).toHaveLength(3);
    for (const icon of icons) {
      expect(icon.getAttribute("aria-hidden")).toBe("true");
      expect(icon.hasAttribute("alt")).toBe(false);
      expect(icon.getAttribute("focusable")).toBe("false");
    }
  });

  it("makes a custom iconSuccess image decorative", async () => {
    const tabs = demoTabs();
    tabs[0].iconSuccess = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
    await renderSteppy({ tabs, step: 2 });

    const icon = circles()[0].querySelector("img.icon-success");
    expect(icon.getAttribute("alt")).toBe("");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not expose a Check Mark image to screen readers", async () => {
    await renderSteppy({ step: 2 });

    await expect
      .element(page.getByRole("img", { name: "Check Mark" }))
      .not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Reduced motion
// ---------------------------------------------------------------------------

describe("Reduced motion", () => {
  const emulateMotion = (value) =>
    cdp().send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value }],
    });

  afterEach(() => emulateMotion("no-preference"));

  it("keeps the transitions by default", async () => {
    await emulateMotion("no-preference");
    await renderSteppy({ step: 3 });

    expect(getComputedStyle(progressBar()).transitionDuration).toBe("0.5s");
    expect(getComputedStyle(items()[0]).transitionDuration).toBe("0.5s");
  });

  it("turns the transitions off when the user prefers reduced motion", async () => {
    await emulateMotion("reduce");
    await renderSteppy({ step: 3 });

    const animated = [
      progressBar(),
      items()[0],
      circles()[0].querySelector(".icon-success"),
      circles()[0].querySelector(".number"),
      document.querySelector(".steppy-item-description"),
      document.querySelector(".controls .btn"),
    ];
    for (const element of animated) {
      expect(getComputedStyle(element).transitionDuration).toBe("0s");
    }
  });

  it("slows the loader down instead of removing it", async () => {
    await emulateMotion("reduce");
    await renderSteppy({ step: 3, loading: true });

    const style = getComputedStyle(document.querySelector(".loader"));
    // Vue scopes keyframe names (rotation-<hash>).
    expect(style.animationName).toMatch(/^rotation/);
    expect(style.animationDuration).toBe("1.5s");
  });
});

// ---------------------------------------------------------------------------
// Layout (needs a real browser). Relative assertions only: fonts differ
// between macOS and CI Linux, so no absolute text widths.
// ---------------------------------------------------------------------------

describe("Layout", () => {
  const TOLERANCE = 1;
  const MAX_TEXT_WIDTH = 160;
  const TEXT_OFFSET = 26;

  const wrapperRect = () =>
    document.querySelector(".wrapper-steppy").getBoundingClientRect();

  const expectInside = (inner, outer) => {
    expect(inner.left).toBeGreaterThanOrEqual(outer.left - TOLERANCE);
    expect(inner.right).toBeLessThanOrEqual(outer.right + TOLERANCE);
  };

  it("centres each text block on its circle and keeps it in the wrapper", async () => {
    await renderSteppy({ step: 1 });

    const wrapper = wrapperRect();
    expect(texts()).toHaveLength(3);

    texts().forEach((text, index) => {
      const textRect = text.getBoundingClientRect();
      const circleRect = circles()[index].getBoundingClientRect();
      const textCentre = textRect.left + textRect.width / 2;
      const circleCentre = circleRect.left + circleRect.width / 2;

      expect(Math.abs(textCentre - circleCentre)).toBeLessThanOrEqual(
        TOLERANCE,
      );
      expectInside(textRect, wrapper);
    });
  });

  it("places the text below the circle with a 26px gap", async () => {
    await renderSteppy({ step: 1 });

    texts().forEach((text, index) => {
      const textRect = text.getBoundingClientRect();
      const circleRect = circles()[index].getBoundingClientRect();

      expect(
        Math.abs(textRect.top - (circleRect.bottom + TEXT_OFFSET)),
      ).toBeLessThanOrEqual(TOLERANCE);
    });
  });

  it("sizes the text block to its content instead of to the circle", async () => {
    await renderSteppy({ step: 1 });

    texts().forEach((text, index) => {
      const textRect = text.getBoundingClientRect();
      const circleRect = circles()[index].getBoundingClientRect();

      // A 14px/12px title or description is wider than the 68px circle.
      expect(textRect.width).toBeGreaterThan(circleRect.width);
      // ...and nothing spills out of the box it is laid out in.
      expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth + 1);
    });
  });

  it("wraps very long titles at 160px and keeps them inside the wrapper", async () => {
    await renderSteppy({ tabs: longTabs(), step: 1 });

    const wrapper = wrapperRect();
    expect(texts()).toHaveLength(5);

    const rects = texts().map((text) => text.getBoundingClientRect());
    rects.forEach((rect, index) => {
      const circleRect = circles()[index].getBoundingClientRect();
      const circleCentre = circleRect.left + circleRect.width / 2;

      expect(rect.width).toBeLessThanOrEqual(MAX_TEXT_WIDTH + TOLERANCE);
      expect(
        Math.abs(rect.left + rect.width / 2 - circleCentre),
      ).toBeLessThanOrEqual(TOLERANCE);
      expectInside(rect, wrapper);
    });

    // The two long ones really did hit the cap, and wrapped instead of
    // growing: they are taller than a short, single-line neighbour.
    expect(rects[0].width).toBeGreaterThan(MAX_TEXT_WIDTH - 40);
    expect(rects[3].width).toBeGreaterThan(MAX_TEXT_WIDTH - 40);
    expect(rects[0].height).toBeGreaterThan(rects[1].height);
    expect(rects[3].height).toBeGreaterThan(rects[2].height);

    // Neighbouring text blocks do not overlap.
    for (let i = 1; i < rects.length; i++) {
      expect(rects[i].left).toBeGreaterThanOrEqual(rects[i - 1].right);
    }
  });

  it("keeps long titles inside the wrapper for the smallest supported circle (40px)", async () => {
    await renderSteppy({ tabs: longTabs(), step: 1, circleSize: 40 });

    const wrapper = wrapperRect();
    texts().forEach((text) => {
      const rect = text.getBoundingClientRect();
      expect(rect.width).toBeLessThanOrEqual(MAX_TEXT_WIDTH + TOLERANCE);
      expectInside(rect, wrapper);
    });
  });

  it("does not cause horizontal page overflow", async () => {
    await renderSteppy({ tabs: longTabs(), step: 3 });

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      window.innerWidth,
    );
  });

  it("scales the step number with circleSize", async () => {
    await renderSteppy({ step: 1, circleSize: 120 });

    const number = circles()[0].querySelector(".number");
    expect(parseFloat(getComputedStyle(number).fontSize)).toBeCloseTo(38.4, 1);
  });

  it("scales the check mark with circleSize", async () => {
    await renderSteppy({ step: 2, circleSize: 120 });

    const icon = circles()[0].querySelector(".icon-success");
    expect(parseFloat(getComputedStyle(icon).width)).toBeCloseTo(42, 1);
  });

  it("keeps the default 68px look (22px number, 24px check mark)", async () => {
    await renderSteppy({ step: 1 });

    const circle = circles()[0];
    const number = getComputedStyle(circle.querySelector(".number"));
    const icon = getComputedStyle(circle.querySelector(".icon-success"));
    expect(parseFloat(number.fontSize)).toBeCloseTo(22, 0);
    expect(parseFloat(icon.width)).toBeCloseTo(24, 0);
  });

  it("shows a pointer cursor on clickable circles only", async () => {
    await renderSteppy({ step: 2 });

    const cursors = circles().map((circle) => getComputedStyle(circle).cursor);

    expect(cursors[0]).toBe("pointer");
    expect(cursors[1]).not.toBe("pointer");
    expect(cursors[2]).not.toBe("pointer");
  });
});
