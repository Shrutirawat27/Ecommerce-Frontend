import React from 'react'

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'priceRange') {
            const [min, max] = value.split('-').map(Number);
            setFiltersState((prevState) => ({
                ...prevState,
                priceRange: { min, max },
            }));
        } else {
            setFiltersState((prevState) => ({
                ...prevState,
                [name]: prevState[name] === value ? null : value, // Reset if already selected
            }));
        }
    };

    return (
        <div className="space-y-5 flex-shrink-0">
            <h3>Filters</h3>

            {/* categories */}
            <div className="flex flex-col space-y-2">
                <h4 className="font-medium text-lg">Category</h4>
                <hr />
                {filters.categories.map((category) => (
                    <label key={category} className="capitalize cursor-pointer">
                        <input
                            type="radio"
                            name="category"
                            id={`category-${category}`}
                            value={category}
                            checked={filtersState.category === category}
                            onChange={handleFilterChange}
                        />
                        <span className="ml-1">{category}</span>
                    </label>
                ))}
            </div>

            {/* colors */}
            <div className="flex flex-col space-y-2">
                <h4 className="font-medium text-lg">Colors</h4>
                <hr />
                {filters.colors.map((color) => (
                    <label key={color} className="capitalize cursor-pointer">
                        <input
                            type="radio"
                            name="color"
                            id={`color-${color}`}
                            value={color}
                            checked={filtersState.color === color}
                            onChange={handleFilterChange}
                        />
                        <span className="ml-1">{color}</span>
                    </label>
                ))}
            </div>

            {/* pricing */}
            <div className="flex flex-col space-y-2">
                <h4 className="font-medium text-lg">Price Range</h4>
                {filters.priceRange.map((range) => (
                    <label key={range.label} className="capitalize cursor-pointer">
                        <input
                            type="radio"
                            name="priceRange"
                            id={`priceRange-${range.label}`}
                            value={`${range.min}-${range.max}`}
                            checked={filtersState.priceRange?.min === range.min && filtersState.priceRange?.max === range.max}
                            onChange={handleFilterChange}
                        />
                        <span className="ml-1">{range.label}</span>
                    </label>
                ))}
            </div>

            {/* clear filter */}
            <button onClick={clearFilters} className="bg-primary py-1 px-4 text-white rounded">Clear All Filters</button>
        </div>
    );
};

export default ShopFiltering;
