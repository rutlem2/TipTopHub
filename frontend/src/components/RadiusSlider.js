import React, { useState } from 'react';

import "../styling/RadiusSlider.css"

const DEFAULT_RADIUS = 3

const RadiusSlider = (props) => {
    const [radius, setRadius] = useState(DEFAULT_RADIUS);

    const radiusChangeHandler = (event) => {
        setRadius(event.target.value)
        props.radius(event.target.value)
    }

    return (
        <div className="slider-wrapper">
            <div className="slider">
                <input
                type="range"
                className="radius-slider" 
                min={1}
                max={5}
                defaultValue={DEFAULT_RADIUS}
                onChange={radiusChangeHandler}/>
            </div>
            <p className="slider-explain">
                search within {radius} miles
            </p>
        </div>

    );
}

export default RadiusSlider;