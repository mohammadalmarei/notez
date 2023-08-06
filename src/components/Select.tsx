import { useState, ChangeEvent, useRef, useEffect } from "react";
import styles from "./styles/select.module.css";

// Define the type for each option in the select dropdown
export type SelectOption = {
  label: string;
  value?: string | number;
};

// Define the props for multiple select dropdown
type MultipleSelectProps = {
  multiple: true;
  Selected: SelectOption[];
  setSelected: (Selected: SelectOption[]) => void;
};

// Define the props for single select dropdown
type SingleSelectProps = {
  multiple?: false;
  Selected?: SelectOption;
  setSelected: (Selected: SelectOption | undefined) => void;
};

// Define the props for Creatable select dropdown
type CreatableSelectProps = {
  creatable?: true;
  handleCreateOption: (option: SelectOption) => void;
};
// Define the props for Not select dropdown
type NotCreatableSelectProps = {
  creatable?: false;
};

// Union type for both single and multiple select props
type SelectProps = {
  options: SelectOption[];
  handleCreateOption?: (option: SelectOption) => void;
} & (SingleSelectProps | MultipleSelectProps) &
  (CreatableSelectProps | NotCreatableSelectProps);

// Custom Select component
export default function Select({
  multiple,
  creatable,
  options,
  Selected,
  setSelected,
  handleCreateOption,
}: SelectProps) {
  // Function to handle option selection
  function selectOption(option: SelectOption) {
    if (multiple) {
      // If multiple, add or remove the option from the selected options
      if (Selected.includes(option)) {
        setSelected(Selected.filter((o) => o.value !== option.value));
      } else {
        setSelected([...Selected, option]);
      }
    } else {
      // If single, change the selected option
      if (option !== Selected) setSelected(option);
    }
  }

  // State to manage the text input for creatable options
  const [creatableInputText, setCreatableInputText] = useState<string>("");

  // State to keep track of the currently highlighted option index
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Ref to store a reference to the dropdown container element
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown":
          const newSelected =
            highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);

          if (newSelected >= 0 && newSelected < options.length) {
            setHighlightedIndex(newSelected);
          }
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [highlightedIndex]);

  return (
    <div className={styles.container} tabIndex={0} ref={containerRef}>
      <span className={styles.value}>
        {/* Render the selected options for multiple select */}
        {multiple
          ? Selected.map((v, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  // When clicked, remove the option from the selected list
                  selectOption(v);
                }}
                className={styles["option-badge"]}
              >
                {v.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : Selected?.label}

        {/* Render the input for creating new options */}
        {creatable && (
          <input
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCreatableInputText(e.target.value);
            }}
            className={styles["create-input"]}
          />
        )}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation;
          e.preventDefault(); // Prevent form submission
          // When clicked, clear the selected options
          multiple ? setSelected([]) : setSelected(undefined);
        }}
        className={styles["clear-btn"]}
      >
        &times; {/* Render the times (x) icon for clearing options */}
      </button>
      {/* Render the divider and caret for the dropdown */}
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      {/* Render the list of options */}
      {/* Render the list of options */}
      <ul className={styles.options}>
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => {
              selectOption(option);
            }}
            className={`${styles.option} ${
              (multiple ? Selected.includes(option) : option === Selected)
                ? styles.selected
                : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            {option.label} {/* Render the label of each option */}
          </li>
        ))}

        {/* Render the button to create new options */}
        {creatable && (
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission

              handleCreateOption({
                label: creatableInputText,
              });
            }}
            className={styles["create-btn"]}
          >
            {` Create: ${creatableInputText}`}
          </button>
        )}
      </ul>
    </div>
  );
}

//How to use
/*
Example for single select:

const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>(options[0]);

<Select
  options={options}
  Selected={selectedOption}
  setSelected={setSelectedOption}
/>


Example for Multiple Creatable select:

const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([options[0]]);

<Select
  creatable
  multiple
  options={options}
  Selected={selectedOptions}
  setSelected={setSelectedOptions}
  handleCreateOption={(option) => {
    // If creatable option is selected, handle the new option creation here
    setSelectedOptions((prevSelected) => [...prevSelected, option]);
    //we can destructure option this and add logic such as adding id 
        setSelectedOptions((prevSelected) => [...prevSelected, { label: option.label, value: uuidv4() }]);
  }}
/>
*/
