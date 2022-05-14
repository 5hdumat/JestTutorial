const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
    try {
        const createdProduct = await Product.create(req.body);
        res.status(201).json(createdProduct);
    } catch (err) {
        next(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).send();
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
            new: true,
        });

        if (!product) {
            return res.status(404).send();
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);

        if (!deletedProduct) {
            return res.status(404).send();
        }

        res.status(200).json(deletedProduct);
    } catch (err) {
        next(err);
    }
};
