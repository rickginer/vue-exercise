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

export default {
  name: 'app',
  components: {
    Card,
  },
  data() {
    return {
      retailers: store.state.retailers, // TODO once all logic moved to store, won't need to directly reference state data here
      ordersVic: store.state.ordersVic,
      ordersNsw: store.state.ordersNsw      
    }
  },
  computed: {
    activeRetailersLength: function () {
      return store.getters.activeRetailersLength;
    },
    activeRetailers: function () {
      return store.getters.activeRetailers;
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
    },
    totalByRegion: function (regionOrders) {
      // TODO use Reduce here
      let total = 0;
      regionOrders.forEach( function (order) {
        order.items.forEach( function (item) {
          total += item.orderedQuantity * (item.itemPriceExGst * 100) // convert to cents to avoid floating number issue
        })
      })
      return total;
    },
    orderTotals: function () {
      return [
        {
          'regionName': 'VIC',
          'totalSpend': this.totalByRegion(this.ordersVic) / 100 // convert from cents to dollars
        },
        {
          'regionName': 'NSW',
          'totalSpend': this.totalByRegion(this.ordersNsw) / 100
        }
      ]
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
