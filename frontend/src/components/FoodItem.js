import React, { useState } from 'react';
import AddToCartModal from './AddToCartModal';
import SuccessModal from './SuccessModal';

import "../styling/FoodItem.css";

const FoodItem = (props) => {
    const [showAddToCart, setShowAddToCart] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleOpenAddToCart = () => setShowAddToCart(true);
  
    return (
        <div className="food-card-area">
            <div className="card-price">
                {props.price}
            </div>
            <div className="food-card-content">
                <div className="food-title">
                    {props.name}
                </div>
            </div>
            <div className="action-prompt">
                <div className="cart-icon-wrapper" onClick={handleOpenAddToCart}>
                    <span className="hovertext" data-hover="Add to cart"></span>
                    <img className="cart-icon" src="cart.png" alt="Cart" />
                </div>
            </div>
            <AddToCartModal show={showAddToCart} setShowAddToCart={setShowAddToCart} setShowSuccess={setShowSuccess} productName={props.name} productPrice={props.price} 
            setCartItemsCount={props.setCartItemsCount} />
            <SuccessModal show={showSuccess} setShowSuccess={setShowSuccess} productName={props.name} type={"add_item"} />
        </div>
    );
}

export default FoodItem;