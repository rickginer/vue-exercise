# irexchange Coding Exercise

Welcome to the irexchange coding test for Frontend engineers.

In this repository, you'll find a skeleton project to get you started. Feel free to modify it as much as you want.

## Project brief

As a member of the irexchange development team you've been tasked with capturing some insights on our customers and the orders that they have placed with us.

You've been provided with three JSON files:

 * [List of retailers](https://s3-ap-southeast-2.amazonaws.com/coding-exercise.irexchange.com/retailers.json)
 * [List of all orders in Victoria](https://s3-ap-southeast-2.amazonaws.com/coding-exercise.irexchange.com/vic/orders.json)
 * [List of all orders in NSW](https://s3-ap-southeast-2.amazonaws.com/coding-exercise.irexchange.com/nsw/orders.json)

Given these three files, the sales team has asked you to help them answer the following questions:

 1. How many **active** retailers do we have?
 1. Which store in the **VIC** region has never placed an order?
 1. Which **active** retailer ordered the greatest quantity of *Gladiator Snack Bags*?
 1. What is the total order amount, grouped by **region**?
 1. Which retailer has the oldest order?
 1. What is the highest selling product by total `orderedQuantity`?
 1. Given an orders' total is calculated as `(orderedQuantity * itemPriceExGst)` + 10% GST, which **active** store has ordered the most by order total

This should be built in a way, that if we were to change the content of one of the files, we would just need to refresh the page to get the new values above.

Use the provided skeleton **Vue** application to display each of the above questions and their calculated answers.

## Project setup
To setup the project simply
```
yarn install
```

### Running
To start a local webserver you can run from the project root:

```
yarn run serve
```