import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import ProductCards from '../shop/ProductCards';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const decodedCategory = decodeURIComponent(categoryName).trim();

    // Fetch all products
    const { data, error, isLoading } = useFetchAllProductsQuery({
        page: 1,
        limit: 100,
    });

    // Debugging API Response
    useEffect(() => {
        console.log("🔗 URL Category:", categoryName);
        console.log("🛠 Decoded Category:", decodedCategory);
        console.log("🚀 Full API Response:", data);  
        console.log("📌 All Products:", data?.products || []);
    }, [data, categoryName]);

    // Ensure products array exists
    const products = data?.products || [];

    // Filter products by category
    const filteredProducts = useMemo(() => {
        if (!decodedCategory || !products.length) return [];
        return products.filter((product) => 
            product.category?.trim() === decodedCategory
        );
    }, [decodedCategory, products]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <>
            <section className="section__container bg-primary-light">
                <h2 className="section__header capitalize">{decodedCategory}</h2>
                <p className="section__subheader">
                    Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!
                </p>
            </section>

            <div className="section__container">
                {filteredProducts.length > 0 ? (
                    <ProductCards products={filteredProducts} />
                ) : (
                    <p>No products found in this category.</p>
                )}
            </div>
        </>
    );
};

export default CategoryPage;
