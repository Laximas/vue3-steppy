<template>
  <div class="wrapper-stepper">
    <div class="stepper">
      <div class="stepper-progress">
        <div class="stepper-progress-bar" :style="'width:' + stepperProgress "></div>
      </div>

      <div class="stepper-item" :class="{ 'current': props.step === index + 1, 'success': props.step > index + 1 }" v-for="(item, index) in props.tabs"
           :key="index">
        <div class="stepper-item-counter">
          <img class="icon-success" :src="item.iconSuccess" alt="Check Mark">
          <span class="number">{{ index + 1 }}</span>
        </div>
        <span class="stepper-item-title">{{ item.title }}</span>
      </div>
    </div>

    <div class="stepper-content" v-for="index in props.tabs.length" :key="index">
      <div class="stepper-pane" v-if="props.step === index">
        <slot :name="index"></slot>
      </div>
    </div>

    <div class="controls">
      <button class="btn" @click="decrementStep" v-if="props.step !== 1">
        {{ props.backText }}
      </button>
      <button class="btn btn--default-2" @click="incrementStep" v-if="props.step !== props.tabs.length" :disabled="!props.tabs[props.step-1].isValid">
        {{ props.nextText }}
      </button>
      <button class="btn btn--default-2" @click="finalize" v-else :disabled="!props.tabs[props.step-1].isValid">
        {{ props.doneText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed, reactive} from "vue";
import CheckMark from '../assets/check-mark.png'

const emit = defineEmits(['update:step'])

const props = defineProps({
  step: {
    type: Number,
    default: 1
  },
  tabs: {
    type: Array,
    default: reactive([
      {
        title: 'Step 1',
        iconSuccess: CheckMark,
        isValid: true
      },
      {
        title: 'Step 2',
        iconSuccess: CheckMark,
        isValid: true
      },
      {
        title: 'Step 3',
        iconSuccess: CheckMark,
        isValid: true
      }
    ])
  },
  finalize: {
    type: Object,
    default: function () {
      return {}
    }
  },
  backText: {
    type: String,
    default: 'Back'
  },
  nextText: {
    type: String,
    default: 'Next'
  },
  doneText: {
    type: String,
    default: 'Done'
  }
})

const incrementStep = () => {
  const step = props.step + 1
  emit('update:step', step)
}

const decrementStep = () => {
  const step = props.step - 1
  emit('update:step', step)
}

const stepperProgress = computed(() => {
  return (100 / (props.tabs.length - 1)) * (props.step - 1) + '%'
})
</script>

<style scoped lang="scss">
$default-1: #C5C5C5;
$default-2: orange;
$transition: all 500ms ease;

body {
  background-image: linear-gradient(60deg, #abecd6 0%, #fbed96 100%);
  color: #ffffff;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
}

.tx-default-2 {
  color: $default-2;
  font-weight: 600;
}

.wrapper-stepper {
  background-color: #fff;
  padding: 60px;
  border-radius: 32px;
  box-shadow: rgba($color: #000000, $alpha: 0.09);
}

.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  position: relative;
  z-index: 0;
  margin-bottom: 5px;

  &-progress {
    position: absolute;
    background-color: $default-1;
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
      background-color: $default-2;
      transition: $transition;
    }
  }
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $default-1;
  transition: $transition;

  &-counter {
    height: 68px;
    width: 68px;
    display: grid;
    place-items: center;
    background-color: #fff;
    border-radius: 100%;
    border: 2px solid $default-1;
    position: relative;

    .icon-success {
      position: absolute;
      opacity: 0;
      transform: scale(0);
      width: 24px;
      transition: $transition;
    }

    .number {
      font-size: 22px;
      transition: $transition;
    }
  }

  &-title {
    position: absolute;
    text-align: center;
    font-size: 14px;
    bottom: -43px;
  }
}

.stepper-item.success {
  .stepper-item-counter {
    border-color: $default-2;
    background-color: #fff;
    color: #fff;
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

  .stepper-item-title {
    color: $default-2;
  }
}

.stepper-item.current {
  .stepper-item-counter {
    border-color: $default-2;
    background-color: $default-2;
    color: #fff;
    font-weight: 600;
  }

  .stepper-item-title {
    color: #818181;
  }
}

.stepper-pane {
  color: #333;
  text-align: center;
  padding: 25px 25px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin: 60px 0 20px 0;
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
    background-color: $default-2;
    border-color: $default-2;
    color: #fff;
    margin-left: auto;
  }
}
</style>