<template>
  <v-card class="pa-3">
    <div class="d-flex justify-space-between align-center">
      <div>
        <h2>Transaction</h2>
        <h6 class="ml-1 text-uppercase" v-if="user.default">
          Default Group: {{ user.default }}
        </h6>
      </div>
      <v-switch v-model="self" label="Self"> </v-switch>
    </div>

    <v-divider class="mt-1 mb-5"></v-divider>

    <v-text-field
      label="Amount"
      type="number"
      v-model="amount"
      outlined
      dense
      autocomplete="off"
    ></v-text-field>

    <v-select
      :items="user.groups"
      v-model="group"
      label="Group"
      outlined
      dense
      v-if="!self && !user.hasOwnProperty('default')"
    ></v-select>

    <v-select
      v-model="select"
      :items="members"
      item-value="id"
      item-text="name"
      :disabled="group === ''"
      label="Members"
      outlined
      deletable-chips
      cache-items
      multiple
      chips
      v-if="!self"
    >
      <template v-slot:prepend-item>
        <v-list-item ripple @click="toggle">
          <v-list-item-action>
            <v-icon :color="select.length > 0 ? 'indigo darken-4' : ''">
              {{ icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Select All </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
    </v-select>
    <v-text-field
      label="Message"
      v-model="message"
      outlined
      dense
      autocomplete="off"
    ></v-text-field>
    <v-expansion-panels v-if="!self">
      <v-expansion-panel>
        <v-expansion-panel-header> Advance </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row v-for="(item, n) in select" :key="n" dense>
            <v-col cols="5">
              <h5 class="pt-1">{{ getName(item) }}</h5>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-text-field
                dense
                autocomplete="off"
                label="Amount"
                type="number"
                v-model="advTransaction[n]"
                prefix="Rs"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-btn elevation="2" class="mt-5" @click.prevent="transaction">
      Submit
    </v-btn>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/firebase/init";
import moment from "moment";
export default {
  name: "HomeTransaction",
  data() {
    return {
      self: false,
      all: false,
      amount: 0,
      select: [],
      members: [],
      group: "",
      message: "",
      temp: 0,
      advTransaction: []
    };
  },
  mounted() {
    if (this.user.default) {
      this.group = this.user.default;
    } else {
      this.self = true;
    }
  },
  computed: {
    ...mapGetters(["user", "getAllUsers"]),
    allSelected() {
      if (this.group) {
        return this.select.length === this.members.length;
      }
      return null;
    },
    someSelected() {
      return this.select.length > 0 && !this.allSelected;
    },
    icon() {
      if (this.allSelected) return "mdi-close-box";
      if (this.someSelected) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    }
  },
  watch: {
    self() {
      if (this.self) {
        this.select = [];
        this.advTransaction = [];
      }
    },
    group() {
      db.collection("groups")
        .doc(this.group)
        .get()
        .then(doc => {
          this.members = doc
            .data()
            .members.filter(mem => mem !== this.user.id)
            .map(member => {
              return this.getAllUsers.find(o => o.id === member);
            });
        });
      this.select = [];
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.allSelected) {
          this.select = [];
        } else {
          this.select = this.members.map(x => x.id);
        }
      });
    },
    noneEmpty(arr) {
      return arr.indexOf("") === -1 && arr.length > 0;
    },
    transaction() {
      if (!this.self) {
        if (this.amount !== 0 && this.select.length > 0) {
          if (!this.noneEmpty(this.advTransaction)) {
            const batchTransaction = db.batch();
            this.select.forEach(id => {
              batchTransaction.set(db.collection("transactions").doc(), {
                amount: this.amount / (this.select.length + 1),
                transfer: [this.user.id, id],
                message: this.message,
                timestamp: moment().format(),
                group: this.group
              });
            });
            batchTransaction.set(db.collection("transactions").doc(), {
              amount: this.amount / (this.select.length + 1),
              transfer: [this.user.id, this.user.id],
              message: this.message,
              timestamp: moment().format(),
              self: "buy"
            });
            batchTransaction.commit().then(() => {
              this.select = [];
              this.amount = 0;
              this.message = "";
              this.advTransaction = [];
            });
          } else {
            let i = 0;
            this.temp = this.amount;
            const batchTransactionComplex = db.batch();
            this.select.forEach(id => {
              const advAmount = this.advTransaction[i] || 0;
              if (advAmount !== 0) {
                batchTransactionComplex.set(
                  db.collection("transactions").doc(),
                  {
                    amount: advAmount,
                    transfer: [this.user.id, id],
                    message: this.message,
                    timestamp: moment().format(),
                    group: this.group
                  }
                );
              }
              this.temp -= advAmount;
              i++;
              batchTransactionComplex.set(db.collection("transactions").doc(), {
                amount: this.temp,
                transfer: [this.user.id, this.user.id],
                message: this.message,
                timestamp: moment().format(),
                self: "buy"
              });
            });
            if (this.temp > 0) {
              batchTransactionComplex.commit().then(() => {
                this.select = [];
                this.amount = 0;
                this.message = "";
                this.advTransaction = [];
              });
            }
          }
        }
      } else {
        if (this.amount > 0) {
          db.collection("transactions")
            .doc()
            .set({
              amount: Math.abs(this.amount),
              transfer: [this.user.id, this.user.id],
              message: this.message,
              timestamp: moment().format(),
              self: "buy"
            });
        } else if (this.amount < 0) {
          db.collection("transactions")
            .doc()
            .set({
              amount: Math.abs(this.amount),
              transfer: [this.user.id, this.user.id],
              message: this.message,
              timestamp: moment().format(),
              self: "get"
            });
        }
      }
    },
    getName(id) {
      return this.getAllUsers.find(i => i.id === id).name;
    }
  }
};
</script>

<style scoped></style>
