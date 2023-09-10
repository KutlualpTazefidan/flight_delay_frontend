"use client";
import styles from "./singledropdown.module.css";
import { FaAngleDown } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";

// Storage
import { storage } from "../storage/storage";
import { useSnapshot } from "valtio";

// Efficient drop down list
import DropdownOptions from "./DropdownOptions";

export default function SingleDropdown({
  dd_title,
  varConnectedToStorage,
  allItems,
  renderTrigger,
  setRenderTrigger,
}) {
  const snap = useSnapshot(storage);
  // Retrieving store items to see if they changed
  const [selectedItem, setSelectedItem] = useState(snap[varConnectedToStorage]);

  const [isItemActive, setIsItemActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(allItems);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredItems(allItems);
  }, [allItems]);

  useEffect(() => {
    setSelectedItem(snap[varConnectedToStorage]);
    // setSearchValue(snap[varConnectedToStorage]);
    // setFilteredItems([snap[varConnectedToStorage]]);
  }, [snap[varConnectedToStorage]]);

  useEffect(() => {
    setSelectedItem(snap[varConnectedToStorage]);
    // Add a click event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Click occurred outside the dropdown, so close it
      setIsItemActive(false);
    }
  };

  const updateSelectedItem = (selectedItem) => {
    setSelectedItem(selectedItem);
    setIsItemActive(false); // Close the dropdown when a country is selected
    setRenderTrigger(!renderTrigger);
    storage[varConnectedToStorage] = selectedItem;
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    let c_filteredItems = [];

    if (value != "") {
      c_filteredItems = allItems.filter((item) => {
        return item.toLowerCase().startsWith(value.toLowerCase());
      });
    } else {
      c_filteredItems = allItems;
    }
    c_filteredItems.length == 0
      ? setFilteredItems(allItems)
      : setFilteredItems(c_filteredItems);
  };

  const toggleWrapper = () => {
    setIsItemActive(!isItemActive);
  };

  return (
    <div
      className={`${styles.wrapper} ${isItemActive ? styles.active : ""}`}
      ref={dropdownRef}
    >
      <span className={styles.title}>{dd_title}</span>
      <div
        className={styles.select_btn}
        id="select_button"
        onClick={toggleWrapper}
      >
        <span>{selectedItem}</span>
        <FaAngleDown className={styles.down_arrow} />
      </div>
      <div className={styles.search_content}>
        <div className={styles.search}>
          <BiSearch className={styles.search_icon} />
          <input
            className={styles.input}
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchInputChange} // Handle input change
          />
        </div>
        {/* <ul className={styles.options}>{renderOptions()}</ul> */}
        <DropdownOptions
          filteredItems={filteredItems}
          updateSelectedItem={updateSelectedItem}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  );
}
