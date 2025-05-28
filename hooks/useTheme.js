import React, { useState, useEffect } from "react";

const useTheme = () => {

  const themes = [
    { id: 0, name: "blue", color: "#0070f3" },
    { id: 1, name: "green", color: "#10B981" },
    { id: 2, name: "violet", color: "#8B5CF6" },
    { id: 3, name: "yellow", color: "#FBBF24" },
    { id: 4, name: "red", color: "#E11D48" },
  ];

  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  const setTheme = (id) => {
    const requiredTheme = themes.find((item) => id == item.id);

    if (requiredTheme) setCurrentTheme(requiredTheme);

  };

  useEffect(() => {
    let root = document.documentElement;
    root.style.setProperty("--color", currentTheme.color);
  }, [currentTheme]);

  return { themes, setTheme, currentTheme };
};

export default useTheme;
