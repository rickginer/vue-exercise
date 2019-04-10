import store from '@/store'

describe('getters', () => {

    beforeEach(() => {
        store.replaceState({
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
    })

    it('activeRetailers has a subset of only "active" retailers', () => {

        const expected = [
            {
                "retailerId": 1,
                "active": true
            },
            {
                "retailerId": 2,
                "active": true
            }
        ]
        
        expect(store.getters.activeRetailers).toEqual(expected)

    })

    it('activeRetailersLength returns length of array subset of only active retailers', () => {

        expect(store.getters.activeRetailersLength).toEqual(2)

    })
    
})
