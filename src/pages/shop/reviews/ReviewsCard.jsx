import React, { useState } from 'react';
import commentorIcon from "../../../assets/avatar.png";
import { formatDate } from '../../../utils/formatDate';
import RatingStars from '../../../components/RatingStars';
import PostAReview from './PostAReview';

const ReviewsCard = ({ productReviews, refetchProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reviews = productReviews || [];
  const handleOpenReviewModal = () => setIsModalOpen(true);
  const handleCloseReviewModal = () => setIsModalOpen(false);

  return (
    <div className="my-6 bg-white p-8 rounded shadow-sm">
      <div>
        {reviews.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
            {reviews.map((review) => (
              <div key={review._id || review.updatedAt} className="mt-6 border-b pb-6">
                <div className="flex gap-4 items-center">
                  <img
                    src={commentorIcon}
                    alt={`${review?.userId?.username || 'User'} avatar`}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                  <div>
                    <p className="text-blue-500 font-medium capitalize underline underline-offset-2">
                      {review?.userId?.username || 'Anonymous'}
                    </p>
                    <p className="text-xs italic text-gray-500">{formatDate(review?.updatedAt)}</p>
                    <RatingStars rating={review?.rating} />
                  </div>
                </div>
                <div className="text-gray-700 mt-4">
                  <p className="text-sm">{review?.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No reviews yet.</p>
        )}
      </div>

      {/* Add Review Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleOpenReviewModal}
          className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Add A Review
        </button>
      </div>

      {/* Modal */}
      <PostAReview
      isModalOpen={isModalOpen}
      handleClose={handleCloseReviewModal}
      refetchProduct={refetchProduct} 
      />
    </div>
  );
};

export default ReviewsCard;