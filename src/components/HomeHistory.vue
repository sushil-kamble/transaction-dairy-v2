<template>
  <v-card class="pa-3 my-font" v-if="getAllUsers">
    <h3 class="pa-2">
      {{
        getCurrMember
          ? `${getAllUsers[getCurrMember.id]} - ${getCurrMember.amount}`
          : 'History'
      }}
    </h3>

    <v-data-table
      dense
      fixed-header
      height="300"
      disable-pagination
      hide-default-footer
      :headers="headers"
      :items="filteredTransaction"
      item-key="id"
      class="mt-2"
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <template v-slot:item.transfer[0]="{ item }">
        {{
          item.hasOwnProperty('self') ? '-' : `${getAllUsers[item.transfer[0]]}`
        }}
      </template>
      <template v-slot:item.transfer[1]="{ item }">
        {{
          item.hasOwnProperty('self') ? '-' : `${getAllUsers[item.transfer[1]]}`
        }}
      </template>
      <template v-slot:item.amount="{ item }">
        <v-chip label :color="getClass(item)" dark small>
          {{ item.amount }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <TransactionDialog :item="item" :priceColor="getClass(item)" />
      </template>
    </v-data-table>
    <div v-else>
      <Transactions
        :user="user"
        :get-all-users="getAllUsers"
        :get-transactions="filteredTransaction"
      />
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import TransactionDialog from '@/components/dialogs/TransactionDialog'
import Transactions from '@/components/Transactions'
export default {
  name: 'HomeHistory',
  components: { Transactions, TransactionDialog },
  data: () => ({
    dialog: false,
    setCurr: null,
    headers: [
      {
        text: 'From',
        align: 'start',
        value: 'transfer[0]'
      },
      { text: 'To', value: 'transfer[1]' },
      { text: 'Amount', value: 'amount' },
      { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
    ]
  }),
  computed: {
    ...mapGetters(['user', 'getAllUsers', 'getTransactions', 'getCurrMember']),
    filteredTransaction() {
      if (this.getTransactions && this.getCurrMember) {
        return this.getTransactions.filter(
          tran =>
            tran.transfer[0] === this.getCurrMember.id ||
            tran.transfer[1] === this.getCurrMember.id
        )
      }
      return this.getTransactions
    }
  },
  methods: {
    getFormattedTime(time) {
      return moment(time).format('lll')
    },
    getClass(item) {
      if ('self' in item) {
        return item.self === 'get' ? 'green' : 'red'
      } else {
        return item.transfer[0] === this.user.id ? 'green' : 'red'
      }
    }
  }
}
</script>
