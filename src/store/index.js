import Vue from 'vue'
import Vuex from 'vuex'

import retailers from '@/assets/data/retailers'
import ordersVic from '@/assets/data/orders/vic'
import ordersNsw from '@/assets/data/orders/nsw'

/// TODO put actions, etc in their own files

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    retailers: retailers,
    ordersVic: ordersVic,
    ordersNsw: ordersNsw   
  },
  getters: {
    activeRetailers : state => {
      return state.retailers.filter(retailer => retailer.active === true)
    },
    activeRetailersLength : (state, getters) => {
      return getters.activeRetailers.length
    }
  },
  mutations: {},
  actions: {}
});
