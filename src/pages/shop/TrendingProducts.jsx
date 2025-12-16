import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCards from './ProductCards';
import Loader from '/src/components/Loader';
import { getBaseUrl } from '../../utils/baseURL';

const TrendingProducts = () => {
  const navigate = useNavigate();
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialCount = window.innerWidth < 640 ? 4 : 8;
    setVisibleProducts(initialCount);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${getBaseUrl()}/api/products`);
        const data = await response.json();
        setProducts(data?.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 4);
  };

  if (loading) {
    return (
      <section className="section__container flex justify-center py-16">
        <Loader />
      </section>
    );
  }

  return (
    <section className="section__container product__container">
      <h2 className="section__header">Trending Products</h2>
      <p className="section__subheader mb-8">
        Discover the Hottest Picks: Elevate Your Style with our wonderful collection.
      </p>

      <ProductCards products={products.slice(0, visibleProducts)} />

      {visibleProducts < products.length && (
        <div className="flex justify-center mt-8">
          <button className="btn" onClick={loadMoreProducts}>
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default TrendingProducts;