import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

const Search = () => {
  const [searchText, setSearchText] = useState('');

  const { data } = useSelector(state => state.products)
  // Function to handle changes in the search input
  const HandleSearch = (event) => {
    setSearchText(event.target.value);
    const filteredProducts = data.filter((product) => {
      const { name, model, manufacturer } = product;
      const lowerSearchText = searchText.toLowerCase();
      return (
        name.toLowerCase().includes(lowerSearchText) ||
        model.toLowerCase().includes(lowerSearchText) ||
        manufacturer.toLowerCase().includes(lowerSearchText)
      );
    });
    
  };


  return (

    <input type='text' onChange={HandleSearch} />

  )
}

export default Search
