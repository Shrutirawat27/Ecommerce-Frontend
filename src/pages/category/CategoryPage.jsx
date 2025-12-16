import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import ProductCards from '../shop/ProductCards';
import Loader from '/src/components/Loader'; 

const CategoryPage = () => {
    const { categoryName } = useParams();
    const decodedCategory = decodeURIComponent(categoryName).trim();
    const { data, error, isLoading } = useFetchAllProductsQuery({
        page: 1,
        limit: 100,
    });

    useEffect(() => {
        // console.log("URL Category:", categoryName);
        // console.log("Decoded Category:", decodedCategory);
        // console.log("All Products:", data?.products || []);
    }, [data, categoryName]);

    const products = data?.products || [];

    const filteredProducts = useMemo(() => {
        if (!decodedCategory || !products.length) return [];
        return products.filter(
            (product) => product.category?.trim() === decodedCategory
        );
    }, [decodedCategory, products]);

    if (isLoading) {
        return (
            <section className="section__container flex justify-center py-16">
                <Loader />  
            </section>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 my-8">Error loading products</div>;
    }

    return (
        <>
            <section className="section__container bg-primary-light">
                <h2 className="section__header capitalize">{decodedCategory}</h2>
                <p className="section__subheader">
                    Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!
                </p>
            </section>

            <div className="section__container mt-8">
                {filteredProducts.length > 0 ? (
                    <ProductCards products={filteredProducts} />
                ) : (
                    <p className="text-center text-gray-600">No products found in this category.</p>
                )}
            </div>
        </>
    );
};

export default CategoryPage;