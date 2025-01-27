
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/orders', (req, res) => {
    fs.readFile('orders.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading orders');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/orders', (req, res) => {
    const newOrder = req.body;
    fs.readFile('orders.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading orders');
        } else {
            const orders = JSON.parse(data);
            orders.push(newOrder);
            fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
                if (err) {
                    res.status(500).send('Error saving orders');
                } else {
                    res.status(200).send('Order added successfully');
                }
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
