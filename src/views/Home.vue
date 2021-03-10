<template>
  <div class="home">
    <!-- LOGGED IN -->
    <v-sheet class="pa-2 main-card" height="90vh">
      <v-row v-if="user">
        <v-col cols="12" sm="6">
          <HomeTransaction />
        </v-col>
        <v-col cols="12" sm="6" class="col-sticky">
          <HomeHistory />
          <Panel />
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeTransaction from "@/components/HomeTransaction";
import HomeHistory from "@/components/HomeHistory";
import Panel from "@/components/Panel";
export default {
  name: "Home",
  components: { Panel, HomeHistory, HomeTransaction },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
    // Add your computed properties here
  }
};
</script>

<style scoped>
.main-card {
  overflow-y: auto;
  overflow-x: hidden;
}
.col-sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
}
</style>
