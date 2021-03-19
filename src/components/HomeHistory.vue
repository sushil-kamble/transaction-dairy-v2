<template>
  <v-card class="pa-3">
    <div
      :class="
        `d-flex justify-space-between px-4 white--text ${
          getCurrMember.amount >= 0 ? 'success' : 'error'
        }`
      "
      v-if="getCurrMember"
    >
      <h1>{{ getName(getCurrMember.id) }}</h1>
      <h1>{{ getCurrMember.amount }}</h1>
    </div>
    <h1 v-else>History</h1>

    <v-data-table
      dense
      fixed-header
      height="300"
      disable-pagination
      hide-default-footer
      :headers="headers"
      :items="filteredTransaction"
      item-key="id"
      class="mt-3"
    >
      <template v-slot:item.transfer[0]="{ item }">
        <span v-if="item.hasOwnProperty('self')">
          <span v-if="item.self === 'get'">You</span>
          <span v-else>-</span>
        </span>
        <span v-else>
          {{ getName(item.transfer[0]) }}
        </span>
      </template>
      <template v-slot:item.transfer[1]="{ item }">
        <span v-if="item.hasOwnProperty('self')">
          <span v-if="item.self === 'buy'">You</span>
          <span v-else>-</span>
        </span>
        <span v-else>
          {{ getName(item.transfer[1]) }}
        </span>
      </template>
      <template v-slot:item.amount="{ item }">
        <v-chip
          label
          :color="item.transfer[0] === user.id ? 'green' : 'red'"
          dark
          small
          v-if="!item.hasOwnProperty('self')"
        >
          {{ item.amount }}
        </v-chip>
        <v-chip
          label
          :color="item.self === 'get' ? 'green' : 'red'"
          dark
          small
          v-else
        >
          {{ item.amount }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          color="primary"
          small
          dark
          @click.stop="
            dialog = true;
            setCurrent(item);
          "
        >
          View
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="380">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Transaction Details
        </v-card-title>

        <v-card-text>
          <v-sheet class="mt-2 pa-3" tile v-if="setCurr">
            <div
              class="d-flex justify-space-between"
              v-if="!setCurr.hasOwnProperty('self')"
            >
              <h3>{{ getName(setCurr.transfer[0]) }}</h3>
              <h1>{{ setCurr.amount }}</h1>
              <h3>{{ getName(setCurr.transfer[1]) }}</h3>
            </div>
            <div class="d-flex justify-space-between" v-else>
              <h3 v-if="setCurr.self === 'get'">
                {{ getName(setCurr.transfer[0]) }}
              </h3>
              <h3 v-else>-</h3>
              <h1>{{ setCurr.amount }}</h1>
              <h3 v-if="setCurr.self === 'buy'">
                {{ getName(setCurr.transfer[1]) }}
              </h3>
              <h3 v-else>-</h3>
            </div>
            <v-divider class="my-3"></v-divider>
            <div class="text-center mt-2">
              <h3>{{ setCurr.message }}</h3>
              <h4>
                {{ getFormattedTime(setCurr.timestamp) }}
              </h4>
              <v-divider class="my-3"></v-divider>
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
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "HomeHistory",
  data: () => ({
    dialog: false,
    setCurr: null,
    headers: [
      {
        text: "From",
        align: "start",
        value: "transfer[0]"
      },
      { text: "To", value: "transfer[1]" },
      { text: "Amount", value: "amount" },
      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ]
  }),
  computed: {
    ...mapGetters(["user", "getAllUsers", "getTransactions", "getCurrMember"]),
    filteredTransaction() {
      if (this.getTransactions && this.getCurrMember) {
        return this.getTransactions.filter(
          tran =>
            tran.transfer[0] === this.getCurrMember.id ||
            tran.transfer[1] === this.getCurrMember.id
        );
      }
      return this.getTransactions;
    }
  },
  methods: {
    getName(id) {
      if (this.getAllUsers) {
        return this.getAllUsers.find(i => i.id === id)?.name ?? "You";
      }
    },
    setCurrent(item) {
      this.setCurr = item;
    },
    getFormattedTime(time) {
      return moment(time).format("lll");
    }
  }
};
</script>
