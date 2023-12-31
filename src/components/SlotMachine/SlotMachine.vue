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
        >
          Roll
        </v-btn>
      </div>
      <div
        :class="`d-inline-block slot-machine__cash-out slot-machine__cash-out--${state.cashOutMoveDirection}`"
        @mouseover="onMouseOverCashOut"
        @mouseleave="onMouseLeaveCashOut"
        data-testid="slot-machine__cash-out"
      >
        <v-btn
          variant="outlined"
          color="error"
          @click="cashOut"
          :disabled="state.cashOutDisableClick"
        >
          Cash out
        </v-btn>
      </div>
    </div>

    <div v-if="isGameFinished">
      <v-alert color="warning"> Game over </v-alert>
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

const emit = defineEmits<{
  /**
   * We use this event to understand that we need to cheat. Useful for testing
   */
  onCheatRequired: [];
}>();

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
  /**
   * The chance of cash out move on hover. Should be between 0 and 1.
   */
  cashOutHoverMoveDirectionChance?: number;
  /**
   * The chance of cash out disable click on hover. Should be between 0 and 1.
   */
  cashOutHoverDisableClickChance?: number;
}

interface State {
  credit: number;
  displayShapes: DisplayShapes;
  cashOutMoveDirection: string | null;
  cashOutDisableClick: boolean;
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
  cashOutHoverMoveDirectionChance: 0.5,
  cashOutHoverDisableClickChance: 0.4,
});

const state = reactive<State>({
  credit: props.initialCredit,
  displayShapes: Array.from(
    {
      length: props.numberOfShapes,
    },
    () => props.initialDisplayShape,
  ),
  cashOutMoveDirection: null,
  cashOutDisableClick: false,
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

/**
 * Get random shape index
 */
function getRandomShapeIndex() {
  return Math.floor(Math.random() * shapesIncludedForRollingLength.value);
}

/**
 * Get new display shapes randomly
 */
function getNewDisplayShapes() {
  const newDisplayShape: DisplayShapes = [];

  for (let i = 0; i < props.numberOfShapes; i++) {
    const randomShapeIndex = getRandomShapeIndex();

    newDisplayShape.push({
      shape: props.shapesIncludedForRolling[randomShapeIndex],
      isRolling: false,
    });
  }

  return newDisplayShape;
}

function checkIsWinner(displayShapes: DisplayShapes) {
  const firstShape = displayShapes[0];

  const isWinner = displayShapes.every(
    (displayShape) => firstShape.shape === displayShape.shape,
  );

  return isWinner;
}

function roll() {
  if (state.credit === 0) {
    return;
  }

  state.displayShapes = state.displayShapes.map((displayShape) => ({
    ...displayShape,
    isRolling: true,
  }));

  let newDisplayShape = getNewDisplayShapes();

  let isWinner = checkIsWinner(newDisplayShape);

  if (isWinner && state.credit >= 40) {
    emit("onCheatRequired");
    if (state.credit <= 60) {
      const shouldReroll = Math.random() <= 0.3;

      if (shouldReroll) {
        newDisplayShape = getNewDisplayShapes();
        isWinner = checkIsWinner(newDisplayShape);
      }
    } else if (state.credit > 60) {
      const shouldReroll = Math.random() <= 0.6;
      if (shouldReroll) {
        newDisplayShape = getNewDisplayShapes();
        isWinner = checkIsWinner(newDisplayShape);
      }
    }
  }

  const firstShape = newDisplayShape[0];

  for (let i = 0; i < props.numberOfShapes; i++) {
    setTimeout(
      () => {
        state.displayShapes[i] = newDisplayShape[i];

        if (i + 1 == props.numberOfShapes) {
          if (isWinner) {
            state.credit += shapes[firstShape.shape].point;
          } else {
            state.credit--;
          }
        }
      },
      (i + 1) * props.rollingTimeout,
    );
  }
}

function cashOut() {
  gameStore.resetGame();
}

let mouseLeaveCashOutInterval: null | ReturnType<typeof setTimeout> = null;

function onMouseLeaveCashOut() {
  if (mouseLeaveCashOutInterval) {
    clearTimeout(mouseLeaveCashOutInterval);
  }

  mouseLeaveCashOutInterval = setTimeout(() => {
    state.cashOutMoveDirection = null;
    state.cashOutDisableClick = false;
  }, 3000);
}

function onMouseOverCashOut() {
  const shouldMove =
    Math.random() <= props.cashOutHoverMoveDirectionChance &&
    !isGameFinished.value;
  const shouldDisableClick =
    Math.random() <= props.cashOutHoverDisableClickChance &&
    !isGameFinished.value;

  if (shouldMove) {
    const directions = ["right", "left", "up", "down"];
    const directionIndex = Math.floor(Math.random() * 5);
    state.cashOutMoveDirection = directions[directionIndex];
  } else {
    onMouseLeaveCashOut();
  }

  if (shouldDisableClick) {
    state.cashOutDisableClick = true;
  } else {
    onMouseLeaveCashOut();
  }
}

onMounted(() => {
  if (isGameFinished.value) {
    gameStore.finishGame();
  } else {
    gameStore.startGame();
  }
});

watch(isGameFinished, (value) => {
  if (value) {
    gameStore.finishGame();
    state.cashOutDisableClick = false;
    state.cashOutMoveDirection = null;
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

  &__cash-out {
    transition: transform 0.3s;
  }

  &__cash-out--right {
    transform: translateX(300px);
  }

  &__cash-out--left {
    transform: translateX(-300px);
  }

  &__cash-out--up {
    transform: translateY(-300px);
  }

  &__cash-out--down {
    transform: translateY(300px);
  }
}
</style>
