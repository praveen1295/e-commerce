import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as SearchIcon } from "../../assets/searchIcon.svg";
import {
  searchProductAsync,
  resetSearchResults,
} from "../product/productSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const CommonSearchBar = ({
  styles,
  isSearch,
  searchFunction,
  searchQuery,
  setSearchQuery,
  selectSearchResults,
  resetSearchResults,
  selectedSearchResult,
  placeholder,
  htmlFor,
  searchType,
  handleClick,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const searchResults = useSelector(selectSearchResults);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      dispatch(searchFunction(query));
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

  return (
    <div
      className={`relative ${styles?.position} ${styles?.width}`}
      style={{ zIndex: 1000 }}
    >
      <div className="relative">
        <input
          ref={inputRef} // Attach the ref to the input element
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
          id={htmlFor}
          type="text"
          className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
        />
        {/* {errors[htmlFor] && (
          <p className="text-red-500">{errors[htmlFor].message}</p>
        )} */}
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
          {searchResults?.map((item) => {
            return (
              <div
                key={item.id}
                className="p-2 border-b hover:bg-gray-100"
                onClick={() => handleClick(item)}
              >
                {searchType === "user" && item.name}
                {searchType === "product" && item.title}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommonSearchBar;
