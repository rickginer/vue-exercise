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
      return this.retailers.filter(value => value.active === true)
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
</style>
