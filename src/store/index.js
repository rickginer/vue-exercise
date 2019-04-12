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
    },
    allOrders : state => {
      return state.ordersNsw.concat(state.ordersVic)
    },
    allProducts : (state, getters) => {
      let uniqueProducts = [];
      getters.allOrders.reduce(function(acc, value) {
        value.items.reduce(function(acc, value) {
          let objIndex = uniqueProducts.findIndex((product => product.productCode == value.productCode));
          if (objIndex !== -1) {
            acc[objIndex].totalOrdered += value.orderedQuantity
          } else {
            acc.push(
              {
                productCode: value.productCode,
                totalOrdered: value.orderedQuantity
              }
            )
          }
          return acc;
        }, uniqueProducts);
      }, uniqueProducts); 
      return uniqueProducts;
    },
    getProductOrdersByRetailer :  (state, getters) => (productCode) => {
      // TODO: make this method more functional
      let orders = getters.allOrders;
      let productOrders = [];
      getters.activeRetailers.forEach(function (retailer)  {
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
    getRetailerWithMaxOrdersForProduct : (state, getters) => (productCode) => {
      let products = getters.getProductOrdersByRetailer(productCode);
      return products.length ?
        getters.getProductOrdersByRetailer(productCode)
          .reduce((prev, current) => (prev.productQty > current.productQty) ? prev : current)
          .retailerName
        : null;   
    },
    hasNoOrder: (state) => (region) => {
      const ordersList = region === "VIC" ? state.ordersVic : state.ordersNsw;
      const retailers = state.retailers.filter(retailer => retailer.region === region);
      let retailersWithNoOrder = [];
      retailers.forEach(function (retailer)  {
        if(ordersList.filter(order => order.retailerId === retailer.retailerId).length === 0){
          retailersWithNoOrder.push(retailer)
        }
      });
      return retailersWithNoOrder;
    },
    
    totalByRegion: () => (regionOrders) => {
      let total = 0;
      regionOrders.reduce(function(acc, value) {
        value.items.reduce(function(acc, value) {
          total += value.orderedQuantity * Math.round((value.itemPriceExGst * 100) * 1e12) / 1e12// convert to cents to avoid floating number issue;
          return acc
        }, total)
      }, total)
      return total;
    },
    orderTotals: (state, getters) => () => {
      return [
        { 
          'regionName': 'VIC',
          'totalSpend': getters.totalByRegion(state.ordersVic) / 100 // convert from cents to dollars
        },
        {
          'regionName': 'NSW',
          'totalSpend': getters.totalByRegion(state.ordersNsw) / 100
        }
      ]
    },
    oldestOrders: (state, getters) => {
      return getters.allOrders.filter( e => { 
        return new Date( e.orderDate ).getTime() == new Date(Math.min.apply(null, getters.allOrders.map( e => {
          return new Date(e.orderDate);
        }))).getTime();
        // iterate through orders, add retailer name
      }).map((order) => {
        order.retailerName = state.retailers.filter(retailer => retailer.retailerId === order.retailerId)[0].name;
        return order;
      });
    },
    mostSoldProduct: (state, getters) => {
      // TODO should probably return an array in case there are multiple with the same count
      return getters.allProducts
          .reduce((prev, current) => (prev.totalOrdered > current.totalOrdered) ? prev : current)
          .productCode      
    },
    biggestSpender: (state, getters) => {
      // TODO break up into smaller methods
      let retailersSpend = []

      getters.allOrders.reduce(function(prevOrder, currentOrder) {
        currentOrder.items.reduce(function(prevItem, currentItem) {
          let objIndex = retailersSpend.findIndex((retailer => retailer.retailerId == currentOrder.retailerId));
          let spend =  currentItem.orderedQuantity * Math.round((currentItem.itemPriceExGst * 100)  * 1e12) / 1e12 // convert to cents. No need to add GST

          if (objIndex !== -1) {
            prevItem[objIndex].totalSpend += spend
          } else {
            prevItem.push(
              {
                retailerId: currentOrder.retailerId,
                totalSpend: spend
              }
            )
          }
          return prevItem;
        }, retailersSpend)
        
      }, retailersSpend)

      // Filter by active retailers
      retailersSpend = retailersSpend.reduce(function(acc, current) {
        let active = state.retailers.filter(retailer => retailer.retailerId === current.retailerId)[0].active;
        if(active) {
          acc.push({
            totalSpend: current.totalSpend,
            retailerName: state.retailers.filter(retailer => retailer.retailerId === current.retailerId)[0].name
          })
        }
        return acc;
      }, []);

      return retailersSpend
          .reduce((prev, current) => (prev.totalSpend > current.totalSpend) ? prev : current)
          .retailerName
    }
  },
  mutations: {},
  actions: {}
});
