<template>
  <v-card
    v-if="getTransactions && getAllUsers"
    class="px-2 my-font overflow-y-auto"
    flat
    height="40vh"
  >
    <div
      v-for="(item, i) in getTransactions"
      :key="i"
      :class="
        `d-flex justify-space-around my-4 pa-2 ${getClass(item)} lighten-4`
      "
      @click="
        sheet = !sheet
        setItem(item)
      "
    >
      <h4 class="" style="width: 120px">
        {{ getAllUsers[item.transfer[0]] }}
      </h4>
      <h4 class="flex-grow-1 text-center">{{ item.amount }}</h4>
      <h4 style="width: 120px" class="text-right">
        {{ getAllUsers[item.transfer[1]] }}
      </h4>
    </div>
    <v-bottom-sheet v-model="sheet" v-if="item">
      <v-sheet height="55vh" class="px-4 pb-2" :color="getClass(item)">
        <v-btn
          class="py-2 text-center"
          dark
          text
          block
          color="white"
          @click="sheet = !sheet"
        >
          close
        </v-btn>
        <v-card class="mt-4 pa-2 ma-auto" width="400">
          <div class="d-flex justify-space-between align-center">
            <div class="flex-grow-1" v-if="!item.hasOwnProperty('self')">
              <h4>{{ getAllUsers[item.transfer[0]] }}</h4>
              <v-divider class="my-1"></v-divider>
              <h4>{{ getAllUsers[item.transfer[1]] }}</h4>
            </div>
            <div class="flex-grow-1" v-else>
              <h4>
                {{ item.self === "buy" ? "Money Spent" : "Money Received" }}
              </h4>
            </div>
            <div class="ml-4 pa-2">
              <h1 :class="`font-size`">
                {{ item.amount }}
              </h1>
            </div>
          </div>
          <v-divider class="mt-2"></v-divider>
          <h4 class="mt-2">{{ item.message }}</h4>
          <v-divider class="my-1" v-if="item.message"></v-divider>
          <h4>{{ getRelativeDate(item.timestamp) }}</h4>
          <h5>{{ getFormattedTime(item.timestamp) }}</h5>
          <div class="mt-4">
            <v-btn
              color="error"
              @click="
                sheet = false
                deleteTransaction(item.id)
              "
              block
              v-if="item.transfer[0] === user.id"
            >
              Delete
            </v-btn>
            <v-spacer></v-spacer>
          </div>
        </v-card>
      </v-sheet>
    </v-bottom-sheet>
  </v-card>
</template>

<script>
import moment from "moment"
import { firestore } from "@/firebase/init"

export default {
  name: "Transactions",
  props: {
    user: Object,
    getAllUsers: Object,
    getTransactions: Array
  },
  data() {
    return {
      sheet: false,
      item: null
    }
  },

  methods: {
    setItem(item) {
      this.item = item
    },
    getFormattedTime(time) {
      return moment(time).format("lll")
    },
    getRelativeDate(time) {
      return moment(time).fromNow()
    },
    getClass(item) {
      if ("self" in item) {
        return item.self === "get" ? "green" : "red"
      } else {
        return item.transfer[0] === this.user.id ? "green" : "red"
      }
    },
    deleteTransaction(id) {
      firestore
        .collection("transactions")
        .doc(id)
        .delete()
        .then(() => {
          this.sheet = false
        })
    }
  }
}
</script>

<style scoped></style>
