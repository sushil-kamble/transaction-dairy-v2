<template>
  <v-card class="pa-3 main-card " height="90vh">
    <v-card>
      <v-card-title>Transaction Daily</v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle>Use Cases</v-card-subtitle>
      <v-card-text>
        <p>
          Problem - <strong>Split Bills</strong> - Suppose you live with your
          friends, It is sometimes difficult to track of money, as you go to
          lunch/dinner everyday and one of your friend pays the money.
        </p>
        <p>
          Solution - Simple, One person can <strong>Create a Group</strong>, and
          add his/her friends to it. Now every time any group expenses(eg.
          dinner) happens, the person paying for that expenses need to add
          <strong>Transaction</strong>.
        </p>
        <p>
          <strong>Example</strong> - Suppose your group has 4 members including
          you and you Dinner Bill comes out to be <strong>Rs 400</strong>. One
          of the members pays for it, lets say you. Now you have to enter
          <strong>400</strong> as the amount in Total amount field and
          <strong>Select the group member</strong> you want the amount to be
          split. You can <strong>add appropriate message</strong> to the
          transaction. Finally you will see the
          <strong>Transaction card</strong> that how money is going to the split
          up. If all the member were selected, you will see Rs 100 each, means
          all of the remaining 3 member of the group have to pay you Rs 100 each
          (which will also be updated in their record) and as you too spent Rs
          100 that will be counted as <strong>Self Transaction</strong>.
        </p>
        <v-divider></v-divider>
        <h3 class="mt-3">Bill Split (Recommended to Read)</h3>
        <div class="mt-2">
          <h4>Even Distribution</h4>
          <ul>
            <li>Total Bill: 400 <strong>(Enter in total amount)</strong></li>
            <li>
              Group Members(including you): 4
              <strong>(Select the group members)</strong>
            </li>
            <li>One person pays the entire bill</li>
            <li>Each Individual Part: Rs 100 (400/4)</li>
            <li>
              Remaining peoples: Have to give Rs 100 Each to the Person who pays
              (which will also be updated in the remaining peoples record)
            </li>
            <li>
              Person who pays has also spent Rs 100 (Individual Part) (Spent as
              Self Transaction)
            </li>
            <li><strong>Click on Submit</strong></li>
          </ul>
        </div>
        <div class="mt-2">
          <h4>Uneven Distribution</h4>
          <ul>
            <li>Total Bill: 400</li>
            <li>Group Members(including you): 4</li>
            <li>Each Part: Rs 100 (400/4)</li>
            <li>
              Each part is 100 but you don't want that. So
              <strong>Click on Advance</strong>
            </li>
            <li>Member 1: Rs 80 (Enter Amount corresponding to the member)</li>
            <li>
              Rest of the money will be divided in 3(total members - member/'s
              initialize) -> (400 - 80) / (4 - 1) = 106
            </li>
            <li>
              <strong>Check the transaction card & Click on Submit</strong>
            </li>
          </ul>
        </div>
        <div class="mt-2">
          <h4>Self Transaction</h4>
          <ul>
            <li>
              <strong>Click on the toggle button & toggle to self mode</strong>
            </li>
            <li>Lets say you buy a Book of Rs 100</li>
            <li>Enter that amount in total amount</li>
            <li><strong>Click on Submit, That's it, Done</strong></li>
            <li>
              Suppose you have a profit of Rs 500
            </li>
            <li>
              Just add a <strong>minus sign '-'</strong> before the profit
              amount
            </li>
            <li><strong>Click on Submit, That's it, Done</strong></li>
          </ul>
        </div>
        <div class="mt-2">
          <h4>Give money to your friend (group member)</h4>
          <ul>
            <li>
              Lets say you want to give Rs 100 to one of your group member
            </li>
            <li>Enter that amount in total amount</li>
            <li><strong>Click on Advance</strong></li>
            <li>
              Enter the same amount corresponding to the user, Such that your
              total becomes Zero(0) which you can watch in transaction card
            </li>
            <li><strong>Click on Submit, That's it, Done</strong></li>
          </ul>
        </div>
      </v-card-text>
    </v-card>
    <v-divider class="my-2"></v-divider>

    <v-btn block small :to="{ name: 'About' }">Features</v-btn>
  </v-card>
</template>
