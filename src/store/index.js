import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firebaseAction, firestoreAction } from "vuexfire";
import { db, firestore, auth } from "@/firebase/init";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: null,
    transactions: [],
    allUsers: null,
    currMember: null
  },
  getters: {
    user(state) {
      return state.user;
    },
    getCurrMember(state) {
      return state.currMember;
    },
    getTransactions(state) {
      return state.transactions;
    },
    getAllUsers(state) {
      return state.allUsers;
    }
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
    SET_MEMBER(state, data) {
      state.currMember = data;
    },
    ...vuexfireMutations
  },
  actions: {
    fetchUser(context, user) {
      if (user) {
        Promise.all([
          context.dispatch("bindUser"),
          context.dispatch("bindTransactions"),
          context.dispatch("bindAllUsers")
        ]).then(r => r);
      } else {
        Promise.all([
          context.dispatch("unbindUser"),
          context.dispatch("unbindTransactions"),
          context.dispatch("unbindAllUsers")
        ]).then(r => r);
        context.commit("SET_USER", null);
      }
    },
    bindUser: firebaseAction(({ bindFirebaseRef }) => {
      return bindFirebaseRef("user", db.ref("users/" + auth.currentUser.uid));
    }),
    bindTransactions: firestoreAction(context => {
      return context.bindFirestoreRef(
        "transactions",
        firestore
          .collection("transactions")
          .where("transfer", "array-contains", auth.currentUser.uid)
          .orderBy("timestamp", "desc")
      );
    }),
    unbindTransactions: firestoreAction(context => {
      return context.unbindFirestoreRef("transactions");
    }),
    bindAllUsers: firebaseAction(({ bindFirebaseRef }) => {
      return bindFirebaseRef("allUsers", db.ref("/displayName/"));
    }),
    unbindUser: firebaseAction(({ unbindFirebaseRef }) => {
      return unbindFirebaseRef("user");
    }),
    unbindAllUsers: firebaseAction(({ unbindFirebaseRef }) => {
      return unbindFirebaseRef("allUsers");
    })
  }
});
