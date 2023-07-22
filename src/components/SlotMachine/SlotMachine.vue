<template>
  <div class="slot-machine">
    <h3 class="text-h4 mb-4">Credit: {{ state.credit }}</h3>
    <v-card class="pa-6">
      <v-card-item>
        <div class="d-flex">
          <div
            class="slot-machine__shape text-h3"
            v-for="(shape, index) in state.shapes"
            :key="index"
            :style="{
              backgroundImage: `url(${shapesMap[shape].icon})`,
            }"
          ></div>
        </div>
      </v-card-item>
    </v-card>
    <div class="text-center my-6">
      <div class="mb-4">
        <v-btn variant="outlined" color="success">Roll</v-btn>
      </div>
      <v-btn variant="outlined" color="error">Cash out</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import cherry from "@/assets/cherry.svg";
import lemon from "@/assets/lemon.svg";
import orange from "@/assets/orange.svg";
import watermelon from "@/assets/watermelon.svg";

defineOptions({
  name: "SlotMachine",
});

const shapesMap = {
  c: {
    icon: cherry,
    point: 10,
  },
  l: {
    point: 20,
    icon: lemon,
  },
  o: {
    point: 30,
    icon: orange,
  },
  w: {
    point: 40,
    icon: watermelon,
  },
};

interface State {
  credit: number;
  shapes: Array<keyof typeof shapesMap>;
}

const state = reactive<State>({
  credit: 10,
  shapes: ["c", "c", "c"],
});
</script>

<style lang="scss" scoped>
.slot-machine {
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }

  &__shape {
    border: 1px solid black;
    width: 100%;
    text-align: center;
    height: 100px;
    background-size: 30%;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
