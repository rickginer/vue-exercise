<template>
  <div id="app">
    <Card>
      <template slot="title">
        How many **active** retailers do we have?
      </template>

      <template slot="content">
        {{ activeRetailers.length }}
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
  </div>
</template>
<script>
import Card from './components/card/Card.vue'

import retailers from './assets/data/retailers'
import ordersVic from './assets/data/orders/vic'
import ordersNsw from './assets/data/orders/nsw'

export default {
  name: 'app',
  components: {
    Card,
  },
  data() {
    return {
      retailers: retailers,
      ordersVic: ordersVic,
      ordersNsw: ordersNsw
    }
  },
  computed: {
    activeRetailers: function () {
      return this.retailers.filter(retailer => retailer.active === true)
    }
  },
  methods: {
    hasNoOrder: function (region) {
      const ordersList = region === "VIC" ? this.ordersVic : this.ordersNsw;
      const retailers = this.retailers.filter(retailer => retailer.region === region);
      let retailersWithNoOrder = [];
      retailers.forEach(function (retailer)  {
        if(ordersList.filter(order => order.retailerId === retailer.retailerId).length === 0){
          retailersWithNoOrder.push(retailer)
        }
      });
      return retailersWithNoOrder;
    }
  }
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
