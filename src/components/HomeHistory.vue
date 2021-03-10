<template>
  <v-card class="pa-3">
    <h1>History</h1>

    <v-data-table
      dense
      fixed-header
      height="300"
      disable-pagination
      hide-default-footer
      :headers="headers"
      :items="transactionHistory"
      item-key="id"
      class="mt-3"
    >
      <template v-slot:item.amount="{ item }">
        <v-chip :color="item.from === 'Sushil' ? 'green' : 'red'" dark small>
          {{ item.amount }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <TransactionDialog :item="item" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import TransactionDialog from "@/components/dialogs/TransactionDialog";
export default {
  name: "HomeHistory",
  components: { TransactionDialog },
  data: () => ({
    transactionHistory: [
      {
        id: 1,
        from: "Sushil",
        to: "Hrushi",
        amount: 90,
        description: "Dinner"
      },
      {
        id: 2,
        from: "Sayyam",
        to: "Sushil",
        amount: 30,
        description: "Tea"
      },
      {
        id: 3,
        from: "Sarvajeet",
        to: "Sushil",
        amount: 150,
        description: "Dinner"
      },
      {
        id: 4,
        from: "Sarvajeet",
        to: "Sushil",
        amount: 200,
        description: "Lunch"
      },
      {
        id: 5,
        from: "Sushil",
        to: "Sayyam",
        amount: 300,
        description: "Shopping"
      },
      {
        id: 6,
        from: "Sarvajeet",
        to: "Sushil",
        amount: 10,
        description: "Tea"
      },
      {
        id: 7,
        from: "Sarvajeet",
        to: "Sushil",
        amount: 30,
        description: "Breakfast"
      },
      {
        id: 8,
        from: "Sayyam",
        to: "Sushil",
        amount: 50,
        description: "Dinner"
      },
      {
        id: 9,
        from: "Sayyam",
        to: "Sushil",
        amount: 10,
        description: "Tea"
      }
    ],
    headers: [
      {
        text: "From",
        align: "start",
        value: "from"
      },
      { text: "To", value: "to" },
      { text: "Amount", value: "amount" },
      { text: "Actions", value: "actions", sortable: false, align: "center" }
    ]
  })
};
</script>
