<template>
  <v-card class="pa-3">
    <div class="d-flex justify-space-between align-center">
      <h1>Transaction</h1>
      <v-switch v-model="self" label="Self"> </v-switch>
    </div>

    <v-divider class="mt-0 mb-3"></v-divider>

    <v-text-field
      label="Amount"
      type="number"
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
      v-if="!self"
    ></v-select>

    <v-select
      v-model="select"
      :items="members"
      :disabled="group === ''"
      label="Members"
      outlined
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
              <h5 class="pt-1">{{ item }}</h5>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-text-field
                dense
                autocomplete="off"
                label="Amount"
                type="number"
                v-model="advItemPrice[n]"
                prefix="Rs"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-btn elevation="2" class="mt-5">Submit</v-btn>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/firebase/init";

export default {
  name: "HomeTransaction",
  data() {
    return {
      self: false,
      all: false,
      select: [],
      members: [],
      group: "",
      advItemPrice: []
    };
  },
  created() {
    if (this.user.default) {
      this.group = this.user.default;
    }
  },
  computed: {
    ...mapGetters(["user", "getAllUsers", "getTransactions"]),
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
        this.advItemPrice = [];
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
              return this.getAllUsers.find(o => o.id === member).name;
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
          this.select = this.members.slice();
        }
      });
    }
  }
};
</script>

<style scoped></style>
