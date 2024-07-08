import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductDetail from './ProductDetail';

const ProductDetailWrapper = ({ products }) => {
    const { idBrand } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const [id, brand] = idBrand.split('-');
        const productId = parseInt(id, 10);
        let foundProduct = products.find((p) => p.id === productId);

        if (!foundProduct) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/beers');
                    const allProducts = response.data;
                    foundProduct = allProducts.find((p) => p.id === productId);
                    setProduct(foundProduct);
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };
            fetchProduct();
        } else {
            setProduct(foundProduct);
        }
    }, [idBrand, products]);

    return product ? <ProductDetail product={product} /> : <div>Loading...</div>;
};

export default ProductDetailWrapper;
