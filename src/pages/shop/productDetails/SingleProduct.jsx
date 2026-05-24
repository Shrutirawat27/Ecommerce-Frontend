import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import RatingStars from "/src/components/RatingStars";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/features/cart/cartSlice";
import ReviewsCard from "../reviews/ReviewsCard";
import { getBaseUrl } from "../../../utils/baseURL";
import Loader from "/src/components/Loader"; 
import { Heart } from "lucide-react";
import { toggleWishlistAsync } from "/src/redux/features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import SingleProductSkeleton from '/src/components/SingleProductSkeleton';

const SingleProduct = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const wishlistProducts = useSelector(
  (state) => state.wishlist.products
);

  const [product, setProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [_id]);

  useEffect(() => {

  if (product?.name) {
    document.title = `${product.name} — HerStyle`;
  }

  return () => {
    document.title = "HerStyle";
  };

}, [product]);

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

  if (!product) return;

  if (product?.sizes?.length > 0 && !selectedSize) {
    toast.error("Please select a size");
    return;
  }

  dispatch(
    addToCart({
      ...product,
      selectedSize,
    })
  );

  toast.success(
    `${product.name}${selectedSize ? ` (${selectedSize})` : ""} added to cart`
  );
};

  if (loading) {
    return <SingleProductSkeleton />;
  }

  if (error) return <p className="text-center text-red-500 my-8">{error}</p>;
  if (!product) return <p className="text-center text-gray-600 my-8">Product not found</p>;

  const handleWishlist = () => {

  if (!user) {
    toast.error("Please login to use wishlist");
    return;
  }

  dispatch(toggleWishlistAsync(product));

  const exists = wishlistProducts.find(
    (p) => p._id === product._id
  );

  if (exists) {
    toast.info(`${product.name} removed from wishlist`);
  } else {
    toast.success(`${product.name} added to wishlist`);
  }
};

  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">Single Product Page</h2>
        <div className="flex justify-center items-center space-x-2 section__subheader text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">Home</Link>
          <img src="/arrow.png" alt="arrow" className="w-4 h-4" />
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <img src="/arrow.png" alt="arrow" className="w-4 h-4" />
          <span>{product?.name}</span>
        </div>
      </section>

      <section className="section__container mt-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 w-full overflow-hidden rounded-xl">

  <div className="overflow-hidden rounded-xl cursor-zoom-in">

    <img
      src={product?.image1 || "/placeholder.jpg"}
      alt={product?.name || "Product"}
      className="product__image w-full max-h-[500px] object-contain transition-transform duration-500 hover:scale-110"
    />

  </div>

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

            {product?.sizes?.length > 0 && (
            <div className="mt-6">
            <h3 className="font-semibold mb-3">Select Size</h3>

            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-md transition ${
                selectedSize === size
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              {size}
            </button>
               ))}
            </div>
            </div>
          )}

            <button
              onClick={handleAddToCart}
              className="mt-6 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark">
              Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className="mt-4 ml-4 px-5 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition">
            <Heart
              size={20}
              className={
              wishlistProducts.find(
               (p) => p._id === product._id
                )
                ? "fill-red-500 text-red-500"
                : "text-gray-700"
                }
              />
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