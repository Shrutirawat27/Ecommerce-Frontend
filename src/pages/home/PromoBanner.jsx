import React from 'react'

const PromoBanner = () => {
  return (
    <section className='section__container banner__container'>
      <div className="banner__card">
        <img src="/shipped.png" alt="Shipped" className="w-16 h-16"/>
        <h4>Free Delivery</h4>
        <p>Offers convenience and the ability to shop from anywhere, anytime.</p>
      </div>
      <div className="banner__card">
        <img src="/coin.png" alt="Money" className="w-16 h-15"/>
        <h4>100% Money Return</h4>
        <p>E-commerce have a review system where customers can share feedback.</p>
      </div>
      <div className="banner__card">
        <img src="/user-voice.png" alt="User Voice" className="w-16 h-15"/>
        <h4>Strong Support</h4>
        <p>Offers customer support services to assist customers with queries and issues.</p>
      </div>
    </section>
  )
}

export default PromoBanner
