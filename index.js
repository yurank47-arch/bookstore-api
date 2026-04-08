const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json()); 

// Налаштування підключення до БД
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       
    password: '1234',
    database: 'bookstore',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. Отримати всі книги (GET)
app.get('/books', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM books');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Додати книгу (POST)
app.post('/books', async (req, res) => {
    const { title, price, author_id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO books (title, price, author_id) VALUES (?, ?, ?)', 
            [title, price, author_id]
        );
        res.status(201).json({ message: 'Книгу додано', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Оновити книгу (PUT)
app.put('/books/:id', async (req, res) => {
    const { title, price, author_id } = req.body;
    try {
        await pool.query(
            'UPDATE books SET title = ?, price = ?, author_id = ? WHERE book_id = ?', 
            [title, price, author_id, req.params.id]
        );
        res.json({ message: 'Книгу оновлено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Видалити книгу (DELETE)
app.delete('/books/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM books WHERE book_id = ?', [req.params.id]);
        res.json({ message: 'Книгу видалено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('REST API сервер запущено на порту 3000');
});