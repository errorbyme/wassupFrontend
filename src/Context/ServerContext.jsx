import React, { createContext, useContext, useState } from "react";

const serverContext = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState("");

  return (
    <serverContext.Provider value={{ user, setUser }}>
      {children}
    </serverContext.Provider>
  );
};

export const useServer = () => useContext(serverContext);
