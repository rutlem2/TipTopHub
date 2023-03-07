import React from 'react';

import "../styling/ListingItem.css";

const ListingItem = (props) => {
    const hideCardWrapper = () => {
        props.toggleMenu(props.restaurant)
    }

    return (
        <div className="card-area">
            <div className="card-rank-and-img">
                {props.rank}
            </div>
            <div className="card-content">
                <div className="restaurant-title">
                    {props.name}
                </div>
                <div className="bubbles">
                    {props.categories.slice(0,3).map((category, index) => (
                    <div className="category-bubble" key={index}>
                        <div className="category-content">
                            {category.title}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className="action-prompt">
                <div className="menu-icon-wrapper" onClick={hideCardWrapper}>
                    <img className="menu-icon" src="menu.png" alt="Menu" />
                </div>
            </div>
        </div>
    );
}

export default ListingItem;