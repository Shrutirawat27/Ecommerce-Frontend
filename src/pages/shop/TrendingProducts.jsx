import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCards from './ProductCards';

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch products from the API (adjust the URL to match your backend)
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/products'); // Adjust the URL to your API endpoint
                const data = await response.json();
                setProducts(data.products); // Assuming the API returns products in { products: [...] }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const loadMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4);
    };

    // Handle product click by navigating to the product details page
    const handleProductClick = (productId) => {
        navigate(`/shop/${productId}`);
    };

    return (
        <section className="section__container product__container">
            <h2 className="section__header">Trending Products</h2>
            <p className="section__subheader mb-12">Discover the Hottest Picks: Elevate Your Style with our wonderful collection of Trending Products.</p>

            <div className="mt-12">
                <ProductCards 
                    products={products.slice(0, visibleProducts)} 
                    onProductClick={handleProductClick} 
                />
            </div>

            <div className="product__btn">
                {visibleProducts < products.length && (
                    <button className="btn" onClick={loadMoreProducts}>Load More</button>
                )}
            </div>
        </section>
    );
};

export default TrendingProducts;
