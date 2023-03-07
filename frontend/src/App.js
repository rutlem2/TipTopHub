import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "./components/Header"
import SearchForm from "./components/SearchForm"
import Listing from "./components/Listing"
import Footer from "./components/Footer"

const App = () => {
  const [zipcode, setZipcode] = useState('');
  const [radius, setRadius] = useState(-1);
  const [userDidSearch, setUserDidSearch] = useState(false);

  return (
    <div>
      <Header />
      <SearchForm zipcode={setZipcode} radius={setRadius} userDidSearchSet={setUserDidSearch} />
      <Listing zipcode={zipcode} radius={radius} userDidSearch={userDidSearch} userDidSearchSet={setUserDidSearch} />
      <Footer />
    </div>
  );
}

export default App;
