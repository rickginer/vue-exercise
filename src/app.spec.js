import { shallowMount, mount } from '@vue/test-utils'
import AppView from '@/App.vue'

describe('App.vue', () => {

    describe('loads json data', () => {
        it('loads an array of retailers data', () => {
            const wrapper = shallowMount(AppView, {})
            const vm = wrapper.vm
            expect(Array.isArray(vm.retailers)).toBe(true);
        })
        
        it('loads an array of NSW orders data', () => {
            const wrapper = shallowMount(AppView, {})
            const vm = wrapper.vm
            expect(Array.isArray(vm.ordersNsw)).toBe(true);
        })
        
        it('loads an array of VIC orders data', () => {
            const wrapper = shallowMount(AppView, {})
            const vm = wrapper.vm
            expect(Array.isArray(vm.ordersVic)).toBe(true);
        })
    })

    describe('Question: How many **active** retailers do we have?', () => {

        it('renders question to view', () => {
            const wrapper = mount(AppView, {})
            expect(wrapper.html()).toContain('How many **active** retailers do we have?')
        })

        it('activeRetailers has a subset of only "active" retailers', () => {
            const wrapper = shallowMount(AppView, {})
            const vm = wrapper.vm
            wrapper.setData({
                retailers: [
                    {
                        "retailerId": 1,
                        "active": true
                    },
                    {
                        "retailerId": 2,
                        "active": true
                    },
                    {
                        "retailerId": 3,
                        "active": false
                    }
                ]
            });
            
            expect(vm.activeRetailers).toHaveLength(2)
        })
        
    })

    describe('Which store in the **VIC** region has never placed an order?', () => {

        describe('hasNoOrder method', () => {
            let wrapper;
            let vm;

            beforeEach(() => {
                wrapper = shallowMount(AppView, {})
                vm = wrapper.vm
                wrapper.setData({
                    retailers: [
                        {
                            "retailerId": 1,
                            "name": "Retailer with order NSW",
                            "region": "NSW"
                          },
                          {
                            "retailerId": 2,
                            "name": "Retailer with order VIC",
                            "region": "VIC"
                          },
                          {
                            "retailerId": 3,
                            "name": "Retailer with no order NSw",
                            "region": "NSW"
                          },
                          {
                            "retailerId": 4,
                            "name": "Retailer with no order VIC",
                            "region": "VIC"
                          },
                          {
                            "retailerId": 5,
                            "name": "Retailer with no order VIC 2",
                            "region": "VIC"
                          }
                    ],
                    ordersVic: [
                        {
                            "orderId": 1,
                            "retailerId": 1,
                            "items": []
                        },
                        {
                            "orderId": 2,
                            "retailerId": 2,
                            "items": []
                        }
                    ]
                });
            })
    
            it('returns an array containing all retailers without an order form the same region', () => {
                let expected = [{
                    "retailerId": 4,
                    "name": "Retailer with no order VIC",
                    "region": "VIC"
                  },
                  {
                    "retailerId": 5,
                    "name": "Retailer with no order VIC 2",
                    "region": "VIC"
                }];
                let noOrdersVic = vm.hasNoOrder('VIC');
                expect(noOrdersVic).toEqual(expected);
            })

        })

    });


})
