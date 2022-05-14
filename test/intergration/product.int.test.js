const request = require('supertest');
const app = require('../../server');
const newProduct = require('../data/new-product.json');

let productId = '627fa70bf011436fc2ece250';
let firstProduct;

it('POST /api/products', async () => {
    const response = await request(app).post('/api/products').send(newProduct);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.description).toBe(newProduct.description);
});

it('should return 500 on POST /api/products', async () => {
    const response = await request(app).post('/api/products').send({ name: 'phone' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
        message: 'Product validation failed: description: Path `description` is required.',
    });
});

it('GET /api/products', async () => {
    const response = await request(app).get('/api/products');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    firstProduct = response.body[0];
});

it('GET /api/product/:productId', async () => {
    const response = await request(app).get(`/api/products/${firstProduct._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(firstProduct.name);
    expect(response.body.description).toBe(firstProduct.description);
});

it('should return 404 on GET /api/product/:productId', async () => {
    const response = await request(app).get(`/api/products/627fa6e1ea17e3cb10d7565c`);
    expect(response.statusCode).toBe(404);
});

it('PUT /api/products/:productId', async () => {
    const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({ name: 'updatedGloves' });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('updatedGloves');
});

it('should return 404 on PUT /api/products', async () => {
    const response = await request(app)
        .put(`/api/products/627fa6e1ea17e3cb10d7565c`)
        .send({ name: 'updatedGloves' });

    expect(response.statusCode).toBe(404);
});

it('should DELETE /api/products/:productId', async () => {
    const res = await request(app).delete(`/api/products/${productId}`).send();
    expect(res.statusCode).toBe(200);
});

it('should return 404 on DELETE /api/products/:productId', async () => {
    const res = await request(app).delete(`/api/products/627fa6e1ea17e3cb10d7565c`).send();
    expect(res.statusCode).toBe(404);
});
