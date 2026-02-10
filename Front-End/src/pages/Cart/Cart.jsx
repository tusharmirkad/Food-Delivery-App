import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // 🔹 Payment method state
  const [paymentMethod, setPaymentMethod] = useState("online");

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <React.Fragment key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                  >
                    x
                  </p>
                </div>
                <hr />
              </React.Fragment>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        {/* CART TOTAL */}
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>
                ₹
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 5}
              </p>
            </div>
          </div>

          {/* 🔽 PAYMENT METHOD DROPDOWN */}
          <select
            className="payment-dropdown"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="online">Online Payment</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          {/* PROCEED BUTTON */}
          <button
            onClick={() =>
              navigate("/order", {
                state: { paymentMethod },
              })
            }
          >
            PROCEED
          </button>
        </div>

        {/* PROMO CODE */}
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here.</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button className="submit">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
