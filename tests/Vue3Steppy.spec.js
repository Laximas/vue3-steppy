import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";
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
// keepMounted
// ---------------------------------------------------------------------------

describe("keepMounted", () => {
  const inputSlots = () => ({
    1: () => h("input", { "data-testid": "first" }),
    2: () => h("input", { "data-testid": "second" }),
    3: () => h("input", { "data-testid": "third" }),
  });
  const renderWithInputs = (props = {}) =>
    render(Vue3Steppy, {
      props: { tabs: demoTabs(), step: 1, ...props },
      slots: inputSlots(),
    });
  const first = () => document.querySelector("[data-testid=first]");

  it("renders only the current step by default", async () => {
    await renderWithInputs();

    expect(document.querySelectorAll("input")).toHaveLength(1);
    expect(first()).not.toBeNull();
  });

  it("loses the state of a step when leaving it by default", async () => {
    const view = await renderWithInputs();
    first().value = "typed";

    await view.rerender({ step: 2 });
    await view.rerender({ step: 1 });

    expect(first().value).toBe("");
  });

  it("keeps the state of a step when leaving it", async () => {
    const view = await renderWithInputs({ keepMounted: true });
    const element = first();
    element.value = "typed";

    await view.rerender({ step: 2 });
    await view.rerender({ step: 1 });

    expect(first()).toBe(element);
    expect(first().value).toBe("typed");
  });

  it("shows only the current step", async () => {
    await renderWithInputs({ keepMounted: true, step: 2 });

    expect(document.querySelectorAll("input")).toHaveLength(3);
    const visible = [...document.querySelectorAll(".steppy-pane")].map(
      (pane) => getComputedStyle(pane).display !== "none",
    );
    expect(visible).toEqual([false, true, false]);
  });

  it("takes hidden steps out of the tab order", async () => {
    await renderWithInputs({ keepMounted: true, step: 2 });

    first().focus();

    expect(document.activeElement).not.toBe(first());
  });
});

// ---------------------------------------------------------------------------
// Busy state: loading, beforeNext and async finalize
// ---------------------------------------------------------------------------

describe("Busy state", () => {
  const deferred = () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };

  const forward = () => document.querySelector(".controls .btn--default-2");

  const expectLocked = async () => {
    await expect.element(forward()).toBeDisabled();
    await expect.element(forward()).toHaveAttribute("aria-busy", "true");
    expect(forward().querySelector(".loader")).not.toBeNull();
    expect(clickableFlags().some(Boolean)).toBe(false);
  };

  const expectUnlocked = async () => {
    await expect.element(forward()).toBeEnabled();
    await expect.element(forward()).not.toHaveAttribute("aria-busy");
    expect(forward().querySelector(".loader")).toBeNull();
  };

  describe("loading", () => {
    it("disables Back on the last step", async () => {
      await renderSteppy({ step: 3, loading: true });

      await expect.element(button("Back")).toBeDisabled();
    });

    it("locks Back and Next on the other steps too", async () => {
      await renderSteppy({ step: 2, loading: true });

      await expect.element(button("Back")).toBeDisabled();
      await expect.element(button("Next")).toBeDisabled();
    });

    it("re-enables Back when loading ends", async () => {
      const view = await renderSteppy({ step: 3, loading: true });

      await view.rerender({ loading: false });

      await expect.element(button("Back")).toBeEnabled();
    });
  });

  describe("beforeNext", () => {
    it("calls the guard with the current step and moves on when it returns true", async () => {
      const beforeNext = vi.fn(() => true);
      const view = await renderSteppy({ step: 2, beforeNext });

      await userEvent.click(button("Next"));

      await vi.waitFor(() => expect(stepEvents(view)).toEqual([3]));
      expect(beforeNext).toHaveBeenCalledTimes(1);
      expect(beforeNext).toHaveBeenCalledWith(2);
    });

    it("moves on when the guard returns nothing", async () => {
      const view = await renderSteppy({ step: 1, beforeNext: () => {} });

      await userEvent.click(button("Next"));

      await vi.waitFor(() => expect(stepEvents(view)).toEqual([2]));
    });

    it.each([
      ["sync", () => false],
      ["async", async () => false],
    ])("stays when a %s guard returns false", async (_, beforeNext) => {
      const view = await renderSteppy({ step: 1, beforeNext });

      await userEvent.click(button("Next"));

      await expectUnlocked();
      expect(view.emitted()["update:step"]).toBeUndefined();
    });

    it("locks the stepper while an async guard runs", async () => {
      const guard = deferred();
      const view = await renderSteppy({
        step: 2,
        beforeNext: () => guard.promise,
      });

      await userEvent.click(button("Next"));

      await expectLocked();
      await expect.element(button("Back")).toBeDisabled();
      // The button keeps its name behind the spinner.
      await expect.element(button("Next")).toBeInTheDocument();
      expect(view.emitted()["update:step"]).toBeUndefined();

      guard.resolve(true);

      await vi.waitFor(() => expect(stepEvents(view)).toEqual([3]));
      await expectUnlocked();
      await expect.element(button("Back")).toBeEnabled();
    });

    it("stays and unlocks when the guard rejects", async () => {
      const errorHandler = vi.fn();
      const view = await render(Vue3Steppy, {
        props: {
          tabs: demoTabs(),
          step: 1,
          beforeNext: () => Promise.reject(new Error("nope")),
        },
        global: { config: { errorHandler } },
      });

      await userEvent.click(button("Next"));

      await vi.waitFor(() => expect(errorHandler).toHaveBeenCalledTimes(1));
      await expectUnlocked();
      expect(view.emitted()["update:step"]).toBeUndefined();
    });

    it("does not emit a stale step when the parent moved on meanwhile", async () => {
      const guard = deferred();
      const view = await renderSteppy({
        step: 1,
        beforeNext: () => guard.promise,
      });

      await userEvent.click(button("Next"));
      await view.rerender({ step: 3 });
      guard.resolve(true);

      await expectUnlocked();
      expect(view.emitted()["update:step"]).toBeUndefined();
    });

    it("guards forward jumps with linear: false", async () => {
      const beforeNext = vi.fn(() => false);
      const view = await renderSteppy({ step: 1, linear: false, beforeNext });

      await userEvent.click(circles()[2]);

      await expectUnlocked();
      expect(beforeNext).toHaveBeenCalledWith(1);
      expect(view.emitted()["update:step"]).toBeUndefined();
    });

    it("jumps to the clicked step when the guard allows it", async () => {
      const view = await renderSteppy({
        step: 1,
        linear: false,
        beforeNext: () => true,
      });

      await userEvent.click(circles()[2]);

      await vi.waitFor(() => expect(stepEvents(view)).toEqual([3]));
    });

    it("does not guard moving backwards", async () => {
      const beforeNext = vi.fn(() => false);
      const view = await renderSteppy({ step: 3, beforeNext });

      await userEvent.click(button("Back"));
      await userEvent.click(circles()[0]);

      expect(beforeNext).not.toHaveBeenCalled();
      expect(stepEvents(view)).toEqual([2, 1]);
    });

    it("does not guard Done", async () => {
      const beforeNext = vi.fn(() => false);
      const finalize = vi.fn();
      await renderSteppy({ step: 3, beforeNext, finalize });

      await userEvent.click(button("Done"));

      expect(beforeNext).not.toHaveBeenCalled();
      expect(finalize).toHaveBeenCalledTimes(1);
    });

    it("does not run while the current tab is invalid", async () => {
      const tabs = demoTabs();
      tabs[0].isValid = false;
      const beforeNext = vi.fn(() => true);
      await renderSteppy({ tabs, step: 1, beforeNext });

      await expect.element(button("Next")).toBeDisabled();
      expect(beforeNext).not.toHaveBeenCalled();
    });

    it("gives keyboard focus back when the guard blocks", async () => {
      const guard = deferred();
      await renderSteppy({ step: 1, beforeNext: () => guard.promise });

      forward().focus();
      await userEvent.keyboard("{Enter}");
      await expectLocked();

      guard.resolve(false);
      await expectUnlocked();

      await vi.waitFor(() => expect(document.activeElement).toBe(forward()));
    });
  });

  describe("async finalize", () => {
    it("locks the stepper until the promise settles", async () => {
      const work = deferred();
      await renderSteppy({ step: 3, finalize: () => work.promise });

      await userEvent.click(button("Done"));

      await expectLocked();
      await expect.element(button("Back")).toBeDisabled();

      work.resolve();

      await expectUnlocked();
      await expect.element(button("Back")).toBeEnabled();
    });

    it("unlocks when the promise rejects", async () => {
      const errorHandler = vi.fn();
      await render(Vue3Steppy, {
        props: {
          tabs: demoTabs(),
          step: 3,
          finalize: () => Promise.reject(new Error("nope")),
        },
        global: { config: { errorHandler } },
      });

      await userEvent.click(button("Done"));

      await vi.waitFor(() => expect(errorHandler).toHaveBeenCalledTimes(1));
      await expectUnlocked();
    });

    it("does not stay busy after a synchronous finalize", async () => {
      await renderSteppy({ step: 3, finalize: () => {} });

      await userEvent.click(button("Done"));

      await expectUnlocked();
    });

    it("stays locked while the parent keeps loading on", async () => {
      const view = await renderSteppy({ step: 3, finalize: async () => {} });

      await view.rerender({ loading: true });

      await expect.element(forward()).toBeDisabled();
    });
  });
});

// ---------------------------------------------------------------------------
// Compact layout (phones and forced with the `compact` prop)
// ---------------------------------------------------------------------------

describe("Compact layout", () => {
  const PHONE = [375, 667];
  const DESKTOP = [1024, 768];

  const label = () => document.querySelector(".steppy-compact-label");
  const isShown = (element) => getComputedStyle(element).display !== "none";
  const expectCompact = (expected) => {
    expect(isShown(label())).toBe(expected);
    expect(isShown(texts()[0])).toBe(!expected);
  };

  afterEach(() => page.viewport(...DESKTOP));

  it("is off on wide screens by default", async () => {
    await renderSteppy({ step: 2 });

    expectCompact(false);
  });

  it("turns on by itself on phones", async () => {
    await page.viewport(...PHONE);
    await renderSteppy({ step: 2 });

    expectCompact(true);
  });

  it("switches at the 640px breakpoint", async () => {
    await page.viewport(640, 667);
    await renderSteppy({ step: 2 });
    expectCompact(true);

    await page.viewport(641, 667);
    await vi.waitFor(() => expectCompact(false));
  });

  it("can be forced on wide screens", async () => {
    await renderSteppy({ step: 2, compact: true });

    expectCompact(true);
  });

  it("can be turned off on phones", async () => {
    await page.viewport(...PHONE);
    await renderSteppy({ step: 2, compact: false });

    expectCompact(false);
  });

  it("shows the position, title and description of the current step", async () => {
    await renderSteppy({ step: 2, compact: true });

    const [title, description] = label().children;
    expect(title.textContent.replace(/\s+/g, " ").trim()).toBe(
      "2 / 3 Account Setup",
    );
    expect(description.textContent).toBe("Configure your account");
  });

  it("follows the step", async () => {
    const view = await renderSteppy({ step: 1, compact: true });

    await view.rerender({ step: 3 });

    expect(label().textContent).toContain("3 / 3");
    expect(label().textContent).toContain("Verification");
  });

  it("leaves the description out when the tab has none", async () => {
    await renderSteppy({
      tabs: [{ title: "Only step", isValid: true }],
      compact: true,
    });

    expect(document.querySelector(".steppy-compact-description")).toBeNull();
  });

  it("renders no label when step is out of range", async () => {
    await renderSteppy({ step: 9, compact: true });

    expect(label()).toBeNull();
  });

  it("fits five steps on a phone without overlap or page overflow", async () => {
    await page.viewport(...PHONE);
    await renderSteppy({ tabs: longTabs(), step: 3 });

    const wrapper = document
      .querySelector(".wrapper-steppy")
      .getBoundingClientRect();
    const rects = circles().map((circle) => circle.getBoundingClientRect());

    rects.forEach((rect, index) => {
      expect(rect.left).toBeGreaterThanOrEqual(wrapper.left);
      expect(rect.right).toBeLessThanOrEqual(wrapper.right);
      if (index > 0) expect(rect.left).toBeGreaterThan(rects[index - 1].right);
    });
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      window.innerWidth,
    );
  });

  it("caps the circles at 32px and scales their content", async () => {
    await renderSteppy({ step: 2, compact: true, circleSize: 120 });

    const circle = getComputedStyle(circles()[0]);
    const number = circles()[0].querySelector(".number");
    expect(parseFloat(circle.width)).toBe(32);
    expect(parseFloat(circle.height)).toBe(32);
    expect(parseFloat(getComputedStyle(number).fontSize)).toBeCloseTo(10.24, 1);
  });

  it("keeps a circleSize smaller than the cap", async () => {
    await renderSteppy({ step: 2, compact: true, circleSize: 24 });

    expect(parseFloat(getComputedStyle(circles()[0]).width)).toBe(24);
  });

  it("uses the regular circleSize when not compact", async () => {
    await renderSteppy({ step: 2, circleSize: 120 });

    expect(parseFloat(getComputedStyle(circles()[0]).width)).toBe(120);
  });

  it("keeps completed steps clickable", async () => {
    await page.viewport(...PHONE);
    const view = await renderSteppy({ step: 3 });

    await userEvent.click(circles()[0]);

    expect(stepEvents(view)).toEqual([1]);
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
