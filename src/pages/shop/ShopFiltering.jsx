import React from 'react';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === 'priceRange') {
      const [min, max] = value.split('-').map(Number);
      setFiltersState((prev) => ({
        ...prev,
        priceRange: { min, max },
      }));
    } else {
      setFiltersState((prev) => ({
        ...prev,
        [name]: prev[name] === value ? null : value,
      }));
    }
  };

  return (
    <div className="space-y-5 flex-shrink-0">
      <h3 className="text-xl font-semibold">Filters</h3>

      {/* Category Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-lg">Category</h4>
        <hr />
        {filters.categories.map((category) => (
          <label key={category} className="capitalize cursor-pointer">
            <input
              type="radio"
              name="category"
              value={category}
              checked={filtersState.category === category}
              onChange={handleFilterChange}
            />
            <span className="ml-1">{category}</span>
          </label>
        ))}
      </div>

      {/* Color Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-lg">Color</h4>
        <hr />
        {filters.colors.map((color) => (
          <label key={color} className="capitalize cursor-pointer">
            <input
              type="radio"
              name="color"
              value={color}
              checked={filtersState.color === color}
              onChange={handleFilterChange}
            />
            <span className="ml-1">{color}</span>
          </label>
        ))}
      </div>

      {/* Price Filter */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-lg">Price Range</h4>
        {filters.priceRange.map((range) => (
          <label key={range.label} className="capitalize cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              value={`${range.min}-${range.max}`}
              checked={
                filtersState.priceRange?.min === range.min &&
                filtersState.priceRange?.max === range.max
              }
              onChange={handleFilterChange}
            />
            <span className="ml-1">{range.label}</span>
          </label>
        ))}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="bg-primary text-white py-1 px-4 rounded mt-4"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default ShopFiltering;