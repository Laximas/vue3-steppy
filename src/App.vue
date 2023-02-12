<template>
  <Steppy v-model:step="step" :loading="loading" :finalize="finalize">
    <template #1
      >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
      tincidunt hendrerit risus nec vehicula. Etiam in aliquet velit. Nunc in
      bibendum ligula, quis vehicula ante. Nullam placerat massa ante, non
      dapibus lacus interdum vitae. Donec eu leo at elit efficitur vehicula in
      at velit. Fusce nec ante nec erat pellentesque fringilla. Sed mollis, ante
      at faucibus aliquam, turpis ante molestie lectus, sit amet mollis nisi
      velit sit amet ligula.</template
    >
    <template #2
      >Vivamus porttitor sodales ipsum in interdum. Proin suscipit ac nunc a
      tristique. Curabitur et pharetra diam, nec porttitor risus. Curabitur vel
      mauris est. In tempor nibh sed dapibus tincidunt. Donec id pharetra nunc,
      at rhoncus dui. Nulla in feugiat ante. Maecenas euismod justo eget
      dignissim faucibus. Nam elementum dolor sit amet felis sodales luctus.
      Aenean et lacus varius, mollis mi nec, posuere lectus. Pellentesque tempor
      sapien a magna fringilla iaculis.</template
    >
    <template #3
      >Etiam in turpis erat. Vestibulum auctor vel nibh eget vehicula. Integer
      finibus libero a ex vehicula pharetra. Suspendisse dapibus ipsum elit, nec
      euismod sapien laoreet ac. Proin ex arcu, commodo nec faucibus ac,
      pellentesque sed purus. Maecenas vitae ullamcorper nunc. Fusce dapibus
      lacinia dolor non tristique. Sed eu volutpat enim. Donec nisi nulla,
      eleifend quis mollis eu, posuere nec lorem. Donec id libero ex. Aliquam ut
      massa dolor.</template
    >
  </Steppy>
</template>

<script setup>
import Steppy from "@/components/Vue3Steppy.vue";
import { ref } from "vue";

const step = ref(1);
const loading = ref(false);

const finalize = function () {
  loading.value = true;
};
</script>

<style></style>
