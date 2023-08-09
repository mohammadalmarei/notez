import { useEffect, useState } from "react";

// Custom hook to manage a value in local storage
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  // Use the useState hook to manage the value state
  const [value, setValue] = useState<T>(() => {
    // Get the value from local storage based on the provided key
    const jsonValue = localStorage.getItem(key);

    // If the value doesn't exist in local storage, use the initial value provided
    if (jsonValue == null) {
      // Check if the initial value is a function (lazy initial value)
      if (typeof initialValue === "function") {
        // If it's a function, call it and use the result as the initial value
        return (initialValue as () => T)();
      } else {
        // If it's a regular value, use it as the initial value
        return initialValue;
      }
    } else {
      // If the value exists in local storage, parse and use it as the initial value
      return JSON.parse(jsonValue);
    }
  });

  // Use the useEffect hook to update local storage whenever the value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  // Return the value and a function to update the value as a tuple
  return [value, setValue] as [T, typeof setValue];
}
