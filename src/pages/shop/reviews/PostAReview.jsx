import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { usePostReviewMutation } from '../../../redux/features/reviews/reviewsApi';

const PostAReview = ({ isModalOpen, handleClose, refetchProduct }) => {
  const { _id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { refetch } = useFetchProductByIdQuery(_id, { skip: !_id });
  const [postReview] = usePostReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || !comment.trim()) {
      alert('Please provide both rating and comment');
      return;
    }

    const newComment = {
      comment: comment.trim(),
      rating,
      userId: user?._id,
      productId: _id,
    };

    try {
      await postReview(newComment).unwrap();
      alert('Review posted successfully!');
      setComment('');
      setRating(0);
      if (refetchProduct) await refetchProduct(); 
      handleClose();
    } catch (error) {
        alert(error?.data?.message || error.message || 'Failed to post review');
   }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 transition-all duration-200 ${
        isModalOpen ? 'visible' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative z-50">
        <h2 className="text-lg font-semibold mb-4">Post a Review</h2>

        {/* Star Rating */}
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className="cursor-pointer"
              aria-label={`Rate ${star} star`}>
              <img
                src={rating >= star ? '/yellow_star_filled.png' : '/yellow_star_empty.png'}
                alt={rating >= star ? 'filled star' : 'empty star'}
                className="w-6 h-6"
              />
            </span>
          ))}
        </div>

        {/* Comment Box */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-primary resize-none"
          placeholder="Write your review here...">
        </textarea>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostAReview;