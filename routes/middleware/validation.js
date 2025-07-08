const ValidationError = require('../errors/ValidationError');

exports.validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price == null || !category || inStock == null) {
    return next(new ValidationError('Missing required fields'));
  }
  next();
};
