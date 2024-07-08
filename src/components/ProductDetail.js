import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDetail.css';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ product }) => {
    const [skus, setSkus] = useState(product.skus);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStockAndPrice = async () => {
            const updatedSkus = await Promise.all(
                product.skus.map(async (sku) => {
                    const response = await axios.get(`http://localhost:5000/api/stock-price/${sku.code}`);
                    return { ...sku, stock: response.data.stock, price: (response.data.price / 100).toFixed(2) };
                })
            );
            setSkus(updatedSkus);
            console.log("Stock and price fetched.")
        };

        fetchStockAndPrice();
        const intervalId = setInterval(fetchStockAndPrice, 5000);

        return () => clearInterval(intervalId);
    }, [product.skus]);

    return (
        <div className="product-detail">
            <div className="detail-header">
                <button className="back-button" onClick={() => navigate("/")}>←</button>
                <h1>Detail</h1>
                <button className="menu-button">⋮</button>
            </div>
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
                <div className="product-header">
                    <div className="product-name">{product.brand}</div>
                    <div className="product-price">${skus[0].price}</div>
                </div>
                <div className="sku-info">
                    <span>Origin: {product.origin}</span>
                    <span>Stock: {skus[0].stock}</span>
                </div>
                <p className="product-description">
                    {product.information}
                </p>
                <div className="product-size">
                    <h3>Size</h3>
                    {skus.map(sku => (
                        <button key={sku.code} className="size-button">
                            {sku.name}
                        </button>
                    ))}
                </div>
                <button className="add-to-cart-button">Add to cart</button>
            </div>
        </div>
    );
};

export default ProductDetail;
