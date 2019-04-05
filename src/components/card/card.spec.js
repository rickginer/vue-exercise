import { shallowMount } from '@vue/test-utils'
import Card from '@/components/card/Card.vue'

describe('Card.vue', () => {
  it('renders title when passed', () => {
    const title = 'new title'
    const cmp = shallowMount(Card, {
      slots: { 
        title: title
      }
    })
    const titleElem = cmp.find(".title")
    expect(titleElem.text().trim()).toBe(title);
  })  
})
