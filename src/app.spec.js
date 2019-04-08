import { shallowMount, mount } from '@vue/test-utils'
import AppView from '@/App.vue'

describe('App.vue', () => {

    describe('loads json data', () => {
        let wrapper, vm;
        beforeEach(() => {
            wrapper = shallowMount(AppView, {})
            vm = wrapper.vm
        })
        it('for retailers', () => {
            expect(Array.isArray(vm.retailers)).toBe(true);
        })
        
        it('for NSW orders', () => {
            expect(Array.isArray(vm.ordersNsw)).toBe(true);
        })
        
        it('for VIC orders', () => {
            expect(Array.isArray(vm.ordersVic)).toBe(true);
        })
        
        it('for combined orders', () => {
            wrapper.setData({
                ordersNsw: [
                    {
                        "orderId": 1,
                    }
                ],
                ordersVic: [
                    {
                        "orderId": 2,
                    }
                ]
            });
            let expected = [
                {
                    "orderId": 1,
                },
                {
                    "orderId": 2,
                }
            ]
            expect(vm.ordersCombined).toEqual(expected);
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

    describe('Question: Which store in the **VIC** region has never placed an order?', () => {

        describe('hasNoOrder method', () => {
            let wrapper, vm;

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
                const expected = [{
                    "retailerId": 4,
                    "name": "Retailer with no order VIC",
                    "region": "VIC"
                  },
                  {
                    "retailerId": 5,
                    "name": "Retailer with no order VIC 2",
                    "region": "VIC"
                }];
                const noOrdersVic = vm.hasNoOrder('VIC');
                expect(noOrdersVic).toEqual(expected);
            })

        })

    });

    describe('Question: Which **active** retailer ordered the greatest quantity of *Gladiator Snack Bags*?', () => {

        let wrapper, vm;
        const foundProductCode = 'same';

        beforeEach(() => {
            wrapper = shallowMount(AppView, {})
            vm = wrapper.vm
            wrapper.setData({
                retailers: [
                    {
                        "retailerId": 1,
                        "name": "Retailer NSW",
                        "region": "NSW",
                        "active": true
                    },
                    {
                        "retailerId": 2,
                        "name": "Retailer VIC",
                        "region": "VIC",
                        "active": true
                    }
                ],
                ordersVic: [],
                ordersNsw: [
                    {
                        "orderId": 1,
                        "retailerId": 1,
                        "items": [
                            {
                                "productCode": foundProductCode,
                                "orderedQuantity": 5
                            }
                        ]
                    },
                    {
                        "orderId": 2,
                        "retailerId": 2,
                        "items": [
                            {
                                "productCode": foundProductCode,
                                "orderedQuantity": 5
                            }
                        ]
                    },
                    {
                        "orderId": 3,
                        "retailerId": 1,
                        "items": [
                            {
                                "productCode": foundProductCode,
                                "orderedQuantity": 5
                            }
                        ]
                    },
                    {
                        "orderId": 4,
                        "retailerId": 1,
                        "items": [
                            {
                                "productCode": "different",
                                "orderedQuantity": 5
                            }
                        ]
                    }
                ]
            });
        })

        describe('getProductOrdersByRetailer method', () => {

            it('should combine all orders for a particular product and group by retailer', () => {
                const expected = [
                    {"productQty": 10, "retailerId": 1, "retailerName": "Retailer NSW"},
                    {"productQty": 5, "retailerId": 2, "retailerName": "Retailer VIC"}]
                expect(vm.getProductOrdersByRetailer(foundProductCode)).toEqual(expected);
            });

            it('should return empty array if product ID not found', () => {
                expect(vm.getProductOrdersByRetailer('notFound')).toEqual([]);
            });

            it('should only combine orders ofr active retailers', () => {
                wrapper.setData({
                    retailers: [
                        {
                            "retailerId": 1,
                            "name": "Retailer NSW",
                            "region": "NSW",
                            "active": true
                        },
                        {
                            "retailerId": 2,
                            "name": "Retailer VIC",
                            "region": "VIC",
                            "active": false
                        }
                    ]
                });
                const expected = [{"productQty": 10, "retailerId": 1, "retailerName": "Retailer NSW"}];
                expect(vm.getProductOrdersByRetailer(foundProductCode)).toEqual(expected);
            });
        });

        describe('getRetailerWithMaxOrdersForProduct method', () => {
            it('shouod call getProductOrdersByRetailer method', () => {
                const stub = jest.fn(() => {return []});
                wrapper.setMethods({ getProductOrdersByRetailer: stub });
                vm.getRetailerWithMaxOrdersForProduct(foundProductCode);
                expect(stub).toBeCalled();
            })

            it('should return array comntaining retailer with most orders for given product', () => {
                const productOrders = [
                    {"productQty": 10, "retailerId": 1, "retailerName": "Retailer NSW"},
                    {"productQty": 5, "retailerId": 2, "retailerName": "Retailer VIC"}
                ];
                const expected = "Retailer NSW";
                const stub = jest.fn(() => {return productOrders});
                wrapper.setMethods({ getProductOrdersByRetailer: stub });
                expect(vm.getRetailerWithMaxOrdersForProduct(foundProductCode)).toEqual(expected);

            })
        })

    })

    describe ('Question: What is the total order amount, grouped by **region**?', () => {
        let wrapper, vm;
        beforeEach(() => {
            wrapper = shallowMount(AppView, {})
            vm = wrapper.vm
            wrapper.setData({
                ordersNsw: [
                    {
                        "orderId": 1,
                        "items": [
                            {
                            "productCode": "P10142837",
                            "productDescription": "KLEENEX TOILET PAPER 9PK (PALLET) X 160",
                            "orderedQuantity": 3,
                            "itemPriceExGst": 10
                            },
                            {
                            "productCode": "P10000052",
                            "productDescription": "AUTUMN FIELDS PEARS IN JUICE 4X125G X 12",
                            "orderedQuantity": 2,
                            "itemPriceExGst": 10
                            }
                        ]
                    },
                    {
                        "orderId": 2,
                        "items": [
                            {
                            "productCode": "P10142837",
                            "productDescription": "KLEENEX TOILET PAPER 9PK (PALLET) X 160",
                            "orderedQuantity": 1,
                            "itemPriceExGst": 50
                            }
                        ]
                    }
                ],
                ordersVic: [
                    {
                        "orderId": 3,
                        "items": [
                            {
                            "productCode": "P10142837",
                            "productDescription": "KLEENEX TOILET PAPER 9PK (PALLET) X 160",
                            "orderedQuantity": 2,
                            "itemPriceExGst": 25
                            }
                        ]
                    }
                ]
            });
        })
        
        it('orderTotals method should return array of all regions and their spend', () => {
            let expected = [
                {
                    'regionName': 'VIC',
                    'totalSpend': 50
                },
                {
                    'regionName': 'NSW',
                    'totalSpend': 100
                }
            ];
            expect(vm.orderTotals()).toEqual(expected);
        });
    })

})
