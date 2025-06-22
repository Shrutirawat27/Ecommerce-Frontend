import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import RatingStars from '/src/components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';

const SingleProduct = () => {
    const {_id} = useParams();  // Get the product ID from the URL params
    const dispatch = useDispatch();

    // State to manage product data, reviews, loading, and error
    const [product, setProduct] = useState({});
    const [productReviews, setProductReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the product data when the component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${_id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                console.log("Fetched product data:", data);  // Log the fetched product data
                setProduct(data);  // Directly set the product data
                setProductReviews(data.reviews || []);  // If reviews exist, set them, else empty array
            } catch (error) {
                console.error("Error fetching product:", error);  // Log the error in the console
                setError('Error loading product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [_id]);  // Re-run when product ID changes

    // Handle adding the product to the cart
    const handleAddToCart = (product) => {
        console.log("Adding product to cart:", product);
        dispatch(addToCart(product));
    };

    // Show loading or error messages if necessary
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>Product not found</p>;

    return (
        <>
            <section className="section__container bg-primary-light">
                <h2 className="section__header capitalize">Single Product Page</h2>
                <div className="flex items-center space-x-2 section__subheader">
                    <span className="hover:text-primary"><Link to="/">home</Link></span>
                    <img src="/arrow.png" alt="arrow" className="w-4 h-4 "/>
                    <span className="hover:text-primary"><Link to="/shop">shop</Link></span>
                    <img src="/arrow.png" alt="arrow" className="w-4 h-4 "/>
                    <span className="hover:text-primary">{product.name}</span>
                </div>
            </section>

            <section className="section__container mt-8">
                <div className="flex flex-col items-center md:flex-row gap-8">
                    {/* Product Image */}
                    <div className="md:w-1/2 w-full">
                        <img src={product?.image1} alt="Product" className="product__image" />
                    </div>

                    <div className="md:w-1/2 w-full">
                        <h3 className="text-2xl font-semibold mb-4">{product?.name}</h3>
                        <p className="text-2xl text-primary mb-4">${product?.price} 
                            {product?.oldPrice && <s className="ml-1 text-xl">${product?.oldPrice}</s>} 
                        </p>
                        <p className="text-gray-400 mb-4">{product?.description}</p>

                        {/* Additional product info */}
                        <div>
                            <p><strong>Category:</strong> {product?.category}</p>
                            <p><strong>Color:</strong> {product?.color}</p>
                            <div className="flex gap-1 items-center">
                                <strong>Rating: </strong>
                                <RatingStars rating={product?.rating} />
                            </div>

                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);  // Add product to cart when clicked
                                }}
                                className="mt-6 px-6 py-3 bg-primary text-white rounded-md">
                                    Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Display Reviews */}
            <section className="section__container mt-8">
                <ReviewsCard productReviews={productReviews} />
            </section>
        </>
    );
};

export default SingleProduct;
