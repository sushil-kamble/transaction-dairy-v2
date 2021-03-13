<template>
  <v-card class="pa-5">
    <h1 class="text-center">Transaction Daily</h1>
    <v-divider class="mt-2 mb-6"></v-divider>
    <div class="d-flex justify-space-around">
      <v-btn :to="{ name: 'Auth' }">Login / Register</v-btn>
      <v-btn :to="{ name: 'About' }">About</v-btn>
    </div>
    <v-divider class="my-6"></v-divider>
    <h2 class="text-center">Features</h2>
  </v-card>
</template>

<script>
export default {
  name: "Welcome"
};
</script>

<style scoped></style>
