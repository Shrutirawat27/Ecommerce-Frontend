import React from 'react'

const RatingStars = ({rating}) => {
    const stars = [];
    for (let i=1; i<= 5; i++) {
            stars.push(
                <img key={i} 
                src={i <= rating ? '/star_filled.png' : '/star_empty.png'}
                alt={i <= rating ? 'Filled Star' : 'Empty Star'}
                className="h-6 w-6 inline-block"
                />
            )
        }
  return (
    <div className='product__rating'>{stars}</div>
  )
}

export default RatingStars
