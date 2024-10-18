const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'renzo', // replace with your MySQL password
    database: 'item_management'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Create item
app.post('/items', (req, res) => {
    const { name, price, description, image_url } = req.body;
    // Validar que la información sea correcta
    const sql = 'INSERT INTO items (name, price, description, image_url) VALUES (?, ?, ?, ?)';

    db.query(sql, [name, price, description, image_url], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, name, price, description, image_url });
    });
});

// Get all items
app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM items';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Get a single item by ID
app.get('/items/:id', (req, res) => {
    const sql = 'SELECT * FROM items WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(results[0]);
    });
});

// Update an item
app.put('/items/:id', (req, res) => {
    const { name, price, description, image_url } = req.body;
    const sql = 'UPDATE items SET name = ?, price = ?, description = ?, image_url = ? WHERE id = ?';

    db.query(sql, [name, price, description, image_url, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully' });
    });
});

// Delete an item
app.delete('/items/:id', (req, res) => {
    const sql = 'DELETE FROM items WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

