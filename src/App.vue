<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height w-100 justify-center">
        <Welcome v-if="game.isNotStarted" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { Welcome } from "@/components";
import { useGameStore } from "@/stores";

defineOptions({
  name: "App",
});

const game = useGameStore();
</script>
