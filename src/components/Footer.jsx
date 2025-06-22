import React from 'react'
import instaImg1 from "../assets/instagram-1.jpg"
import instaImg2 from "../assets/instagram-2.jpg"
import instaImg3 from "../assets/instagram-3.jpg"
import instaImg4 from "../assets/instagram-4.jpg"
import instaImg5 from "../assets/instagram-5.jpg"
import instaImg6 from "../assets/instagram-6.jpg"

const Footer = () => {
  return (
    <>
    <footer className="section__container footer__container">
        <div className="footer__col">
            <h4>CONTACT INFO</h4>
        <div className="flex items-center space-x-3">
          <img src="/map.png" alt="Map" className="w-6 h-6 object-contain" />
          <p>123, London Bridge Street, London</p>
        </div>
        <div className="flex items-center space-x-3">
          <img src="/mail.png" alt="Mail" className="w-6 h-6 object-contain" />
          <p>support@gmail.com</p>
        </div>
        <div className="flex items-center space-x-3">
          <img src="/phone.png" alt="Phone Number" className="w-6 h-6 object-contain" />
          <p>(+012) 4324 246</p>
        </div>

        </div>

        <div className="footer__col">
            <h4>COMPANY</h4>
            <a href="/">Home</a>
            <a href="/">About Us</a>
            <a href="/">Work With Us</a>
            <a href="/">Our Blogs</a>
            <a href="/">Terms & Conditions</a>
        </div>
        
        <div className="footer__col">
            <h4>USEFUL LINK</h4>
            <a href="/">Help</a>
            <a href="/">Track My Order</a>
            <a href="/">Men</a>
            <a href="/">Women</a>
            <a href="/">Dresses</a>
        </div>

        <div className="footer__col">
            <h4>INSTAGRAM</h4>
            <div className="instagram__grid">
                <img src={instaImg1} alt="Image1" />
                <img src={instaImg2} alt="Image2" />
                <img src={instaImg3} alt="Image3" />
                <img src={instaImg4} alt="Image4" />
                <img src={instaImg5} alt="Image5" />
                <img src={instaImg6} alt="Image6" />
            </div>
        </div>
        </footer> 
        <div className="footer__bar">
            Copyright @ 2025 Web Design Mastery. All rights reserved.
        </div>
    </>
  )
}

export default Footer
