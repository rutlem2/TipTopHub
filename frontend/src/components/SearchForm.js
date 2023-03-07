import React, { useState } from 'react';

import Searchbar from "./Searchbar"
import RadiusSlider from "./RadiusSlider"
import "../styling/SearchForm.css"

const DEFAULT_RADIUS = 3;
const MILES_TO_METERS = 1609.344;

const SearchForm = (props) => {
    const [zipcode, setZipcode] = useState('');
    const [radius, setRadius] = useState(DEFAULT_RADIUS);

    const submitHandler = (event) => {
        event.preventDefault();

        props.zipcode(zipcode)
        props.radius(Math.floor(radius * MILES_TO_METERS))
        props.userDidSearchSet(true)
    };
    
    return (
        <form onSubmit={submitHandler}>
            <Searchbar zipcode={setZipcode} />
            <RadiusSlider radius={setRadius} />
        </form>
    );
}

export default SearchForm;