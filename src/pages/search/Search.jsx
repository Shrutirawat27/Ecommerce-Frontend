import React, { useState } from "react";
import { useSearchProductsQuery } from "../../redux/features/products/productsApi";
import ProductCards from "../shop/ProductCards";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [products, setProducts] = useState([]); 
  const { data: filteredProducts = [], isLoading, isError } = useSearchProductsQuery(searchQuery, {
    skip: !triggerSearch || !searchQuery.trim(),
  });

  React.useEffect(() => {
    if (filteredProducts.length > 0) {
      setProducts(filteredProducts);
    }
  }, [filteredProducts]);

  // Handle Search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term.");
      return;
    }
    setTriggerSearch(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setTriggerSearch(false);
    setProducts([]); 
  };

  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">Search Page</h2>
        <p className="section__subheader text-center">
          Find your favorite products quickly and easily with our search feature.
        </p>
      </section>

      <section className="section__container">
        <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar w-full max-w-4xl p-2 border rounded"
            placeholder="Search for products, brands and more..."
          />
          <button
            onClick={handleSearch}
            className="search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded"
          >
            Search
          </button>
          {searchQuery && (
            <button onClick={handleClearSearch} className="clear-button px-4 py-2 bg-gray-400 text-white rounded">
              Clear
            </button>
          )}
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Something went wrong...</p>
        ) : (
          <ProductCards products={products} />
        )}
      </section>
    </>
  );
};

export default Search;