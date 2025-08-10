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
    category: 'all',
    color: 'all',
    priceRange: '0-Infinity',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ProductsPerPage = 8;

  const queryParams = useMemo(() => {
    const { category, color, priceRange } = filtersState;
    let minPrice = 0,
      maxPrice = Infinity;

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
      limit: ProductsPerPage,
    };
  }, [filtersState, currentPage]);

  const { data = {}, error, isLoading } = useFetchAllProductsQuery(queryParams);
  const { products = [], totalPages = 1, totalProducts = 0 } = data || {};

  const handlePageChange = useCallback(
    (pageNumber) => {
      if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
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
  <div className="pagination flex flex-wrap justify-center gap-2 mt-4">
    {currentPage > 1 && (
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        className="pagination-btn !bg-primary !text-white px-4 py-2 rounded hover:!bg-primary-dark transition min-w-[70px] select-none"
      >
        Previous
      </button>
    )}

    {[...Array(totalPages)].map((_, index) => {
      const page = index + 1;
      const isActive = currentPage === page;
      return (
        <button
          key={page}
          type="button"
          onClick={() => handlePageChange(page)}
          className={`pagination-btn px-4 py-2 rounded min-w-[48px] text-center select-none transition
            ${
              isActive
                ? '!bg-primary !text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }
          `}
        >
          {page}
        </button>
      );
    })}

    {currentPage < totalPages && (
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        className="pagination-btn !bg-primary !text-white px-4 py-2 rounded hover:!bg-primary-dark transition min-w-[70px] select-none"
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
