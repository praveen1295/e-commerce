import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as SearchIcon } from "../../assets/searchIcon.svg";
import {
  selectSearchResults,
  searchProductAsync,
  resetSearchResults,
} from "../product/productSlice";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ styles, isSearch, searchFunction }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchResults = useSelector(selectSearchResults);
  const [searchQuery, setSearchQuery] = useState("");

  // Create a ref for the input element
  const inputRef = useRef(null);

  // Focus the input when isSearch is true
  useEffect(() => {
    if (isSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearch]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = useCallback(
    debounce((query) => {
      dispatch(searchProductAsync(query));
    }, 300),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      handleSearch(value);
    }
  };

  const handleClick = (productId) => {
    navigate(`/product-detail/${productId}`);
    dispatch(resetSearchResults());
  };

  return (
    <div
      className={`inset-y-0 right-0 top-8 max-w-xl mx-auto ${styles?.position} ${styles?.width}`}
      style={{ zIndex: 1000 }}
    >
      <div className="relative">
        <input
          ref={inputRef} // Attach the ref to the input element
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
        />
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={() => handleSearch(searchQuery)}
        >
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {searchQuery && searchResults.length > 0 && (
        <div
          style={{ zIndex: 1000 }}
          className={`absolute ${styles?.top} left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto cursor-pointer`}
        >
          {searchResults.map((product) => {
            return (
              <div
                key={product.id}
                className="p-2 border-b hover:bg-gray-100"
                onClick={() => handleClick(product.id)}
              >
                {product.title}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
