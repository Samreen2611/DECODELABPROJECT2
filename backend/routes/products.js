const express = require('express');
const router = express.Router();

// In-memory data
let products = [
  { id: 1, name: 'Black Abaya', price: 2500, category: 'abaya' },
  { id: 2, name: 'Floral Co-ord Set', price: 3200, category: 'coord' },
  { id: 3, name: 'Shalwar Kameez', price: 1800, category: 'shalwar' },
];

let orders = [];

// ── GET — sare products ──
router.get('/products', (req, res) => {
  res.json({ success: true, data: products });
});

// ── GET — single product by id ──
router.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// ── POST — naya product add ──
router.post('/products', (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Name, price aur category required hain'
    });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price valid number hona chahiye'
    });
  }

  const newProduct = { id: products.length + 1, name, price, category };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// ── POST — order submit ──
router.post('/orders', (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Name aur phone required hain'
    });
  }

  const order = {
    id: Date.now(),
    name,
    phone,
    message: message || '',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  console.log("New Order Received:", order);

  res.status(201).json({ success: true, data: order });
});

// ── GET — sare orders dekho ──
router.get('/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

module.exports = router;