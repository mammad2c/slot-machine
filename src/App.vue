<template>
  <v-app>
    <v-main>
      <v-container class="fill-height justify-center">
        <Welcome v-if="game.isNotStarted" />
        <SlotMachine v-if="!game.isNotStarted" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { Welcome } from "@/components";
import { useGameStore } from "@/stores";
import SlotMachine from "@/components/SlotMachine/SlotMachine.vue";
import "./styles/styles.scss";

defineOptions({
  name: "App",
});

const game = useGameStore();
</script>
