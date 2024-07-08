import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BeerList from './components/BeerList';
import ProductDetailWrapper from './components/ProductDetailWrapper';
import axios from 'axios';

const App = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/beers');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<BeerList products={products} />} />
                <Route path="/:idBrand" element={<ProductDetailWrapper products={products} />} />
            </Routes>
        </Router>
    );
};

export default App;
