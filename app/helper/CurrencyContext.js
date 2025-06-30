"use client";
import {createContext, useContext, useState, useEffect} from "react";

const CurrencyContext = createContext();
export const CurrencyProvider = ({children}) =>{
    const [currency,setCurrency] = useState('GBP');

    useEffect(() => {
        const storedCurrency = localStorage.getItem("currency");
        if (storedCurrency) {
            setCurrency(storedCurrency);
        } else {
            localStorage.setItem("currency", "GBP");
            setCurrency("GBP");
        }
    }, []);

    return (
        <CurrencyContext.Provider value={{currency,setCurrency}}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);