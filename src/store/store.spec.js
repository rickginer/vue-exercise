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

    it('allOrders should combine all orders for a particular product and group by retailer', () => {
        store.replaceState({
            ordersNsw: [
                {"orderId": 1}
            ],
            ordersVic: [
                {"orderId": 2}
            ]
        })
        const expected = [
            {"orderId": 1},
            {"orderId": 2}
        ]
        expect(store.getters.allOrders).toEqual(expected);
    });
    
    describe('Which **active** retailer ordered the greatest quantity of *Gladiator Snack Bags*?', () => {

        const foundProductCode = 'same';
        const stubRetailers = [
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
        ];
        const stubOrdersNsw = [
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
        ];

        describe('getProductOrdersByRetailer', () => {
           
            beforeEach(() => {
                store.replaceState({
                    retailers: stubRetailers,
                    ordersVic: [],
                    ordersNsw: stubOrdersNsw
                });
            })

            it('should combine all orders for a particular product and group by retailer', () => {
                const expected = [
                    {"productQty": 10, "retailerId": 1, "retailerName": "Retailer NSW"},
                    {"productQty": 5, "retailerId": 2, "retailerName": "Retailer VIC"}]
                expect(store.getters.getProductOrdersByRetailer(foundProductCode)).toEqual(expected);
            });

            it('should return empty array if product ID not found', () => {
                expect(store.getters.getProductOrdersByRetailer('notFound')).toEqual([]);
            });
        });

        // TODO not sure how best to mock the dependency on other getter methos
        xdescribe('getRetailerWithMaxOrdersForProduct method', () => {
            it('should return array comntaining retailer with most orders for given product', () => {

                // mock getters
                // const _getters = {
                //     getProductOrdersByRetailer: () => {
                //         return [
                //             {"productQty": 10, "retailerId": 1, "retailerName": "Retailer NSW"},
                //             {"productQty": 5, "retailerId": 2, "retailerName": "Retailer VIC"}
                //         ];
                //     }
                // }
                const expected = "Retailer NSW"
                expect(store.getters.getRetailerWithMaxOrdersForProduct(productCode)).toEqual(expected)

            })
        })
    })

    describe('hasNoOrder method', () => {

        beforeEach(() => {
            store.replaceState({
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
            expect(store.getters.hasNoOrder('VIC')).toEqual(expected);
        })

    })

    describe('orderTotals', () => {
        it(' should return array of all regions and their spend', () => {
            store.replaceState({
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
            expect(store.getters.orderTotals()).toEqual(expected);
        });
    })

    describe('oldestOrders', () => {
        beforeEach(() => {
            store.replaceState({
                ordersNsw: [
                    {
                        "orderId": 1,
                        "orderDate": "2019-01-15",
                        "retailerId": 1,
                    },
                    {
                        "orderId": 2,
                        "orderDate": "2019-01-14",
                        "retailerId": 2,
                    },
                    {
                        "orderId": 3,
                        "orderDate": "2019-01-16",
                        "retailerId": 1,
                    }
                ],
                ordersVic: [],
                retailers: [                    
                    {
                        "retailerId": 1,
                        "name": "Retailer 1"
                    },
                    {
                        "retailerId": 2,
                        "name": "Retailer 2"
                    }
                ]
            });
        })
        it('should return oldest order object', () => {
            expect(store.getters.oldestOrders[0].orderId).toEqual(2)
        })
        it('should have added retailers name to object', () => {
            expect(store.getters.oldestOrders[0].retailerName).toEqual('Retailer 2')
        })
    })

    describe('related to retrieving most sold products', () => {

        beforeEach(() => {
            store.replaceState({
                ordersNsw: [
                    {
                        "orderId": 1,
                        "items": [
                            {
                            "productCode": "product 1",
                            "orderedQuantity": 1
                            },
                            {
                            "productCode": "product 2",
                            "orderedQuantity": 2
                            }
                        ]
                    },
                    {
                        "orderId": 1,
                        "items": [
                            {
                            "productCode": "product 1",
                            "orderedQuantity": 1
                            },
                            {
                            "productCode": "product 2",
                            "orderedQuantity": 2
                            }
                        ]
                    }
                ],
                ordersVic: [],
                retailers: []
            })
        })

        describe('allProducts', () => {
            it('should return array containing a single entry for each product code and the quantity sold', () => {
                const expected = [{
                    "productCode": "product 1",
                    "totalOrdered": 2
                  },
                  {
                    "productCode": "product 2",
                    "totalOrdered": 4
                  }
                ]
                expect(store.getters.allProducts).toEqual(expected)
            });
        })

        describe('mostSoldProduct', () => {
            it('should call getters.allProducts', () => {
                // TODO mock allProducts
            })

            it('should return productCode of most sold product', () => {
                expect(store.getters.mostSoldProduct).toEqual('product 2') 
            })
        })
    })

    describe('biggestSpender', () => {
        // TODO add test to confirm mathis in spend calculation
        it('should return array containing IR of retailer who has spent the most', () => {
            store.replaceState({
                ordersNsw: [
                    {
                        "retailerId": 1,
                        "items": [
                            {
                            "orderedQuantity": 10,
                            "itemPriceExGst": 17.50
                            }
                        ]
                    },
                    {
                        "retailerId": 2,
                        "items": [
                            {
                            "orderedQuantity": 10,
                            "itemPriceExGst": 17.50
                            },
                            {
                            "orderedQuantity": 2,
                            "itemPriceExGst": 17.50
                            }
                        ]
                    },
                    {
                        "retailerId": 1,
                        "items": [
                            {
                            "orderedQuantity": 1,
                            "itemPriceExGst": 17.50
                            },
                            {
                            "orderedQuantity": 2,
                            "itemPriceExGst": 17.50
                            }
                        ]
                    }
                ],
                ordersVic: [],
                retailers: [
                    {
                        "retailerId": 1,
                        "name": 'retailer 1',
                        "active": true
                    },
                    {
                        "retailerId": 2,
                        "name": 'retailer 2',
                        "active": true
                    }
                ]
            })

            const expected = 'retailer 1';
            expect(store.getters.biggestSpender).toEqual(expected)

        })
    })

})
