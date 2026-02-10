import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";



export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "https://food-delivery-app-backend-ba1b.onrender.com";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    // useEffect(() => {
    //     async function loadData() {
    //         await fetchFoodList();
    //         if (localStorage.getItem("token")) {
    //             setToken(localStorage.getItem("token"));
    //             await loadCartData(localStorage.getItem("token"));
    //         };
    //     }
    //     loadData();
    // }, []);

    useEffect(() => {
        fetchFoodList();
    }, []); // food loads once properly


    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            loadCartData(token);
        } else {
            setCartItems({});
        }
    }, [token]); // cart reloads on login/logout



    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            const expTime = decoded.exp * 1000;
            const now = Date.now();

            if (expTime < now) {
                setToken(null);
                localStorage.removeItem("token");
                alert("Session expired. Please log in again.");
                // setShowLogin(true);
            }
        }
    }, [token]);

    const fetchFoodList = async () => {
        try {
            console.log("📡 Fetching food list...");
            const response = await axios.get(url + "/api/food/list");
            console.log("✅ Food response:", response.data);
            setFoodList(response.data.data || []);
        } catch (error) {
            console.error("❌ Food fetch failed:", error.message);
        }
    };


    const loadCartData = async (token) => {
        const response = await axios.post(
            url + "/api/cart/get",
            {},
            { headers: { token } }
        );

        setCartItems(response.data.cartData || {});
    };


    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const safeCart = prev || {};
            return {
                ...safeCart,
                [itemId]: (safeCart[itemId] || 0) + 1,
            };
        });

        if (token) {
            await axios.post(
                url + "/api/cart/add",
                { itemId },
                { headers: { token } }
            );
        } else {
            console.log("Login please");
        }
    };


    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        if (token) {
            await axios.post(url + '/api/cart/remove', { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find(
                    (product) => product._id === item
                );
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }

        return totalAmount;
    };


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
