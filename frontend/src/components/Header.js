import React from 'react';

import "../styling/Header.css";

const Header = () => {
    return (
        <div className="header">
            
            <h2 className="text-logo">
                <div className="website-title">
                    TipTopHub
                </div>
                <img id="logo" src="logo_nobg.png" alt="TipTopHub" />
            </h2>
            <h3>
                Order from the top 5 joints in your area.
            </h3>
        </div>
    );
}

export default Header;