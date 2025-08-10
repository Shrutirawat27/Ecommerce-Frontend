import React, { useState, useEffect } from 'react';

const FiltersContent = ({ filters, filtersState, setFiltersState, clearFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFiltersState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-5 flex-shrink-0 p-4 bg-white border rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      {/* Category Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-lg">Category</h4>
        <hr />
        {filters.categories.map((category) => {
          const id = `category-${category}`;
          return (
            <div key={id} className="capitalize cursor-pointer flex items-center">
              <input
                id={id}
                type="radio"
                name="category"
                value={category}
                checked={filtersState.category === category}
                onChange={handleFilterChange}
                className="mr-2"
                style={{ accentColor: '#2563eb' }}
              />
              <label htmlFor={id} className="select-none">{category}</label>
            </div>
          );
        })}
      </div>

      {/* Color Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-lg">Color</h4>
        <hr />
        {filters.colors.map((color) => {
          const id = `color-${color}`;
          return (
            <div key={id} className="capitalize cursor-pointer flex items-center">
              <input
                id={id}
                type="radio"
                name="color"
                value={color}
                checked={filtersState.color === color}
                onChange={handleFilterChange}
                className="mr-2"
                style={{ accentColor: '#2563eb' }}
              />
              <label htmlFor={id} className="select-none">{color}</label>
            </div>
          );
        })}
      </div>

      {/* Price Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-lg">Price Range</h4>
        {filters.priceRange.map((range) => {
          const id = `priceRange-${range.min}-${range.max}`;
          return (
            <div key={id} className="capitalize cursor-pointer flex items-center">
              <input
                id={id}
                type="radio"
                name="priceRange"
                value={`${range.min}-${range.max}`}
                checked={filtersState.priceRange === `${range.min}-${range.max}`}
                onChange={handleFilterChange}
                className="mr-2"
                style={{ accentColor: '#2563eb' }}
              />
              <label htmlFor={id} className="select-none">{range.label}</label>
            </div>
          );
        })}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="bg-primary text-white py-2 px-6 rounded mt-6 block w-full"
      >
        Clear All Filters
      </button>
    </div>
  );
};

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showMobileFilters ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileFilters]);

  return (
    <>
      {/* Mobile Filters Button */}
      <div className="md:hidden p-4 bg-white shadow sticky top-0 z-50 flex justify-center">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-primary text-white px-6 py-2 rounded font-semibold"
          aria-label="Open filters"
        >
          Filters
        </button>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          onClick={() => setShowMobileFilters(false)}
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="bg-white w-3/4 max-w-xs overflow-auto h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-red-600 font-bold text-2xl leading-none"
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>

            <FiltersContent
              filters={filters}
              filtersState={filtersState}
              setFiltersState={setFiltersState}
              clearFilters={() => {
                clearFilters();
                setShowMobileFilters(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Desktop Filters (hidden on mobile with tailwind) */}
      <div className="hidden md:block">
        <FiltersContent
          filters={filters}
          filtersState={filtersState}
          setFiltersState={setFiltersState}
          clearFilters={clearFilters}
        />
      </div>
    </>
  );
};

export default ShopFiltering;
