// stores/counter.js
import { acceptHMRUpdate, defineStore } from "pinia";

interface State {
  status: "not-started" | "playing" | "finished";
}

const defaultState: State = {
  status: "not-started",
};

export const useGameStore = defineStore("game", {
  state: () => {
    return defaultState;
  },
  getters: {
    isPlaying() {
      return this.status === "playing";
    },
    isFinished() {
      return this.status === "finished";
    },
    isNotStarted() {
      return this.status === "not-started";
    },
  },
  actions: {
    startGame() {
      this.status = "playing";
    },
    finishGame() {
      this.status = "finished";
    },
    reset() {
      return defaultState;
    },
    setStatus(status: State["status"]) {
      this.status = status;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
