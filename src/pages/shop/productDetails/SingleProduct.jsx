import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import RatingStars from "/src/components/RatingStars";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/features/cart/cartSlice";
import ReviewsCard from "../reviews/ReviewsCard";
import { getBaseUrl } from "../../../utils/baseURL";

const SingleProduct = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  fetchProduct();
}, [_id]);

const fetchProduct = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${getBaseUrl()}/api/products/${_id}`);
    if (!response.ok) throw new Error("Product not found");
    const data = await response.json();
    setProduct(data);
    setProductReviews(data.reviews || []);
  } catch (err) {
    console.error("Error fetching product:", err);
    setError("Error loading product details. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  if (loading) return <p className="text-center my-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-gray-600">Product not found</p>;

  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">Single Product Page</h2>
        <div className="flex items-center space-x-2 section__subheader text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">Home</Link>
          <img src="/arrow.png" alt="arrow" className="w-4 h-4" />
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <img src="/arrow.png" alt="arrow" className="w-4 h-4" />
          <span>{product?.name}</span>
        </div>
      </section>

      <section className="section__container mt-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 w-full">
            <img
              src={product?.image1 || "/placeholder.jpg"}
              alt={product?.name || "Product"}
              className="product__image w-full max-h-[500px] object-contain"
            />
          </div>

          <div className="md:w-1/2 w-full">
            <h3 className="text-2xl font-semibold mb-4">{product.name}</h3>
            <p className="text-2xl text-primary mb-4">
              ${product.price}
              {product.oldPrice && (
                <s className="ml-2 text-xl text-gray-500">${product.oldPrice}</s>
              )}
            </p>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Color:</strong> {product.color}</p>
              <div className="flex items-center gap-2">
                <strong>Rating:</strong>
                <RatingStars rating={product.rating} />
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <section className="section__container mt-12">
        <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
        <ReviewsCard productReviews={productReviews} refetchProduct={fetchProduct} />
      </section>
    </>
  );
};

export default SingleProduct;