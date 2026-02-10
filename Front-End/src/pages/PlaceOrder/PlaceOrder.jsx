import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import loadRazorpay from "../../utils/loadRazorpay";
import { createOrder } from "../../services/paymentService";

export default function PlaceOrder() {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  const paymentMethod = location.state?.paymentMethod || "online";

  const totalAmount = getTotalCartAmount() + 5;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // 🔹 Handle input change
  const onChangeHandler = (evt) => {
    setData((prev) => ({
      ...prev,
      [evt.target.name]: evt.target.value,
    }));
  };

  // 🔹 Build order items
  const getOrderItems = () => {
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });
    return orderItems;
  };

  // 🔹 Razorpay Payment
  const handleOnlinePayment = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const { data: orderData } = await createOrder(
      url,
      totalAmount,
      token
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.order.amount,
      currency: "INR",
      order_id: orderData.order.id,
      name: "Food Delivery App",
      description: "Food Order Payment",
      handler: async function (response) {
        await placeOrderInDB("ONLINE", response.razorpay_payment_id);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phone,
      },
      theme: {
        color: "#fc8019",
      },
    };

    new window.Razorpay(options).open();
  };

  // 🔹 Save order in DB
  const placeOrderInDB = async (method, paymentId) => {
    try {
      await axios.post(
        `${url}/api/order/place`,
        {
          address: data,
          items: getOrderItems(),
          amount: totalAmount,
          paymentMethod: method,
          paymentId,
        },
        { headers: { token } }
      );

      toast.success("Order placed successfully");
      navigate("/myorders");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  // 🔹 Form submit
  const placeOrder = async (evt) => {
    evt.preventDefault();

    if (paymentMethod === "cod") {
      await placeOrderInDB("COD", null);
    } else {
      await handleOnlinePayment();
    }
  };

  // 🔹 Auth & cart check
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, []);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First name" />
          <input required name="lastName" value={data.lastName} onChange={onChangeHandler} placeholder="Last name" />
        </div>

        <input required name="email" value={data.email} onChange={onChangeHandler} placeholder="Email address" />
        <input required name="street" value={data.street} onChange={onChangeHandler} placeholder="Street" />

        <div className="multi-fields">
          <input required name="city" value={data.city} onChange={onChangeHandler} placeholder="City" />
          <input required name="state" value={data.state} onChange={onChangeHandler} placeholder="State" />
        </div>

        <div className="multi-fields">
          <input required name="zipcode" value={data.zipcode} onChange={onChangeHandler} placeholder="Zip code" />
          <input required name="country" value={data.country} onChange={onChangeHandler} placeholder="Country" />
        </div>

        <input required name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

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
            <p>₹{totalAmount}</p>
          </div>

          <button type="submit">
            {paymentMethod === "cod"
              ? "PLACE ORDER (COD)"
              : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
}
