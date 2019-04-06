import { shallowMount } from '@vue/test-utils'
import AppView from '@/App.vue'

describe('App.vue', () => {

    it('renders to view', () => {
        const wrapper = shallowMount(AppView, {})
        expect(wrapper.html()).toMatchSnapshot()
    })
    
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
