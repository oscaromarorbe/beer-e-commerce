import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BeerList.css';

const BeerList = ({ products }) => {
    const [beers, setBeers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStockPrices = async () => {
            try {
                const updatedBeers = await Promise.all(products.map(async (beer) => {
                    const updatedSkus = await Promise.all(beer.skus.map(async (sku) => {
                        const stockResponse = await axios.get(`http://localhost:5000/api/stock-price/${sku.code}`);
                        return {
                            ...sku,
                            stock: stockResponse.data.stock,
                            price: (stockResponse.data.price / 100).toFixed(2),
                        };
                    }));
                    return { ...beer, skus: updatedSkus };
                }));
                setBeers(updatedBeers);
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        };

        fetchStockPrices();
    }, [products]);

    const handleClick = (beer) => {
        const path = `${beer.id}-${beer.brand.replace(/\s+/g, '').toLowerCase()}`;
        navigate(`/${path}`);
    };

    return (
        <div className="container">
            <header className="header">
                <div className="menu-icon">☰</div>
                <div className="user-info">
                    <img src="/icons/user-icon.jpg" alt="User" className="user-image" />
                    <div>
                        <span>Hi Mr. Michael,</span>
                        <h1>Welcome Back!</h1>
                    </div>
                </div>
            </header>
            <div className="search-bar">
                <input type="text" placeholder="Search burger, pizza, drink or etc..." />
            </div>
            <div className="category-section">
                <h2>Drink Category</h2>
                <div className="categories">
                    <button className="category active">
                        <img src="/icons/Beer.png" alt="Beer" />
                        Beer
                    </button>
                    <button className="category">
                        <img src="/icons/Wine-glass.png" alt="Wine" />
                        Wine
                    </button>
                </div>
                <button className="see-all">See All</button>
            </div>
            <div className="popular-section">
                <h2>Popular</h2>
                <button className="see-all">See All</button>
                <div className="beer-list">
                    {beers.map(beer => (
                        <div key={beer.id} className="beer-item" onClick={() => handleClick(beer)}>
                            <img src={beer.image} alt={beer.name} className="beer-image" />
                            <h3>{beer.name}</h3>
                            <div className="beer-price">${beer.skus[0].price}</div>
                            <button className="add-button">+</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BeerList;
