<template>
  <v-card variant="outlined" elevation="0" class="w-75 pa-4">
    <v-card-item class="text-center mb-6">
      <h3>Welcome to Slot Machine</h3>
    </v-card-item>
    <v-card-actions class="justify-center">
      <v-btn variant="outlined" color="primary" @click="game.startGame">
        Start the game
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores";

const game = useGameStore();

/**
 * This is a component for initial web page load
 */
defineOptions({
  name: "Welcome",
});
</script>
