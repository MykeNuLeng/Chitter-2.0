const express = require('express');
const app = express(); 
const connectDB = require('./config/db')

// Connect DB
connectDB();

app.get('/',  (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Sever running on port: ${PORT}`));