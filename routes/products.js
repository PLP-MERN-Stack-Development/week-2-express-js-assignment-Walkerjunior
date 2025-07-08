const express = require('express');
const { v4: uuidv4 } = require('uuid');
const products = require('../data/products');
const { validateProduct } = require('../middleware/validation');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();

// GET all
router.get('/', (req, res) => {
  const { category, page = 1, limit = 5 } = req.query;
  let results = [...products];

  if (category) {
    results = results.filter(p => p.category === category);
  }

  const start = (page - 1) * limit;
  const end = start + +limit;

  res.json(results.slice(start, end));
});

// GET by ID
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
});

// POST new
router.post('/', validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update
router.put('/:id', validateProduct, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE
router.delete('/:id', (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
});

// SEARCH
router.get('/search/name', (req, res) => {
  const query = req.query.q?.toLowerCase();
  const matches = products.filter(p => p.name.toLowerCase().includes(query));
  res.json(matches);
});

// STATS
router.get('/stats/category', (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
});

module.exports = router;
