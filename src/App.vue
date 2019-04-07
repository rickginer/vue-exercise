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

    <Card>
      <template slot="title">
        Which **active** retailer ordered the greatest quantity of *Gladiator Snack Bags*?
      </template>

      <template slot="content">
        {{ getRetailerWithMaxOrdersForProduct('P10000335')
         }}
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
    },
    ordersCombined: function() {
      return this.ordersNsw.concat(this.ordersVic)
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
    },
    getProductOrdersByRetailer: function (productCode) {
      // TODO: make this method more functional
      let orders = this.ordersCombined;
      let productOrders = [];
      this.activeRetailers.forEach(function (retailer)  {
        let qty = 0;
        let retailersOrders = orders.filter(order => order.retailerId === retailer.retailerId);
        retailersOrders.forEach(function (order) {
          order.items.forEach(function(item) {
            if (item.productCode === productCode) {
              qty += item.orderedQuantity;
            }
          });
        });
        if(qty > 0) {
          productOrders.push(
            {
              retailerId: retailer.retailerId,
              retailerName: retailer.name,
              productQty: qty
            }
          )
        }
      });
      return productOrders;
    },
    getRetailerWithMaxOrdersForProduct: function (productCode) {
      let products = this.getProductOrdersByRetailer(productCode);
      return products.length ?
        this.getProductOrdersByRetailer(productCode)
          .reduce((prev, current) => (prev.productQty > current.productQty) ? prev : current)
          .retailerName
        : null;      
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
