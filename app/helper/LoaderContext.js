"use client";

import { createContext, useState, useContext } from "react";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}
