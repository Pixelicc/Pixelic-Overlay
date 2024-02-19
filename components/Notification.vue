<template>
  <v-snackbar :timeout="duration" :variant="variant" :color="color" v-model="shown">
    <v-icon v-if="icon">
      {{ icon }}
    </v-icon>
    {{ text }}
  </v-snackbar>
</template>

<script setup>
import { NotificationContext } from "../utils/NotificationManager";

const shown = ref(NotificationContext.shown);
const icon = ref(NotificationContext.icon);
const text = ref(NotificationContext.text);
const color = ref(NotificationContext.color);
const variant = ref(NotificationContext.variant);
const duration = ref(NotificationContext.duration);
</script>
