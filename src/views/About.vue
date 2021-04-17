<template>
  <v-card class="pa-3 main-card" height="90vh">
    <v-card>
      <v-card-title>Transaction Daily</v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle>About ME</v-card-subtitle>
      <v-card-text>
        Hey, I am
        <a
          href="https://www.sushilkamble.live/"
          target="_blank"
          class="black--text"
          >Sushil Kamble
        </a>
        , computer engineering student from university of Pune. A big fan of
        javascript, vue.js and also Python. This is my 6/7th project in vue.js
        and I am constantly trying to improve my skills.
      </v-card-text>
      <v-card-subtitle>Features</v-card-subtitle>
      <v-card-text>
        <ol>
          <li>
            Keeps record of all of your transactions (Group / Self)
          </li>
          <li>Computed Total of All Transactions</li>
          <li>Authentication System</li>
          <li>
            Smart Bill Split
            <router-link :to="{ name: 'Info' }" class="black--text">
              Check Here
            </router-link>
          </li>
          <li>
            To filter transactions by Users click on the username (Left of
            computed profit)
          </li>
          <li>Simple and Elegant UI</li>
          <li>Realtime Updates</li>
          <li>Create / Delete / Leave group</li>
          <li>Add / Delete transactions</li>
          <li>Available on every device, PWA compatible</li>
          <li>Mobile Responsive UI</li>
        </ol>
      </v-card-text>
      <v-card-subtitle>Technology Stack</v-card-subtitle>
      <v-card-text>
        <ul>
          <li>Frontend: vue.js, vue-router, vuex, vuetify, vuexfire, moment</li>
          <li>
            Backend: Firebase - Firestore, Realtime Database, Firebase Auth
          </li>
          <li>
            Tools: WebStorm 2021, git, github, prettier & es-lint
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-card>
</template>
