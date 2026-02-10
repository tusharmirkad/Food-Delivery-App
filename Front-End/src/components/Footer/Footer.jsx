import React from 'react' ;
import './Footer.css' ;
import { assets } from '../../assets/assets';

export default function Footer() {

    const handleRedirect = () => {
        window.open('https://www.linkedin.com/in/tushar-mirkad-0602b925a/', '_blank');
      };

  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />

                <p>Our Food Delivery System lets you easily order food from your favorite restaurants and have it delivered right to your door. Browse through various dishes, select your meal, and place your order with just a few clicks. Enjoy fast and reliable delivery, along with secure payment options for a hassle-free experience.</p>

                <p>Tomato is a full-stack food delivery web application inspired by popular platforms like Zomato and Swiggy. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), the platform allows users to seamlessly browse restaurants, explore menus, place orders, and manage their carts. The admin panel enables restaurant owners to manage food items, categories, and orders effectively.</p>

                <div className='footer-social-icons'>
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" onClick={handleRedirect}/>
                </div>
                <div className="animated-text">
                    <b>~ Tushar Mirkad</b>
                </div>
            </div>

            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>

            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 9322872204</li>
                    <li>tusharmirkad@gmail.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className='footer-copyright'>Copyright 2025 © Tomato.com - All Right Reserved.  </p>

    </div>
  )
}
