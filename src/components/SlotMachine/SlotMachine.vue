<template>
  <div class="slot-machine">
    <h3 class="text-h4 mb-4">Credit: {{ state.credit }}</h3>
    <v-card class="pa-6">
      <v-card-item>
        <div class="d-flex">
          <div
            class="slot-machine__shape text-h3 d-flex align-center justify-center"
            v-for="(displayShape, index) in state.displayShapes"
            :key="index"
            :style="{
              backgroundImage: !displayShape.isRolling
                ? `url(${shapes[displayShape.shape].icon})`
                : undefined,
            }"
            :data-shape="displayShape.shape"
          >
            <v-progress-circular v-if="displayShape.isRolling" indeterminate />
          </div>
        </div>
      </v-card-item>
    </v-card>
    <div class="text-center my-6">
      <div class="mb-4">
        <v-btn
          variant="outlined"
          color="success"
          @click="roll"
          :loading="isRolling"
          :disabled="isGameFinished"
          >Roll
        </v-btn>
      </div>
      <v-btn variant="outlined" color="error" @click="cashOut">
        Cash out
      </v-btn>
    </div>

    <div v-if="isGameFinished">
      <v-alert color="warning"> Your chances has been fulfilled </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from "vue";
import { shapes } from "./config";
import { useGameStore } from "@/stores";

/**
 * This component is the main gameplay
 */
defineOptions({
  name: "SlotMachine",
});

type DisplayShapes = Array<{
  shape: keyof typeof shapes;
  isRolling: boolean;
}>;

interface Props {
  /**
   * Initial credit amount
   */
  initialCredit?: number;
  /**
   * Initial display shape. default is all shapes are cherry
   */
  initialDisplayShape?: DisplayShapes[number];
  /**
   * Number of shapes that you will see on the machine.
   */
  numberOfShapes?: number;
  /**
   * Shapes that you want to be included in rolling.
   */
  shapesIncludedForRolling?: Array<DisplayShapes[number]["shape"]>;
  /**
   * The timer that how much rolling should take long. It is based on milliseconds and will increased based on numberOfShapes
   */
  rollingTimeout?: number;
}

interface State {
  credit: number;
  displayShapes: DisplayShapes;
}

const gameStore = useGameStore();

const props = withDefaults(defineProps<Props>(), {
  initialCredit: 10,
  initialDisplayShape: () => ({
    shape: "c",
    isRolling: false,
  }),
  numberOfShapes: 3,
  shapesIncludedForRolling: () =>
    Object.keys(shapes) as unknown as Array<DisplayShapes[number]["shape"]>,
  rollingTimeout: 1000,
});

const state = reactive<State>({
  credit: props.initialCredit,
  displayShapes: Array.from(
    {
      length: props.numberOfShapes,
    },
    () => props.initialDisplayShape,
  ),
});

const shapesIncludedForRollingLength = computed(
  () => props.shapesIncludedForRolling.length,
);

const isRolling = computed(() =>
  state.displayShapes.some((displayShape) => displayShape.isRolling),
);

const isGameFinished = computed(
  () => (state.credit <= 0 || gameStore.isFinished) && !isRolling.value,
);

function getRandomShapeIndex() {
  return Math.floor(Math.random() * shapesIncludedForRollingLength.value);
}

function roll() {
  if (state.credit === 0) {
    return;
  }

  state.credit--;

  state.displayShapes = state.displayShapes.map((displayShape) => ({
    ...displayShape,
    isRolling: true,
  }));

  const newDisplayShape: DisplayShapes = [];

  for (let i = 0; i < props.numberOfShapes; i++) {
    const randomShapeIndex = getRandomShapeIndex();

    newDisplayShape.push({
      shape: props.shapesIncludedForRolling[randomShapeIndex],
      isRolling: false,
    });
  }

  const firstShape = newDisplayShape[0];

  const isWinner = newDisplayShape.every(
    (displayShape) => firstShape.shape === displayShape.shape,
  );

  for (let i = 0; i < props.numberOfShapes; i++) {
    setTimeout(
      () => {
        state.displayShapes[i] = newDisplayShape[i];

        if (isWinner && i + 1 === props.numberOfShapes) {
          state.credit += shapes[firstShape.shape].point;
        }
      },
      (i + 1) * props.rollingTimeout,
    );
  }
}

function cashOut() {
  gameStore.resetGame();
}

onMounted(() => {
  if (isGameFinished.value) {
    gameStore.finishGame();
  }
});

watch(isGameFinished, (value) => {
  if (value) {
    gameStore.finishGame();
  }
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
