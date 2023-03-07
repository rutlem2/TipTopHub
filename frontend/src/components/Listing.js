import React, { useState, useEffect } from 'react';

import ListingItem from './ListingItem';
import FoodItem from './FoodItem';
import OrderModal from './OrderModal';
import SuccessModal from './SuccessModal';

import '../styling/Listing.css';

const INVALID_ZIPCODE = "-1";
const INVALID_ZIPCODE_MESSAGE = "Please enter a valid zipcode.";
const RESTAURANTS_UNAVAILABLE = "No restaurants to order from here.";
const FOOD_UNAVAILABLE = "No food available to order here.";

const Listing = (props) => {
    const [cart, setCart] = useState('');
    const [showOrder, setShowOrder] = useState(false);
    const [isCardWrapperInactive, setIsCardWrapperInactive] = useState(false);
    const [isMenuWrapperActive, setIsMenuWrapperActive] = useState(false);
    const [isCardFoodActive, setIsCardFoodActive] = useState(false);
    const [explainerText, setExplainerText] = useState("Enter a zipcode above to get started!");
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleOpenOrder = () => setShowOrder(true);
    const handleCloseOrder = () => setShowOrder(false);

    //If search button has been clicked, always reset to the listing of restaurants.
    useEffect ( () => {
        if (props.userDidSearch)
        {
            setIsCardWrapperInactive(false);
            setIsMenuWrapperActive(false);
            setIsCardFoodActive(false);
            props.userDidSearchSet(false);
        }
    }, [props, isMenuWrapperActive, isCardWrapperInactive, isCardFoodActive])

    const toggleMenu = (restaurant=null) => {
        setIsCardWrapperInactive(!isCardWrapperInactive);
        setIsMenuWrapperActive(!isMenuWrapperActive);
        setIsCardFoodActive(!isCardFoodActive);

        if (restaurant?.hasOwnProperty("categories"))
            getFoods(restaurant);
    }

    const getCardWrapperClass = () => {
        return isCardWrapperInactive ? "card-wrapper inactive" : "card-wrapper"
    }

    const getCardClass = () => {
        return isCardWrapperInactive ? "card inactive" : "card"
    }

    const getMenuWrapperClass = () => {
        return isMenuWrapperActive ? "menu-wrapper" : "menu-wrapper inactive" 
    }
    
    const getCardFoodClass = () => {
        return isCardFoodActive ? "card food" : "card food inactive" 
    }

    const getCookie = () => {
        return document.cookie.split('=')[1];
    }

    const getCartItemsCount = () => {
        return cartItemsCount;
    }
    
    let [restaurants, setRestaurants] = useState([])

    //On renders involving any change to the dependency array (including first render of page), 
    //update the cart items count and query back-end for restaurants.
    useEffect( () => {
        let getCartItems = async () => {
            let response = await fetch(`/shop/index/`)
            let data = await response.json();
    
            let numItems = 0;
            for (let i = 0; i < data.length; i++)
                numItems += data[i].quantity;

            setCartItemsCount(numItems);
            setCart(data);
        }

        const hasValidSearchData = () => {
            if (props.radius < 0 || props.zipcode === INVALID_ZIPCODE)
                return false;
    
            return true;
        }

        const resetRestaurantListing = () => {
            setExplainerText(INVALID_ZIPCODE_MESSAGE);
            setRestaurants([]);
        }

        let getRestaurants = async () => {
            if (!hasValidSearchData())
            {
                if (props.zipcode === INVALID_ZIPCODE)
                    resetRestaurantListing()
                return;
            }

            let searchData = {zip: props.zipcode, rad: props.radius}
            let response = await fetch(`/api/results/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:8000/',
                    'X-CSRFToken': getCookie(),
                },
                body: JSON.stringify(searchData)
            });
            let data = await response.json();
            console.log(data);

            if (data?.hasOwnProperty("error"))
                resetRestaurantListing();
            else
                data.businesses.length === 0 ? setExplainerText(RESTAURANTS_UNAVAILABLE) : setRestaurants(data.businesses);
        }

        getCartItems();
        getRestaurants();
    }, [props, isMenuWrapperActive, isCardWrapperInactive, isCardFoodActive, cartItemsCount, showSuccess])

    let [foods, setFoods] = useState([])

    let getFoods = async (restaurant) => {
        const categories = restaurant["categories"].map((e) => e["alias"]);
        let response = await fetch(`/api/foods/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:8000/',
                'X-CSRFToken': getCookie(),
            },
            body: JSON.stringify(categories)
        });
        let data = await response.json();
        setFoods(data)
    }

    const displayRestaurants = () => {
        let restaurantDisplay;

        if (restaurants.length > 0) {
            restaurantDisplay = restaurants.map((restaurant, index) => (
                <div className={getCardClass()} key={index}>
                    <ListingItem rank={index+1} name={restaurant.name}
                    categories={restaurant.categories} restaurant={restaurant} toggleMenu={toggleMenu} />
                </div>
            ))
        }
        else
            restaurantDisplay = <div className="explainer-text">{explainerText}</div>

        return restaurantDisplay;
    }

    const displayFoods = () => {
        let menuDisplay;

        if (foods.length > 0) {
            menuDisplay = foods.map((food) => (
                    food["names"].map((foodName, foodKey) => (
                    <div className={getCardFoodClass()} key={foodKey}>
                        <FoodItem price={food["prices"][foodKey]} name={foodName} setCartItemsCount={setCartItemsCount} />
                    </div>
                ))
            ))
        }
        else
            menuDisplay = <div className="explainer-text-menu">{FOOD_UNAVAILABLE}</div>

        return menuDisplay;
    }
 

    return (
        <div className="listing">
            <div className="user-cart-wrapper" onClick={handleOpenOrder} >
                <div id="cart-items-count">
                    {getCartItemsCount()}
                </div>
                <img id="user-cart" src="cart.png" alt="Your cart" />
            </div>
            <OrderModal show={showOrder} handleCloseOrder={handleCloseOrder} setShowSuccess={setShowSuccess} cart={cart} 
            cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />
            <SuccessModal show={showSuccess} setShowSuccess={setShowSuccess} type={"submit_cart"} />
            <div className="restaurants-list">
                <div className={getCardWrapperClass()}>
                    {displayRestaurants()}
                </div>
                <div className={getMenuWrapperClass()}>
                    <div className="back-button-wrapper" onClick={toggleMenu}>
                        <img className="back-icon" src="back.png" alt="Return" />
                    </div>
                    {displayFoods()}
                    <div className="back-button-wrapper" onClick={toggleMenu}>
                        <img className="back-icon" src="back.png" alt="Return" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Listing;