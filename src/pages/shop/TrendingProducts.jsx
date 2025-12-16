import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCards from './ProductCards';
import Loader from '/src/components/Loader'; // ✅ import loader
import { getBaseUrl } from "../../utils/baseURL";

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${getBaseUrl()}/api/products`);
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false); // ✅ stop loader
            }
        };

        fetchProducts();
    }, []);

    const loadMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4);
    };

    const handleProductClick = (productId) => {
        navigate(`/shop/${productId}`);
    };

    // ✅ Show loader while loading
    if (loading) {
        return <Loader />;
    }

    return (
        <section className="section__container product__container">
            <h2 className="section__header">Trending Products</h2>
            <p className="section__subheader mb-12">
                Discover the Hottest Picks: Elevate Your Style with our wonderful collection of Trending Products.
            </p>

            <div className="mt-12">
                <ProductCards 
                    products={products.slice(0, visibleProducts)} 
                    onProductClick={handleProductClick} 
                />
            </div>

            <div className="product__btn">
                {visibleProducts < products.length && (
                    <button className="btn" onClick={loadMoreProducts}>
                        Load More
                    </button>
                )}
            </div>
        </section>
    );
};

export default TrendingProducts;
