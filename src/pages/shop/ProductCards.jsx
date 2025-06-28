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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product._id} className="product__card">
          <div className="relative">
            <Link to={`/shop/${product._id}`}>
              <img
                src={product.image1}
                alt={product.name || "Product image"}
                className="max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300"
              />
            </Link>

            <div className="hover:block absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                aria-label="Add to cart"
              >
                <img
                  src="/shopping-cart.png"
                  alt="Add to cart"
                  className="h-10 icon bg-primary p-1.5 hover:bg-primary-dark rounded"
                />
              </button>
            </div>
          </div>

          <div className="product__card__content">
            <h4>{product.name}</h4>
            <p>
              ${product.price}
              {product.oldPrice && <s className="ml-2">${product.oldPrice}</s>}
            </p>
            <RatingStars rating={product.rating} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;