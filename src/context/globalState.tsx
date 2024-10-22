'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ICompanies } from "@/interface/Companies.interface";
import { IEmployees } from '@/interface/Employees.interface';

interface GlobalStateContextProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  text: any;
  user: IEmployees[],
  setUser: React.Dispatch<React.SetStateAction<IEmployees[]>>;
  allUsers: IEmployees[],
  setAllUsers: React.Dispatch<React.SetStateAction<IEmployees[]>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  companies: ICompanies[],
  setCompanies: React.Dispatch<React.SetStateAction<ICompanies[]>>;
  allCompanies: ICompanies[],
  setAllCompanies: React.Dispatch<React.SetStateAction<ICompanies[]>>;
  idSelected: number | null;
  setIdSelected: React.Dispatch<React.SetStateAction<number | null>>;
  activeModalCompany: boolean;
  setActiveModalCompany: React.Dispatch<React.SetStateAction<boolean>>;
  activeModalEmployees: boolean;
  setActiveModalEmployees: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('pt');
  const [user, setUser] = useState<IEmployees[]>([]);
  const [allUsers, setAllUsers] = useState<IEmployees[]>([]);
  const [password, setPassword] = useState<string>('');
  const text = require('../data/language.json');
  const [companies, setCompanies] = useState<ICompanies[]>([]);
  const [allCompanies, setAllCompanies] = useState<ICompanies[]>([]);
  const [idSelected, setIdSelected] = useState<number | null>(null);
  const [activeModalCompany, setActiveModalCompany] = useState<boolean>(false);
  const [activeModalEmployees, setActiveModalEmployees] = useState<boolean>(false);


  return (
    <GlobalStateContext.Provider value={{
      language, setLanguage, text,
      password, setPassword,
      companies, setCompanies,
      allCompanies, setAllCompanies,
      user, setUser,
      allUsers, setAllUsers,
      idSelected, setIdSelected,
      activeModalCompany, setActiveModalCompany,
      activeModalEmployees, setActiveModalEmployees,
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
