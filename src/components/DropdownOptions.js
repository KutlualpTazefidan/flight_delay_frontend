import React, { useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import styles from "./dropdownoptions.module.css";
export default function DropdownOptions({
  filteredItems,
  updateSelectedItem,
  selectedItem,
}) {
  const itemCount = filteredItems.length;
  const itemSize = 40; // Adjust the item height as needed
  const listRef = useRef(null);

  // Ensure that the selected item is visible when the dropdown opens
  useEffect(() => {
    if (listRef.current && filteredItems.length > 0) {
      const selectedItemIndex = filteredItems.findIndex(
        (item) => item === selectedItem
      );
      if (selectedItemIndex !== -1) {
        listRef.current.scrollToItem(selectedItemIndex);
      }
    }
  }, [filteredItems, selectedItem]);

  return (
    <List
      className={styles.list}
      height={200} // Set the desired height for the dropdown
      itemCount={itemCount}
      itemSize={itemSize}
      //   width={200} // Set the desired width for the dropdown
      ref={listRef}
    >
      {({ index, style }) => (
        <div
          className={styles.option}
          style={style}
          onClick={() => updateSelectedItem(filteredItems[index])}
          key={index}
        >
          {filteredItems[index]}
        </div>
      )}
    </List>
  );
}
