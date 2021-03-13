<template>
  <v-row class="mt-4">
    <v-col cols="12" sm="6">
      <v-card height="220" class="pa-1">
        <v-list dense>
          <v-subheader>Group Name</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip label x-small>90</v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card height="220" class="pa-1 text-center">
        <h2>Computed Profit</h2>
        <v-divider class="mt-2"></v-divider>
        <h1 class="text-h2 py-8">600</h1>
        <h4>Total Transaction: 10</h4>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Panel",
  data() {
    return {
      items: [
        { text: "Hrushi", icon: "mdi-account" },
        { text: "Sarvajeet", icon: "mdi-account" },
        { text: "Sayyam", icon: "mdi-account" },
        { text: "XYZ", icon: "mdi-account" }
      ]
    };
  }
};
</script>

<style scoped></style>
