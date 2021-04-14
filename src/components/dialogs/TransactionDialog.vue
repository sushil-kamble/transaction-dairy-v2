<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="350">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on" small>
          View
        </v-btn>
      </template>

      <v-card>
        <div
          :class="
            `white--text text-uppercase my-font text-center ${priceColor}`
          "
        >
          <h2 v-if="item.hasOwnProperty('self')">Self Transaction</h2>
          <h2 v-else>
            <span>{{ getAllUsers[item.transfer[0]] }}</span> -
            <span>{{ getAllUsers[item.transfer[1]] }}</span>
          </h2>
        </div>

        <v-card-text class="my-font">
          <v-card class="mt-4 pa-2">
            <div class="d-flex justify-space-between align-center">
              <div class="flex-grow-1" v-if="!item.hasOwnProperty('self')">
                <h2>{{ getAllUsers[item.transfer[0]] }}</h2>
                <v-divider class="my-1"></v-divider>
                <h2>{{ getAllUsers[item.transfer[1]] }}</h2>
              </div>
              <div class="flex-grow-1" v-else>
                <h2>
                  {{ item.self === "buy" ? "Money Spent" : "Money Received" }}
                </h2>
              </div>
              <div class="ml-4 pa-2">
                <h1 :class="`font-size ${priceColor}--text`">
                  {{ item.amount }}
                </h1>
              </div>
            </div>
            <v-divider class="mt-2"></v-divider>
            <h3 class="mt-2">{{ item.message }}</h3>
            <v-divider class="my-1" v-if="item.message"></v-divider>
            <h3>{{ getRelativeDate(item.timestamp) }}</h3>
            <h4>{{ getFormattedTime(item.timestamp) }}</h4>
          </v-card>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="error"
            text
            @click="
              dialog = false
              deleteTransaction(item.id)
            "
            v-if="item.transfer[0] === user.id"
          >
            Delete
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
import { mapGetters } from "vuex"
import moment from "moment"
import { firestore } from "@/firebase/init"

export default {
  name: "TransactionDialog",
  props: ["item", "priceColor"],
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    ...mapGetters(["user", "getAllUsers"])
  },
  methods: {
    getFormattedTime(time) {
      return moment(time).format("lll")
    },
    getRelativeDate(time) {
      return moment(time).fromNow()
    },
    deleteTransaction(id) {
      firestore
        .collection("transactions")
        .doc(id)
        .delete()
        .then(() => {
          //
        })
    }
  }
}
</script>

<style scoped>
.font-size {
  font-size: 40px;
}
</style>
