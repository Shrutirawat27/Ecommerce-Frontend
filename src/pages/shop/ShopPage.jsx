import React, { useState, useCallback, useMemo } from 'react';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import Loader from '/src/components/Loader'; // ✅ IMPORT LOADER
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const filters = {
  categories: ['all', 'accessories', 'dresses', 'footwears', 'cosmetics'],
  colors: [
    'all', 'black', 'red', 'gold', 'blue', 'silver', 'beige',
    'green', 'pink', 'orange', 'yellow', 'brown', 'white',
    'purple', 'gray'
  ],
  priceRange: [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50-$100', min: 50, max: 100 },
    { label: '$100-$200', min: 100, max: 200 },
    { label: '$200 and above', min: 200, max: Infinity },
  ],
};

const ShopPage = () => {
  const [filtersState, setFiltersState] = useState({
    category: 'all',
    color: 'all',
    priceRange: '0-Infinity',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

  const queryParams = useMemo(() => {
    const { category, color, priceRange } = filtersState;
    let minPrice = 0;
    let maxPrice = Infinity;

    if (priceRange) {
      const [min, max] = priceRange.split('-');
      minPrice = Number(min);
      maxPrice = max === 'Infinity' ? Infinity : Number(max);
    }

    return {
      category,
      color,
      minPrice,
      maxPrice,
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
    };
  }, [filtersState, currentPage]);

  const { data = {}, error, isLoading } =
    useFetchAllProductsQuery(queryParams);

  const { products = [], totalPages = 1, totalProducts = 0 } = data;

  const handlePageChange = useCallback(
    (page) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const clearFilters = useCallback(() => {
    setFiltersState({
      category: 'all',
      color: 'all',
      priceRange: '0-Infinity',
    });
    setCurrentPage(1);
  }, []);

  const startProduct =
    products.length > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;

  const endProduct =
    products.length > 0 ? startProduct + products.length - 1 : 0;

  return (
    <>
      {/* Header */}
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">Shop Page</h2>
        <p className="section__subheader">
          Discover the Hottest Picks: Elevate your Style with our wonderful collection of Trending Products.
        </p>
      </section>

      <section className="section__container">
        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          
          {/* Filters */}
          <ShopFiltering
            filters={filters}
            filtersState={filtersState}
            setFiltersState={setFiltersState}
            clearFilters={clearFilters}
          />

          {/* Products Area */}
          <div className="flex-1">
            {isLoading ? (
              <Loader />   // ✅ LOADER HERE
            ) : error ? (
              <div className="text-red-500 text-center">
                Error loading products
              </div>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-4">
                  Showing {startProduct} to {endProduct} of {totalProducts} products
                </h3>

                <ProductCards products={products} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="pagination flex flex-wrap justify-center gap-2 mt-4">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="pagination-btn !bg-primary !text-white px-4 py-2 rounded"
            >
              Previous
            </button>
          )}

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-btn px-4 py-2 rounded ${
                  currentPage === page
                    ? '!bg-primary !text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            );
          })}

          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="pagination-btn !bg-primary !text-white px-4 py-2 rounded"
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
