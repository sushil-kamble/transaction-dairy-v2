<template>
  <v-row class="mt-4">
    <v-col cols="12" sm="6">
      <v-card height="220" class="pa-1">
        <v-list dense v-if="group">
          <h3 class="text-center text-uppercase">{{ user.default }}</h3>
          <v-divider class="mt-2"></v-divider>
          <v-list-item-group color="primary" v-model="selected">
            <v-list-item v-for="(item, i) in filteredMembers" :key="i">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="getAllUsers[item.id]"
                ></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip
                  label
                  x-small
                  :color="item.amount >= 0 ? 'success' : 'error'"
                  >{{ item.amount }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <div v-else class="pa-4 text-center">
          <v-btn small block :to="{ name: 'Profile' }">Create a Group</v-btn>
          <p class="mt-3">
            You can do self Transaction, unless someone puts you in group or you
            create one.
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card height="220" class="pa-1 text-center">
        <h2>Computed Profit</h2>
        <v-divider class="mt-2"></v-divider>
        <h1
          :class="
            `text-h2 py-8 ${
              computedResult.amount >= 0 ? 'green--text' : 'red--text'
            }`
          "
        >
          {{ computedResult.amount }}
        </h1>
        <h4>Total Transaction: {{ computedResult.total }}</h4>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/firebase/init";

export default {
  name: "Panel",
  data() {
    return {
      group: null,
      selected: null
    };
  },
  watch: {
    selected() {
      if (this.group) {
        this.$store.commit("SET_MEMBER", this.filteredMembers[this.selected]);
      }
    }
  },
  computed: {
    ...mapGetters(["user", "getAllUsers", "getTransactions"]),
    filteredMembers() {
      if (this.group && this.user && this.getTransactions) {
        const filteredList = Object.keys(this.group.members).filter(
          mem => mem !== this.user.id
        );
        const computedList = [];
        filteredList.map(member => {
          const amount =
            this.getTransactions
              .filter(tran => tran.transfer[1] === member)
              .reduce((acc, cur) => {
                return acc + parseInt(cur.amount);
              }, 0) -
            this.getTransactions
              .filter(tran => tran.transfer[0] === member)
              .reduce((acc, cur) => {
                return acc + parseInt(cur.amount);
              }, 0);
          computedList.push({
            id: member,
            amount: amount
          });
        });
        return computedList;
      }
      return [];
    },
    computedResult() {
      if (this.getTransactions) {
        const amount =
          this.getTransactions
            .filter(tran => tran.transfer[0] === this.user.id)
            .reduce((acc, cur) => {
              return acc + parseInt(cur.amount);
            }, 0) -
          this.getTransactions
            .filter(tran => tran.transfer[1] === this.user.id)
            .reduce((acc, cur) => {
              return acc + parseInt(cur.amount);
            }, 0);
        const self = this.getTransactions.reduce((acc, cur) => {
          if ("self" in cur) {
            if (cur.self === "get") {
              return acc + cur.amount;
            } else {
              return acc - cur.amount;
            }
          }
          return acc;
        }, 0);
        return {
          amount: amount + self,
          total: this.getTransactions.length
        };
      }
      return 0;
    }
  },
  mounted() {
    if (this.user) {
      db.ref("groups/" + this.user.default)
        .get()
        .then(doc => {
          this.group = doc.val();
        });
    }
  }
};
</script>

<style scoped></style>
