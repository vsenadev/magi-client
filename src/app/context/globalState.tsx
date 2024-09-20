'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalStateContextProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  text: any;
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

export const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('pt');
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const text = require('../../data/language.json');

  return (
    <GlobalStateContext.Provider value={{
      language, setLanguage, text,
      user, setUser,
      password, setPassword,
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
