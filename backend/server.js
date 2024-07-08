require('@babel/register')({
    presets: ['@babel/preset-env'],
  });
  
  const express = require('express');
  const path = require('path');
  const cors = require('cors');
  const app = express();
  const port = 5000;
  
  app.use(cors());
  app.use(express.json());
  
  app.use(express.static(path.join(__dirname, '../build')));
  
  const products = require('./products');
  const stockPrices = require('./stock-price');
  
  app.get('/api/beers', (req, res) => {
    res.json(products);
  });
  
  app.get('/api/stock-price/:code', (req, res) => {
    const code = Number(req.params.code);
    const stockPrice = stockPrices[code];
    if (stockPrice) {
      res.json(stockPrice);
    } else {
      res.status(404).json({ error: 'SKU not found' });
    }
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  