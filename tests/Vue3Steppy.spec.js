import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-vue";
import { page, userEvent } from "vitest/browser";
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
    expect(done.textContent.trim()).toBe("");
    await expect.element(done).toBeDisabled();
    expect(finalize).not.toHaveBeenCalled();
  });

  it("does not show the loader when not loading", async () => {
    await renderSteppy({ step: 3, loading: false });

    expect(document.querySelector(".loader")).toBeNull();
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
        `Go to step ${index + 1}: ${title}`,
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
      .element(button("Go to step 1: Personal Info"))
      .toBeInTheDocument();
    await expect
      .element(button("Go to step 2: Account Setup"))
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

  it("shows a pointer cursor on clickable circles only", async () => {
    await renderSteppy({ step: 2 });

    const cursors = circles().map((circle) => getComputedStyle(circle).cursor);

    expect(cursors[0]).toBe("pointer");
    expect(cursors[1]).not.toBe("pointer");
    expect(cursors[2]).not.toBe("pointer");
  });
});
