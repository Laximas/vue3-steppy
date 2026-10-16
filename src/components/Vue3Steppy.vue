<template>
  <div class="wrapper-steppy" :style="cssVars">
    <div class="steppy">
      <div class="steppy-progress">
        <div
          class="steppy-progress-bar"
          :style="'width:' + steppyProgress"
        ></div>
      </div>

      <div
        class="steppy-item"
        :class="{
          current: props.step === index + 1,
          success: props.step > index + 1,
        }"
        :aria-current="props.step === index + 1 ? 'step' : undefined"
        v-for="(item, index) in props.tabs"
        :key="index"
      >
        <div
          class="steppy-item-counter"
          :class="{ clickable: canNavigateTo(index + 1) }"
          :style="circleStyles"
          :role="canNavigateTo(index + 1) ? 'button' : undefined"
          :tabindex="canNavigateTo(index + 1) ? 0 : undefined"
          :aria-label="
            canNavigateTo(index + 1) ? circleLabel(item, index + 1) : undefined
          "
          @click="goToStep(index + 1)"
          @keydown.enter.prevent="goToStep(index + 1)"
          @keydown.space.prevent="goToStep(index + 1)"
        >
          <img
            v-if="item.iconSuccess"
            class="icon-success"
            :src="item.iconSuccess"
            alt=""
            aria-hidden="true"
          />
          <CheckMark v-else class="icon-success" :color="primaryColor1" />
          <span class="number">{{ index + 1 }}</span>
        </div>
        <div class="steppy-item-text">
          <span class="steppy-item-title">{{ item.title }}</span>
          <span v-if="item.description" class="steppy-item-description">{{
            item.description
          }}</span>
        </div>
      </div>
    </div>

    <div class="steppy-content" v-for="index in props.tabs.length" :key="index">
      <div class="steppy-pane" v-if="props.step === index">
        <slot :name="index"></slot>
      </div>
    </div>

    <div class="controls">
      <button
        class="btn"
        type="button"
        @click="decrementStep"
        v-if="props.step !== 1"
      >
        {{ props.backText }}
      </button>
      <button
        class="btn btn--default-2"
        type="button"
        @click="incrementStep"
        v-if="props.step !== props.tabs.length"
        :disabled="!currentTab?.isValid"
      >
        {{ props.nextText }}
      </button>
      <button
        class="btn btn--default-2"
        type="button"
        @click="finalize"
        v-else
        :disabled="!currentTab?.isValid || loading"
        :aria-busy="loading ? 'true' : undefined"
      >
        <span v-if="loading" class="loader" aria-hidden="true"></span>
        <span :class="{ 'visually-hidden': loading }">{{
          props.doneText
        }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import CheckMark from "./CheckMark.vue";

const emit = defineEmits(["update:step"]);

const props = defineProps({
  step: {
    type: Number,
    default: 1,
  },
  tabs: {
    type: Array,
    default: () => [
      {
        title: "Step 1",
        iconSuccess: null,
        isValid: true,
      },
      {
        title: "Step 2",
        iconSuccess: null,
        isValid: true,
      },
      {
        title: "Step 3",
        iconSuccess: null,
        isValid: true,
      },
    ],
  },
  finalize: {
    type: Function,
    default: function () {
      return {};
    },
  },
  backText: {
    type: String,
    default: "Back",
  },
  nextText: {
    type: String,
    default: "Next",
  },
  doneText: {
    type: String,
    default: "Done",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  linear: {
    type: Boolean,
    default: true,
  },
  primaryColor1: {
    type: String,
    default: "orange",
  },
  primaryColor2: {
    type: String,
    default: "#fff",
  },
  backgroundColor: {
    type: String,
    default: "#fff",
  },
  circleSize: {
    type: Number,
    default: 68,
  },
  contentMarginTop: {
    type: Number,
    default: 60,
  },
});

const cssVars = computed(() => {
  return {
    "--primaryColor1": props.primaryColor1,
    "--primaryColor2": props.primaryColor2,
    "--backgroundColor": props.backgroundColor,
    "--circleSize": `${props.circleSize}px`,
    "--contentMarginTop": `${props.contentMarginTop}px`,
  };
});

const currentTab = computed(() => props.tabs[props.step - 1]);

const incrementStep = () => {
  const step = props.step + 1;
  emit("update:step", step);
};

const decrementStep = () => {
  const step = props.step - 1;
  emit("update:step", step);
};

const canNavigateTo = (target) => {
  if (props.loading || target === props.step) return false;
  return props.linear ? target < props.step : true;
};

const circleLabel = (item, target) => {
  const completed = props.step > target ? " (completed)" : "";
  return `Go to step ${target}: ${item.title}${completed}`;
};

const goToStep = (target) => {
  if (canNavigateTo(target)) emit("update:step", target);
};

const steppyProgress = computed(() => {
  if (props.tabs.length <= 1) return "0%";
  return (100 / (props.tabs.length - 1)) * (props.step - 1) + "%";
});

const circleStyles = computed(() => {
  return {
    height: `${props.circleSize}px`,
    width: `${props.circleSize}px`,
  };
});
</script>

<style scoped lang="scss">
$primary-1: var(--primaryColor1);
$primary-2: var(--primaryColor2);
$backgroundColor: var(--backgroundColor);

$transition: all 500ms ease;

.wrapper-steppy {
  padding: 60px;
}

.steppy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  position: relative;
  z-index: 0;
  margin-bottom: 5px;

  &-progress {
    position: absolute;
    background-color: #c5c5c5;
    height: 2px;
    z-index: -1;
    left: 0;
    right: 0;
    margin: 0 auto;

    &-bar {
      position: absolute;
      left: 0;
      height: 100%;
      width: 0;
      background-color: $primary-1;
      transition: $transition;
    }
  }
}

.steppy-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #c5c5c5;
  transition: $transition;

  &-counter {
    height: var(--circleSize);
    width: var(--circleSize);
    display: grid;
    place-items: center;
    background-color: $primary-2;
    border-radius: 100%;
    border: 2px solid #c5c5c5;
    position: relative;

    &.clickable {
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.08);
      }

      &:focus-visible {
        outline: 2px solid $primary-1;
        outline-offset: 3px;
      }
    }

    .icon-success {
      position: absolute;
      opacity: 0;
      transform: scale(0);
      width: calc(var(--circleSize) * 0.35);
      transition: $transition;
    }

    .number {
      font-size: calc(var(--circleSize) * 0.32);
      transition: $transition;
    }
  }

  .steppy-item-text {
    position: absolute;
    text-align: center;
    top: calc(100% + 26px);
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    // stays inside .wrapper-steppy's 60px padding for circles >= 40px
    max-width: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .steppy-item-title {
    font-size: 14px;
    font-weight: 500;
  }

  .steppy-item-description {
    font-size: 12px;
    color: #999;
    transition: $transition;
  }
}

.steppy-item.success {
  .steppy-item-counter {
    border-color: $primary-1;
    font-weight: 600;

    .icon-success {
      opacity: 1;
      transform: scale(1);
    }

    .number {
      opacity: 0;
      transform: scale(0);
    }
  }

  .steppy-item-title {
    color: $primary-1;
  }

  .steppy-item-description {
    color: $primary-1;
    opacity: 0.7;
  }
}

.steppy-item.current {
  .steppy-item-counter {
    border-color: $primary-1;
    background-color: $primary-1;
    color: #fff;
    font-weight: 600;
  }

  .steppy-item-title {
    color: #818181;
  }

  .steppy-item-description {
    color: #999;
  }
}

.steppy-pane {
  color: #333;
  text-align: center;
  background-color: $backgroundColor;
  border-radius: 15px;
  padding: 25px 25px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin: var(--contentMarginTop) 0 20px 0;
}

.controls {
  display: flex;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  line-height: 1.5;
  transition: all 150ms;
  border-radius: 4px;
  width: fit-content;
  font-size: 0.75rem;
  color: #333;
  background-color: #f0f0f0;
  border: 1px solid #f0f0f0;

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &--default-2 {
    background-color: $primary-1;
    border-color: $primary-1;
    color: #fff;
    margin-left: auto;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
