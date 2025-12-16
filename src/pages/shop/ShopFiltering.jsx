import React, { useCallback, useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FiltersContent = React.memo(
  ({ filters, filtersState, setFiltersState, clearFilters }) => {
    const [showAllColors, setShowAllColors] = useState(false);

    const MAX_COLORS = 6;

    const visibleColors = showAllColors
      ? filters.colors
      : filters.colors.slice(0, MAX_COLORS);

    const handleFilterChange = useCallback(
      (e) => {
        const { name, value } = e.target;
        setFiltersState((prev) => {
          if (prev[name] === value) return prev;
          return { ...prev, [name]: value };
        });
      },
      [setFiltersState]
    );

    return (
      <div className="space-y-5 flex-shrink-0 p-4 bg-white border rounded-md shadow-md">
        <h3 className="text-xl font-semibold mb-4">Filters</h3>

        {/* Category */}
        <div className="flex flex-col space-y-2">
          <h4 className="font-medium text-lg">Category</h4>
          <hr />
          {filters.categories.map((category) => {
            const id = `category-${category}`;
            return (
              <label
                key={id}
                htmlFor={id}
                className="capitalize cursor-pointer flex items-center select-none">
                <input
                  id={id}
                  type="radio"
                  name="category"
                  value={category}
                  checked={filtersState.category === category}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                {category}
              </label>
            );
          })}
        </div>

        {/* Color */}
        <div className="flex flex-col space-y-2">
          <h4 className="font-medium text-lg">Color</h4>
          <hr />

          {visibleColors.map((color) => {
            const id = `color-${color}`;
            return (
              <label
                key={id}
                htmlFor={id}
                className="capitalize cursor-pointer flex items-center select-none">
                <input
                  id={id}
                  type="radio"
                  name="color"
                  value={color}
                  checked={filtersState.color === color}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                {color}
              </label>
            );
          })}

          {filters.colors.length > MAX_COLORS && (
            <button
              type="button"
              onClick={() => setShowAllColors((prev) => !prev)}
              className="flex items-center gap-2 text-sm text-primary font-medium mt-2">
              {showAllColors ? (
                <>
                  Show less <FaChevronUp />
                </>
              ) : (
                <>
                  More colors <FaChevronDown />
                </>
              )}
            </button>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col space-y-2">
          <h4 className="font-medium text-lg">Price Range</h4>
          <hr />
          {filters.priceRange.map((range) => {
            const id = `priceRange-${range.min}-${range.max}`;
            const rangeValue = `${range.min}-${range.max}`;
            return (
              <label
                key={id}
                htmlFor={id}
                className="cursor-pointer flex items-center select-none">
                <input
                  id={id}
                  type="radio"
                  name="priceRange"
                  value={rangeValue}
                  checked={filtersState.priceRange === rangeValue}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                {range.label}
              </label>
            );
          })}
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="bg-primary text-white py-2 px-6 rounded mt-6 block w-full"
          type="button">
          Clear All Filters
        </button>
      </div>
    );
  }
);

const ShopFiltering = ({
  filters,
  filtersState,
  setFiltersState,
  clearFilters,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showMobileFilters ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileFilters]);

  return (
    <>
      {/* Mobile Button */}
      {!showMobileFilters && (
        <div className="md:hidden p-4 bg-white shadow sticky top-0 z-40 flex justify-center">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="bg-primary text-white px-6 py-2 rounded font-semibold"
            type="button">
            Filters
          </button>
        </div>
      )}

      {/* Mobile Modal */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-end"
          onClick={() => setShowMobileFilters(false)}>
          <div
            className="bg-white w-3/4 max-w-xs h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-2xl font-bold text-red-600"
                type="button">
                ×
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

      {/* Desktop */}
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