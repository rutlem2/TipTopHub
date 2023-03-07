import React from 'react';

import "../styling/Footer.css";

const Footer = () => {
    return (
        <div className="footer_wrapper">
            <div className="footer">
                <div className="author">
                    Created by rutlem2 using
                </div>
            </div>
            <div className="logos">
                <a href="https://www.yelp.com/"><img src="yelp_logo.png" alt="Yelp!" width="50" /></a>
                <a href="https://reactjs.org/"><img  src="logo512.png" alt="React" width="30" /></a>
                <a href="https://www.djangoproject.com/"><img src="django_logo.png" alt="Django" width="40" /></a>
            </div>
        </div>
    );
}

export default Footer;