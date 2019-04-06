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

        it('has a subset of data containing activeRetailers', () => {
            const wrapper = shallowMount(AppView, {})
            const vm = wrapper.vm
            expect(Array.isArray(vm.activeRetailers)).toBe(true);
        })
        
    })
})
