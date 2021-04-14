<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        x-small
        color="error"
        dark
        v-bind="attrs"
        v-on="on"
        :loading="loading"
      >
        {{ owner ? 'DEL GP' : 'LVE GP' }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="error white--text">
        {{ owner ? 'Delete Group' : 'Leave Group' }} - {{ group }}
      </v-card-title>

      <v-card-text class="mt-4">
        <div v-if="owner">
          <h3>
            You are the owner of this group, Are you absolutely sure you want to
            delete the group.
          </h3>
        </div>
        <div v-else>
          <h3>Do you want to leave the group?</h3>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="success" @click="dialog = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          text
          :loading="loading"
          @click="deleteOrLeaveGroup()"
        >
          {{ owner ? 'Delete Group' : 'Leave Group' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { db } from '@/firebase/init'

export default {
  name: 'ExitGroup',
  props: ['group'],
  data() {
    return {
      dialog: false,
      owner: false,
      loading: false
    }
  },
  async mounted() {
    this.loading = true
    if (this.user) {
      await db
        .ref(`groups/${this.group}/owner`)
        .get()
        .then(snapshot => {
          if (snapshot.val() === this.user.id) {
            this.owner = true
            this.loading = false
          }
        })
    }
    this.loading = false
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    deleteOrLeaveGroup() {
      this.loading = true
      if (this.owner) {
        const deleteGroup = {}
        let members = []
        db.ref(`groups/${this.group}/members`)
          .get()
          .then(snap => {
            members = Object.keys(snap.val())
            members.forEach(member => {
              deleteGroup[`users/${member}/groups/${this.group}`] = null
            })
            deleteGroup[`groups/${this.group}`] = null
            db.ref()
              .update(deleteGroup)
              .then(() => {
                this.resetUserDefault()
              })
          })
      } else {
        const leaveGroup = {}
        leaveGroup[`users/${this.user.id}/groups/${this.group}`] = null
        leaveGroup[`groups/${this.group}/members/${this.user.id}`] = null
        db.ref()
          .update(leaveGroup)
          .then(() => {
            this.resetUserDefault()
          })
      }
    },
    resetUserDefault() {
      if (this.user.default === this.group) {
        db.ref(`users/${this.user.id}`).update({
          default: null
        })
      }
      this.loading = false
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
