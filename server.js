const express = require('express');

const app = express();
const routes = require('./routes');
const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://admin:RNAMybeYyVyZM3Am@mongodbtutorial.l6x2w.mongodb.net/tddApp')
    .then(() => {
        console.log('MongoDb Connected...');
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());

// Routes
app.use('/', routes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

module.exports = app;
