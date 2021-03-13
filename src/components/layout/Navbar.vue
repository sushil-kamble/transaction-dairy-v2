<template>
  <div>
    <v-app-bar color="secondary" dense dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="user">{{ user.name }}'s Daily</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <h1>Transaction Daily</h1>
          </v-list-item>

          <v-divider class="mt-2 mb-4"></v-divider>

          <v-list-item :to="user ? { name: 'Home' } : { name: 'Welcome' }">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{ name: 'Profile' }">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{ name: 'History' }">
            <v-list-item-title>History</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{ name: 'About' }">
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-if="user">
            <v-list-item-title>
              <v-btn @click="logout" color="error" small text block>
                Logout
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { auth } from "@/firebase/init";

export default {
  name: "Profile",
  data() {
    return {
      drawer: false,
      group: null
    };
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
    // Add your computed properties here
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        this.$router.replace({ name: "Auth" });
      });
    }
  }
};
</script>
