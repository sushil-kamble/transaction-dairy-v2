<template>
  <div class="my-font">
    <v-app-bar color="secondary" dense dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="user">{{ user.name }}'s Dairy</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <h1 class="ml-1">Transaction Dairy</h1>
          <v-divider></v-divider>
          <div v-if="user" class="ml-1">
            <h2>{{ user.name }}</h2>
            <h4 class="text-uppercase">{{ user.default }}</h4>
            <h4>{{ getCurrentDate() }}</h4>
          </div>

          <v-divider class="mt-2 mb-4"></v-divider>

          <v-list-item :to="{ name: 'Home' }">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{ name: 'Profile' }" v-if="user">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{ name: 'Info' }">
            <v-list-item-title>Info</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{ name: 'About' }">
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-if="user">
            <v-list-item-title @click="logout" class="error--text py-2">
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { auth } from '@/firebase/init'
import moment from 'moment'

export default {
  name: 'Profile',
  data() {
    return {
      drawer: false,
      group: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        this.$router.replace({ name: 'Auth' })
      })
    },
    getCurrentDate() {
      return moment().format('lll')
    }
  }
}
</script>
