<template>
  <div id="app">

    <Card>
      <template slot="title">
        How many **active** retailers do we have?
      </template>

      <template slot="content">
        {{ activeRetailersLength }}
      </template>
    </Card>

    <Card>
      <template slot="title">
        Which store in the **VIC** region has never placed an order?
      </template>

      <template slot="content">
        <ul>
          <li v-for="(retailer) in hasNoOrder('VIC')" :key="retailer.retailerId">
            {{ retailer.name }}
          </li>
        </ul>
      </template>
    </Card>

    <Card>
      <template slot="title">
        Which **active** retailer ordered the greatest quantity of *Gladiator Snack Bags*?
      </template>

      <template slot="content">
        {{ getRetailerWithMaxOrdersForProduct('P10000335')
         }}
      </template>
    </Card>

    <Card>
      <template slot="title">
        What is the total order amount, grouped by **region**?
      </template>

      <template slot="content">
        <ul>
          <li v-for="(region) in orderTotals()" :key="region.regionName">
            {{ region.regionName }} : ${{ region.totalSpend.toLocaleString() }} + GST
          </li>
        </ul>
      </template>
    </Card>

  </div>
</template>
<script>
import store from '@/store'
import Card from './components/card/Card.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    Card,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'activeRetailersLength',
      'getRetailerWithMaxOrdersForProduct',
      'hasNoOrder',
      'orderTotals'
    ])
  },
  methods: {}
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul {
  list-style-type:  none;
  padding: 0;
}
</style>
