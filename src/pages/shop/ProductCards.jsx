import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '/src/redux/features/cart/cartSlice';

const ProductCards = ({ products }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-md shadow-sm hover:shadow-md transition">

          {/* Image */}
          <div className="relative overflow-hidden rounded-t-md">
            <Link to={`/shop/${product._id}`}>
              <div className="w-full aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] max-h-80 md:max-h-72 lg:max-h-64">
                <img
                  src={product.image1}
                  alt={product.name || 'Product image'}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
            </Link>

            {/* Add to cart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              className="absolute top-2 right-2 bg-primary p-1.5 rounded hover:bg-primary-dark">
              <img src="/shopping-cart.png" alt="Add to cart" className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-2 sm:p-3">
            <h4 className="text-sm font-medium truncate">
              {product.name}
            </h4>

            <p className="text-sm font-semibold mt-1">
              ${product.price}
              {product.oldPrice && (
                <s className="ml-2 text-xs text-gray-400">${product.oldPrice}</s>
              )}
            </p>

            <div className="mt-1">
              <RatingStars rating={product.rating} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;