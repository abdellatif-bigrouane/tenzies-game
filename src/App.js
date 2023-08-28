import { useEffect, useState } from "react";
import Main from "./components/main";
import {ThemeContext } from "./context/themeContext";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme !== null) {
      setIsDarkTheme(JSON.parse(savedTheme));
    } else {
      //check default theme of browser
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkTheme(true);
      } else {
        setIsDarkTheme(false);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkTheme', JSON.stringify(isDarkTheme));
    document.body.style.background = isDarkTheme ? '#171a0f' : '#394220'
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };


  return (
    <ThemeContext.Provider value={{isDarkTheme, toggleTheme}}>
      <Main />
    </ThemeContext.Provider>
  );
}

export default App;
