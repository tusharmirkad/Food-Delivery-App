
import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) ;

// placing user order for frontend
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod, paymentId } = req.body;

    if (!items || items.length === 0 || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Save order
    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod,
      paymentId,
      payment: paymentMethod === "COD" ? false : true,
      status: "Food processing.",
    });

    await newOrder.save();

    // ✅ Clear cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // ✅ DO NOT RUN STRIPE FOR RAZORPAY
    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
    });

  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      success: false,
      message: "Order placement failed",
    });
  }
};


const verifyOrder = async(req, res) => {
    const {orderId, success} = req.body ;
    try{
        if(success == "true"){
            await orderModel.findByIdAndUpdate(orderId, {payment: true}) ;
            res.json({success: true, message: "Paid"});
        }else{
            await orderModel.findByIdAndUpdate(orderId) ;
            res.json({success: true ,message: "Not Paid"});
        }
    }catch(err){
        console.log(err) ;
        res.json({success: false ,message: "Error"});
    }
}

// user order for frontend..

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


// listing orders for admin panel
const listOrders = async(req, res) => {
    try{
        const orders = await orderModel.find({}) ;
        res.json({success: true, data: orders}) ;
    }catch(err){
        console.log(err)
        res.json({success: true, message:"Error"}) ;
    }
}

// api for updating order status

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      message: "Status updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error updating status",
    });
  }
};


export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus} ;
