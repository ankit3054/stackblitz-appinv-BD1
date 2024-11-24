const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const taxRate = 5;
const discountPercentage = 10;
const loyalityRate = 2;

const standardAvgDistace = 50;
const expressAvgDistace = 100;

function calculateFinalTotal(newItemPrice, cartTotal) {
  return (newItemPrice + cartTotal).toString();
}

function applyDiscountAndSendFinalAmount(cartTotal) {
  return (cartTotal * ((100 - discountPercentage) / 100)).toString();
}

function calculateTax(cartTotal) {
  return (cartTotal + cartTotal * (taxRate / 100)).toString();
}

function calculateEstimatedTimeForDelivery(distance, shippingMethod) {
  if (shippingMethod == 'standard') {
    return (distance / standardAvgDistace).toString();
  } else if (shippingMethod == 'express') {
    return (distance / expressAvgDistace).toString();
  } else {
    return 'Invalid shipping method';
  }
}

function calculateShippingCost(distance, weight) {
  return (weight * (distance * 0.1)).toString();
}

function calculateLoyalityPoints(purchaseAmount) {
  return (purchaseAmount * loyalityRate).toString();
}

// ------------------- ROUTES ------------------------

// /cart-total?newItemPrice=1200&cartTotal=0
app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateFinalTotal(newItemPrice, cartTotal));
});

// /membership-discount?cartTotal=3600&isMember=true
app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  let finalTotal =
    isMember == 'true' ? applyDiscountAndSendFinalAmount(cartTotal) : cartTotal;
  res.send(finalTotal);
});

// /calculate-tax?cartTotal=3600
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTax(cartTotal));
});

// /estimate-delivery?shippingMethod=express&distance=600
app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod.trim();
  let distance = parseFloat(req.query.distance);
  res.send(
    calculateEstimatedTimeForDelivery(
      distance,
      String(shippingMethod).toLocaleLowerCase()
    )
  );
});

// /shipping-cost?weight=2&distance=600
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(calculateShippingCost(distance, weight));
});

// /loyalty-points?purchaseAmount=3600
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(calculateLoyalityPoints(purchaseAmount));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
