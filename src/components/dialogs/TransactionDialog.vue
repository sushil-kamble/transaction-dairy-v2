<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on" small>
          View
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Transaction Details
        </v-card-title>

        <v-card-text>
          <v-sheet class="mt-2 pa-3" tile>
            <div class="d-flex justify-space-between">
              <h3>{{ getName(item.transfer[0]) }}</h3>
              <h1>{{ item.amount }}</h1>
              <h3>{{ getName(item.transfer[1]) }}</h3>
            </div>
            <v-divider class="my-3"></v-divider>
            <div class="text-center mt-2">
              <h4>
                {{ item.message }}
              </h4>
              <v-divider class="my-3"></v-divider>
              <h4>{{ getFormattedTime(item.timestamp) }}</h4>
            </div>
          </v-sheet>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="error" text @click="dialog = false">
            Report
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "TransactionDialog",
  props: ["item"],
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapGetters(["user", "getAllUsers"])
  },
  methods: {
    getName(id) {
      return this.getAllUsers
        ? this.getAllUsers.find(i => i.id === id)?.name ?? "You"
        : "Loading";
    },
    getFormattedTime(time) {
      return moment(time).format("lll");
    }
  }
};
</script>

<style scoped></style>
