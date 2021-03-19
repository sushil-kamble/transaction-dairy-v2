import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db, auth } from "@/firebase/init";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: null,
    transactions: null,
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
      if (state.allUsers)
        return state.allUsers
          .map(x => ({
            id: x.id,
            name: x.name
          }))
          .filter(y => y.id !== auth.currentUser.uid);
      else return [];
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
    bindUser: firestoreAction(context => {
      return context.bindFirestoreRef(
        "user",
        db.collection("users").doc(auth.currentUser.uid)
      );
    }),
    unbindUser: firestoreAction(context => {
      return context.unbindFirestoreRef("user");
    }),
    bindTransactions: firestoreAction(context => {
      return context.bindFirestoreRef(
        "transactions",
        db
          .collection("transactions")
          .where("transfer", "array-contains", auth.currentUser.uid)
          .orderBy("timestamp", "desc")
      );
    }),
    unbindTransactions: firestoreAction(context => {
      return context.unbindFirestoreRef("transactions");
    }),
    bindAllUsers: firestoreAction(context => {
      return context.bindFirestoreRef("allUsers", db.collection("displayName"));
    }),
    unbindAllUsers: firestoreAction(context => {
      return context.unbindFirestoreRef("allUsers");
    })
  }
});
