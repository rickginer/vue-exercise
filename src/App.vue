<template>
  <div id="app">
    <Card>
      <template slot="title">
        Question
      </template>

      <template slot="content">
        Answer to question
      </template>
    </Card>

    <h2>Retailers</h2>
    <table>
      <tr v-for="(retailer) in retailers" :key="retailer.retailerId">
        <td>{{ retailer.retailerId }}</td>
        <td>{{ retailer.name }}</td>        
      </tr>
    </table>


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
