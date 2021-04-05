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
      v-model="select"
      :items="members"
      item-value="id"
      item-text="name"
      :disabled="group === ''"
      label="Members"
      :loading="loading"
      outlined
      deletable-chips
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
              <h5 class="pt-1">{{ getAllUsers[item] }}</h5>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-text-field
                dense
                autocomplete="off"
                label="Amount"
                type="number"
                min="0"
                v-model="advTransaction[n]"
                prefix="Rs"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!--    v-if="amount && select.length > 0"-->
    <v-card
      class="mt-2 pa-3"
      :color="transactionAllowed ? 'green lighten-5' : 'red lighten-4'"
      v-if="!self"
    >
      <v-row class="align-center">
        <v-col cols="4" class="text-center">
          <h2 class="text-md-h3">{{ amount }}</h2>
          <h4>{{ user.name }}</h4>
          <h2 class="red px-1 white--text">
            {{ computedArray[computedArray.length - 1] }}
          </h2>
        </v-col>
        <v-col cols="8">
          <v-row
            class="pa-2 d-flex justify-space-between"
            dense
            v-if="select.length > 0"
          >
            <v-col cols="12" v-for="(item, i) in select" :key="i" md="5">
              <div class="d-flex justify-space-between">
                <div class="light-blue lighten-5 flex-grow-1 pl-3">
                  <h4>{{ getAllUsers[item] }}</h4>
                </div>
                <div class="green white--text px-1">
                  <h3>{{ computedArray[i] }}</h3>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-card class="pa-2" dense v-else>
            <h3 class="text-center">Select at least one member</h3>
          </v-card>
          <v-btn
            elevation="2"
            class="mt-2 green white--text"
            @click.prevent="transaction"
            block
            :disabled="!transactionAllowed"
          >
            <v-icon left v-if="transactionAllowed">
              mdi-sticker-check-outline
            </v-icon>
            <v-icon left v-else>
              mdi-alert-circle-outline
            </v-icon>
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card
      :class="`text-center ${amount < 0 ? 'green lighten-5' : 'red lighten-4'}`"
      v-else
    >
      <div v-if="parseInt(amount) !== 0 && amount">
        <h1>{{ Math.abs(parseInt(amount)) }}</h1>
        <h6 v-if="amount > 0">
          This means you are buying something of cost Rs. {{ parseInt(amount) }}
        </h6>
        <h6 v-else>
          This means you are getting {{ Math.abs(parseInt(amount)) }} from
          someone
        </h6>
      </div>

      <v-btn
        elevation="2"
        class="mt-2 green white--text"
        @click.prevent="transaction"
        block
        :disabled="parseInt(amount) === 0 || !amount"
      >
        <v-icon left v-if="amount !== 0">
          mdi-sticker-check-outline
        </v-icon>
        <v-icon left v-else>
          mdi-alert-circle-outline
        </v-icon>
        Submit
      </v-btn>
    </v-card>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { db, firestore } from "@/firebase/init";
import moment from "moment";

export default {
  name: "HomeTransaction",
  data() {
    return {
      self: false,
      all: false,
      loading: true,
      amount: 0,
      select: [],
      members: [],
      group: "",
      message: "",
      advTransaction: ["", "", ""],
      feedback: ""
    };
  },
  async mounted() {
    if (this.user.default) {
      this.group = this.user.default;
      await this.getGroupMembers();
    } else if (this.user.groups) {
      this.group = Object.keys(this.user.groups)[0];
      await db.ref("users/" + this.user.id).update({
        default: this.group
      });
      await this.getGroupMembers();
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
    },
    computedArray() {
      const selectLength = this.select.length;
      const base = Math.floor(this.amount / (selectLength + 1));
      const individualCost = new Array(selectLength + 1).fill(base);
      for (let i = 0; i < selectLength; i++) {
        individualCost[i] = parseInt(this.advTransaction[i]) || base;
      }
      individualCost[selectLength] =
        this.amount -
        individualCost.slice(0, selectLength).reduce((pv, cv) => pv + cv, 0);
      return individualCost;
    },
    transactionAllowed() {
      return !!(
        this.amount &&
        this.select.length > 0 &&
        this.computedArray.every(val => val > 0)
      );
    }
  },
  watch: {
    self() {
      if (this.self) {
        this.select = [];
        this.advTransaction = [];
      }
    }
  },
  methods: {
    getGroupMembers() {
      db.ref("groups/" + this.group + "/members").once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          const id = childSnapshot.key;
          if (id !== this.user.id) {
            this.members.push({ id: id, name: this.getAllUsers[id] });
          }
        });
        this.loading = false;
      });
    },
    toggle() {
      this.$nextTick(() => {
        if (this.allSelected) {
          this.select = [];
        } else {
          this.select = this.members.map(x => x.id);
        }
      });
    },
    transaction() {
      if (!this.self) {
        if (this.amount !== 0 && this.select.length > 0) {
          const batchTransaction = firestore.batch();
          const computedLength = this.computedArray.length;
          const myAmount = this.computedArray[computedLength - 1];
          if (this.transactionAllowed) {
            for (let i = 0; i < computedLength - 1; i++) {
              if (this.computedArray[i] > 0) {
                batchTransaction.set(
                  firestore.collection("transactions").doc(),
                  {
                    amount: this.computedArray[i],
                    transfer: [this.user.id, this.select[i]],
                    message: this.message,
                    timestamp: moment().format(),
                    group: this.group
                  }
                );
              }
            }
            batchTransaction.set(firestore.collection("transactions").doc(), {
              amount: myAmount,
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
            this.feedback = "You cant spend 0 or in negative";
          }
        } else {
          this.feedback = "Enter Amount and Select Members";
        }
      } else {
        if (parseInt(this.amount) > 0) {
          firestore
            .collection("transactions")
            .doc()
            .set({
              amount: Math.abs(this.amount),
              transfer: [this.user.id, this.user.id],
              message: this.message,
              timestamp: moment().format(),
              self: "buy"
            })
            .then(() => {
              this.amount = 0;
              this.message = "";
            });
        } else if (parseInt(this.amount) < 0) {
          firestore
            .collection("transactions")
            .doc()
            .set({
              amount: Math.abs(this.amount),
              transfer: [this.user.id, this.user.id],
              message: this.message,
              timestamp: moment().format(),
              self: "get"
            })
            .then(() => {
              this.amount = 0;
              this.message = "";
            });
        }
      }
    }
  }
};
</script>

<style scoped></style>
