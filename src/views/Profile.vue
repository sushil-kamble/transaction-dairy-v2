<template>
  <v-card class="pa-3 main-card" height="90vh">
    <v-row v-if="user">
      <v-col cols="12" md="6">
        <v-card class="pa-3">
          <h2>Hello, {{ user.name }}</h2>
          <h5>{{ user.email }}</h5>
          <v-divider class="mt-2"></v-divider>
          <v-list dense v-if="user.groups">
            <v-subheader>Your Groups</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(item, i) in user.groups"
                :key="i"
                active-class="white black--text"
                to="/"
              >
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    x-small
                    @click.prevent="defaultMethod(item)"
                    :color="user.default === item ? 'success' : 'secondary'"
                    >Default
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <h2>Create Group</h2>
        <v-divider class="mt-2 my-4"></v-divider>
        <v-text-field
          label="Group"
          v-model="groupName"
          solo
          autocomplete="off"
          append-icon="mdi-send-circle"
          @click:append="createGroup"
        ></v-text-field>
        <v-card class="mb-3 pa-4" v-if="groupName">
          <h3 class="text-center">{{ groupName }}</h3>
          <span v-if="selected.length > 0">
            <v-chip
              label
              v-for="(name, i) in getName"
              :key="i"
              class="mr-4 primary"
            >
              {{ name }}
            </v-chip>
          </span>
          <span v-else>
            Select Group Members
          </span>
        </v-card>
        <v-list dense v-if="getAllUsers" elevation="1">
          <v-subheader>Select Group Members</v-subheader>
          <v-list-item-group color="primary" multiple v-model="selected">
            <v-list-item v-for="(item, i) in getAllUsers" :key="i">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-card class="mt-3 pa-4 error" v-if="feedback">
          <h3 class="text-center white--text">{{ feedback }}</h3>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { db, firebase } from "@/firebase/init";

export default {
  name: "Profile",
  data() {
    return {
      selected: [],
      groupName: "",
      feedback: ""
    };
  },
  computed: {
    ...mapGetters(["user", "getAllUsers"]),
    getId() {
      if (this.selected && this.getAllUsers) {
        return this.selected.map(x => this.getAllUsers[x].id);
      } else return [];
    },
    getName() {
      if (this.selected && this.getAllUsers) {
        return this.selected.map(x => this.getAllUsers[x].name);
      } else return [];
    }
  },
  methods: {
    createGroup() {
      if (this.user.groups) {
        if (!this.user.groups.includes(this.groupName)) {
          db.collection("groups")
            .doc(this.groupName)
            .get()
            .then(doc => {
              if (!doc.exists) {
                const batch = db.batch();
                batch.set(db.collection("groups").doc(this.groupName), {
                  members: [this.user.id, ...this.getId]
                });
                batch.update(db.collection("users").doc(this.user.id), {
                  groups: firebase.firestore.FieldValue.arrayUnion(
                    this.groupName
                  )
                });
                this.getId.forEach(id => {
                  batch.update(db.collection("users").doc(id), {
                    groups: firebase.firestore.FieldValue.arrayUnion(
                      this.groupName
                    )
                  });
                });
                batch.commit().then(() => {
                  this.groupName = "";
                  this.selected = [];
                  this.feedback = "Group Created";
                  console.log("Group created");
                });
              } else {
                this.feedback = "Group already exists";
                console.log("That group already exists");
                // Feedback that group already exists
              }
            });
        } else {
          this.groupName = "";
          this.selected = [];
          this.feedback = "You are already present in the group";
          console.log("You are already present in the group");
          // Feedback you are already present in the group
        }
      } else {
        // First Group
        db.collection("groups")
          .doc(this.groupName)
          .get()
          .then(doc => {
            if (!doc.exists) {
              const batch1 = db.batch();
              batch1.set(db.collection("groups").doc(this.groupName), {
                members: [this.user.id, ...this.getId]
              });
              batch1.update(db.collection("users").doc(this.user.id), {
                groups: firebase.firestore.FieldValue.arrayUnion(
                  this.groupName
                ),
                default: this.groupName
              });
              this.getId.forEach(id => {
                batch1.update(db.collection("users").doc(id), {
                  groups: firebase.firestore.FieldValue.arrayUnion(
                    this.groupName
                  )
                });
              });
              batch1.commit().then(() => {
                this.groupName = "";
                this.selected = [];
                this.feedback = "Group Created";
                console.log("Group created");
              });
            } else {
              this.groupName = "";
              this.selected = [];
              this.feedback = "Group Already exists";
              console.log("That group already exists");
              // Feedback that group already exists
            }
          });
      }
    },
    defaultMethod(group) {
      db.collection("users")
        .doc(this.user.id)
        .update({
          default: group
        });
    }
  }
};
</script>

<style scoped></style>
