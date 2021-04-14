<template>
  <v-card class="pa-3 main-card my-font" height="90vh">
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
                v-for="(item, i) in Object.keys(user.groups)"
                :key="i"
                active-class="white black--text"
                dense
              >
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item"
                    class="text-uppercase"
                  ></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <div class="d-flex">
                    <v-btn
                      x-small
                      @click.prevent="defaultMethod(item)"
                      class="mr-4"
                      :color="user.default === item ? 'success' : 'secondary'"
                      >Default
                    </v-btn>
                    <ExitGroup :group="item" />
                  </div>
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
          :loading="loading"
          solo
          autocomplete="off"
          append-icon="mdi-send-circle"
          @click:append="createGroup"
        ></v-text-field>
        <v-card class="mb-3 pa-4" v-if="groupName">
          <h3 class="text-center">{{ groupLowerCase }}</h3>
          <span v-if="selected.length > 0">
            <v-chip
              label
              v-for="(id, i) in getId"
              :key="i"
              class="mr-4 primary"
            >
              {{ getAllUsers[id] }}
            </v-chip>
          </span>
          <span v-else>
            Select Group Members
          </span>
        </v-card>
        <v-list dense v-if="getAllUsers" elevation="1">
          <v-subheader>Select Group Members</v-subheader>
          <v-list-item-group color="primary" multiple v-model="selected">
            <v-list-item v-for="(item, i) in filteredUsers" :key="i">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="getAllUsers[item]"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-card
          class="mt-3 pa-4"
          v-if="feedback.length > 0"
          :color="feedback[1]"
        >
          <h3 class="text-center white--text">{{ feedback[0] }}</h3>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { db } from '@/firebase/init'
import ExitGroup from '@/components/dialogs/ExitGroup'

export default {
  name: 'Profile',
  components: { ExitGroup },
  data() {
    return {
      selected: [],
      groupName: '',
      feedback: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['user', 'getAllUsers']),
    getId() {
      if (this.selected && this.filteredUsers) {
        return this.selected.map(x => this.filteredUsers[x])
      } else return []
    },
    filteredUsers() {
      if (this.getAllUsers && this.user) {
        return Object.keys(this.getAllUsers).filter(id => id !== this.user.id)
      }
      return []
    },
    groupLowerCase() {
      return this.groupName
        .toLowerCase()
        .replace(/[^A-Z0-9]+/gi, '')
        .substring(0, 20)
    }
  },
  methods: {
    createGroup() {
      if (
        this.groupLowerCase.length > 2 &&
        this.selected.length > 0 &&
        this.selected.length < 5
      ) {
        this.loading = true
        if (this.user.groups) {
          if (!Object.keys(this.user.groups).includes(this.groupLowerCase)) {
            db.ref('groups/' + this.groupLowerCase)
              .get()
              .then(lookupGroup => {
                if (!lookupGroup.exists()) {
                  const makeGroup = {}
                  const userIncluded = [this.user.id, ...this.getId]
                  db.ref('groups/' + this.groupLowerCase)
                    .update({
                      name: this.groupLowerCase,
                      owner: this.user.id,
                      dateCreated: moment().format()
                    })
                    .then(() => {
                      userIncluded.forEach(id => {
                        makeGroup[
                          'groups/' + this.groupLowerCase + '/members/' + id
                        ] = true
                        makeGroup[
                          'users/' + id + '/groups/' + this.groupLowerCase
                        ] = true
                      })
                      db.ref()
                        .update(makeGroup)
                        .then(() => {
                          this.resetGroup()
                          this.feedback = ['Group Created', 'success']
                        })
                    })
                } else {
                  this.resetGroup()
                  this.feedback = [
                    'You are already present in the group',
                    'error'
                  ]
                }
              })
          } else {
            this.resetGroup()
            this.feedback = ['You are already present in the group', 'error']
            // Feedback you are already present in the group
          }
        } else {
          // First Group
          db.ref('groups/' + this.groupLowerCase)
            .get()
            .then(lookupGroup => {
              if (!lookupGroup.exists()) {
                const makeGroupFirst = {}
                const userIncluded = [this.user.id, ...this.getId]
                db.ref('groups/' + this.groupLowerCase)
                  .update({
                    name: this.groupLowerCase,
                    owner: this.user.id,
                    dateCreated: moment().format()
                  })
                  .then(() => {
                    userIncluded.forEach(id => {
                      makeGroupFirst[
                        'groups/' + this.groupLowerCase + '/members/' + id
                      ] = true
                      makeGroupFirst[
                        'users/' + id + '/groups/' + this.groupLowerCase
                      ] = true
                    })
                    db.ref()
                      .update(makeGroupFirst)
                      .then(() => {
                        this.resetGroup()
                        this.feedback = ['Group Created', 'success']
                      })
                  })
              } else {
                this.resetGroup()
                this.feedback = ['Group Already exists', 'error']
              }
            })
        }
      } else {
        this.feedback = [
          'Type Group name and select members (at least 1 & at most 4)',
          'error'
        ]
      }
    },
    defaultMethod(group) {
      db.ref('users/' + this.user.id).update({
        default: group
      })
    },
    resetGroup() {
      this.groupName = ''
      this.selected = []
      this.loading = false
    }
  }
}
</script>

<style scoped></style>
