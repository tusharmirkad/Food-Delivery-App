import React, { useContext } from 'react';
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext.jsx';
import FoodItem from '../Fooditem/FoodItem.jsx';

export default function FoodDisplay({category}) {

    const {food_list} = useContext(StoreContext) ;
  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        <div className="food-display-list">
            {food_list?.map((item,idx) => {
                if (!category || category === "All" || category === item.category){
                    return <FoodItem key={idx} id={item._id} price={item.price} name={item.name} description={item.description} image={item.image}/>
                }
            })}
        </div>
    </div>
  )
}
