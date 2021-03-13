<template>
  <div class="home">
    <!-- LOGGED IN -->
    <v-sheet class="pa-3 main-card" height="90vh">
      <v-row v-if="user">
        <v-col cols="12" md="6">
          <HomeTransaction />
        </v-col>
        <v-col cols="12" md="6">
          <div class="col-sticky">
            <HomeHistory />
            <Panel />
          </div>
        </v-col>
      </v-row>
      <div v-else>
        <v-progress-circular
          indeterminate
          :size="80"
          color="purple"
          class="center-spin"
        ></v-progress-circular>
      </div>
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

<style>
.main-card {
  overflow-y: auto;
  overflow-x: hidden;
}
.col-sticky {
  position: -webkit-sticky !important; /* Safari & IE */
  position: sticky !important;
  top: 0 !important;
}
.center-spin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>
