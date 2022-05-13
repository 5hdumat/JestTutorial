const Product = require('../models/Product');

exports.createProduct = (req, res, next) => {
    Product.create(req.body);
    console.log(req.body)
};
