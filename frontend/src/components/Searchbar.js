import React from 'react';

import "../styling/Searchbar.css"

const INVALID_ZIPCODE = "-1"

const Searchbar = (props) => {
    const zipcodeChangeHandler = (event) => {
        let zipcode = event.target.value;
        let zipcodeString = event.target.value.toString();

        if (isZipcode(zipcodeString))
            props.zipcode(zipcode);
        else
            props.zipcode(INVALID_ZIPCODE);
    }

    const isZipcode = (unverifiedZipcode) => {
        return /^[0-9]{5}$/.test(unverifiedZipcode);
    }

    return (
        <div className="search">
            <div className="searchbar">
                <input type="text" className="searchbar-input" placeholder="Enter your zipcode..." onChange={zipcodeChangeHandler}/>
                <button type="submit" className="searchbar-glass">
                    <img id="search-glass-icon" className="glass" src="search_icon.png" alt="Search" />
                </button>
            </div>
        </div>
    );
}

export default Searchbar;