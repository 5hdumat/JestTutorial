const productController = require('../../controllers/products');
const Product = require('../../models/Product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');
const { Promise } = require('mongoose');

Product.create = jest.fn();
Product.find = jest.fn();
Product.findById = jest.fn();
Product.findByIdAndUpdate = jest.fn();
Product.findByIdAndDelete = jest.fn();

let productId = '627fa6c142140df4c351435d';
let req, res, next;

// 모든 테스트 케이스에 적용
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('Product Controller Post.', () => {
    beforeEach(() => {
        req.body = newProduct;
    });

    it('should have a createProduct function.', () => {
        expect(typeof productController.createProduct).toBe('function');
    });

    it('should call productModel.create', () => {
        productController.createProduct(req, res, next);
        expect(Product.create).toBeCalledWith(newProduct);
        expect(Product.create).toBeCalledTimes(1);
    });

    it('should return 201 response code and send.', async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return json body in response.', async () => {
        Product.create.mockReturnValue(newProduct);
        await productController.createProduct(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    it('should handle err', async () => {
        const errMessage = { message: 'description property missing' };
        const rejectedPromise = Promise.reject(errMessage);
        Product.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        expect(next).toBeCalledWith(errMessage);
    });
});

describe('Product Controller Get.', () => {
    it('should have a getProduct function', () => {
        expect(typeof productController.getProducts).toBe('function');
    });

    it('should call Product.find()', async () => {
        await productController.getProducts(req, res, next);
        expect(Product.find).toBeCalledWith();
        expect(Product.find).toBeCalledTimes(1);
    });

    it('should return 200 response', async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
    });

    it('should return json body in response', async () => {
        Product.find.mockReturnValue(allProducts);

        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    });

    it('should handle errs', async () => {
        const errMessage = { message: 'err finding product data.' };
        const rejectedPromise = Promise.reject(errMessage);
        Product.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toBeCalledWith(errMessage);
    });
});

describe('Product Controller GetById', () => {
    it('should have a getProductById', () => {
        expect(typeof productController.getProductById).toBe('function');
    });

    it('should call Product.findOne', async () => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(Product.findById).toBeCalledWith(productId);
    });

    it('should return json body and response code 200', async () => {
        Product.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    it('should return 404 when item doesnt exist', async () => {
        Product.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errs', async () => {
        const errMessage = { message: 'err' };
        const rejectedPromise = Promise.reject(errMessage);
        Product.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toBeCalledWith(errMessage);
    });
});

describe('Product Controller update', () => {
    it('should have an updateProduct function', () => {
        expect(typeof productController.updateProduct).toBe('function');
    });

    it('should call Product.findByIdAndUpdate', async () => {
        req.params.productId = productId;
        req.body = {
            name: 'updateGloves',
        };

        await productController.updateProduct(req, res, next);
        expect(Product.findByIdAndUpdate).toBeCalledWith(
            productId,
            { name: 'updateGloves' },
            { new: true },
        );
    });

    it('should return json body and response code 200', async () => {
        req.params.productId = productId;
        req.body = {
            name: 'updateGlove',
        };

        const updatedProduct = {
            _id: '627fa6c142140df4c351435d',
            name: 'updateGlove',
            description: 'good to wear.',
            price: 15,
            __v: 0,
        };

        Product.findByIdAndUpdate.mockReturnValue(updatedProduct);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
    });

    it('should return 404 when item doesnt exist', async () => {
        Product.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errs', async () => {
        const errMessage = { message: 'err' };
        const rejectPromise = Promise.reject(errMessage);
        Product.findByIdAndUpdate.mockReturnValue(rejectPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toBeCalledWith(errMessage);
    });
});

describe('Product Controller delete', () => {
    it('should have a deleteProduct function.', () => {
        expect(typeof productController.deleteProduct).toBe('function');
    });

    it('should call Product.findByIdAndDelete.', async () => {
        req.params.productId = productId;
        await productController.deleteProduct(req, res, next);
        expect(Product.findByIdAndDelete).toBeCalledWith(productId);
    });

    it('should return 200 response', async () => {
        let deleteProduct = {
            name: 'deletedProduct',
            description: 'deletedProduct',
        };

        req.params.productId = productId;
        Product.findByIdAndDelete.mockReturnValue(deleteProduct);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(deleteProduct);
    });

    it('should handle 404 when item doesnt exist', async () => {
        Product.findByIdAndDelete.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'error deleting.' };
        const rejectedPromise = Promise.reject(errorMessage);
        Product.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});
