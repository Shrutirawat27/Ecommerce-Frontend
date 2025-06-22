import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const filters = {
    categories: ['all', 'accessories', 'dress', 'footwear', 'cosmetics'],
    colors: ['all', 'black', 'red', 'gold', 'blue', 'silver', 'beige', 'green'],
    priceRange: [
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50-$100', min: 50, max: 100 },
        { label: '$100-$200', min: 100, max: 200 },
        { label: '$200 and above', min: 200, max: Infinity },
    ],
};

const ShopPage = () => {
    const [filtersState, setFiltersState] = useState({
        category: "all",
        color: "all",
        priceRange: { min: 0, max: Infinity }, // Default price range
    });

    const [currentPage, setCurrentPage] = useState(1);
    const ProductsPerPage = 8;

    const queryParams = useMemo(() => {
        const { category, color, priceRange } = filtersState;
        return {
            category,
            color,
            ...(priceRange?.min !== undefined && { minPrice: priceRange.min }),
            ...(priceRange?.max !== undefined && { maxPrice: priceRange.max }),
            page: currentPage,
            limit: ProductsPerPage,
        };
    }, [filtersState, currentPage]);

    const { data = {}, error, isLoading } = useFetchAllProductsQuery(queryParams);
    const { products = [], totalPages = 1, totalProducts = 0 } = data || {};

    useEffect(() => {
        console.log("🛍️ Fetched Products:", products);
    }, [products]);

    const handlePageChange = useCallback((pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    }, [totalPages]);

    const clearFilters = useCallback(() => {
        setFiltersState({
            category: "all",
            color: "all",
            priceRange: { min: 0, max: Infinity },
        });
        setCurrentPage(1); // Reset to first page after clearing filters
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    const startProduct = products.length > 0 ? (currentPage - 1) * ProductsPerPage + 1 : 0;
    const endProduct = products.length > 0 ? startProduct + products.length - 1 : 0;

    return (
        <>
            <section className="section__container bg-primary-light">
                <h2 className="section__header capitalize">Shop Page</h2>
                <p className="section__subheader">
                    Discover the Hottest Picks: Elevate your Style with our wonderful collection of Trending Products.
                </p>
            </section>

            <section className="section__container">
                <div className="flex flex-col md:flex-row md:gap-12 gap-8">
                    {/* Left Side - Filters */}
                    <ShopFiltering 
                        filters={filters} 
                        filtersState={filtersState} 
                        setFiltersState={setFiltersState} 
                        clearFilters={clearFilters} 
                    />

                    {/* Right Side - Products */}
                    <div>
                        <h3 className="text-xl font-medium mb-4">
                            Showing {startProduct} to {endProduct} of {totalProducts} products
                        </h3>
                        <ProductCards products={products} />
                    </div>
                </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination flex justify-center gap-2 mt-4">
                    {currentPage > 1 && (
                        <button 
                            className="pagination-btn bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition" 
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                    )}
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`pagination-btn px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-black hover:bg-gray-300'} transition`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    {currentPage < totalPages && (
                        <button 
                            className="pagination-btn bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition" 
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default ShopPage;
