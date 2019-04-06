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
            const vm = wrapper.vm
            
            expect(vm.retailers).toHaveLength(3)
            expect(vm.activeRetailers).toHaveLength(2)
        })
        
    })
})
