"use client";
import styles from "./singledropdown.module.css";
import { FaAngleDown } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";

// Storage
import { storage } from "../storage/storage";
import { useSnapshot } from "valtio";

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
  const [filteredItems, setFilteredItems] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedItem(snap[varConnectedToStorage]);
  }, []);

  useEffect(() => {
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
      c_filteredItems = [];
    }
    c_filteredItems.length == 0
      ? setFilteredItems(["None"])
      : setFilteredItems(c_filteredItems);
    console.log("filtered", allItems);
  };

  const renderOptions = () => {
    const itemsToRender =
      filteredItems.length > 0 ? filteredItems : ["Search Results"];
    return itemsToRender.map((item, index) => (
      <li onClick={() => updateSelectedItem(item)} key={"dd_title" + index}>
        {item}
      </li>
    ));
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
        <ul className={styles.options}>{renderOptions()}</ul>
      </div>
    </div>
  );
}
