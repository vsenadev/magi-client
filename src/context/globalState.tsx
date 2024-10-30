'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ICompanies } from "@/interface/Companies.interface";
import { IEmployees } from '@/interface/Employees.interface';
import { IProduct } from '@/interface/Products.interface';
import { IDelivery } from '@/interface/Deliveries.interface';

interface GlobalStateContextProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  text: any;
  user: IEmployees[],
  setUser: React.Dispatch<React.SetStateAction<IEmployees[]>>;
  allUsers: IEmployees[],
  setAllUsers: React.Dispatch<React.SetStateAction<IEmployees[]>>;
  delivery: IDelivery[],
  setDelivery: React.Dispatch<React.SetStateAction<IDelivery[]>>;
  allDeliveries: IDelivery[],
  setAllDeliveries: React.Dispatch<React.SetStateAction<IDelivery[]>>;
  product: string,
  setProduct: React.Dispatch<React.SetStateAction<string>>;
  allProducts: IProduct[],
  setAllProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  companies: ICompanies[],
  setCompanies: React.Dispatch<React.SetStateAction<ICompanies[]>>;
  allCompanies: ICompanies[],
  setAllCompanies: React.Dispatch<React.SetStateAction<ICompanies[]>>;
  idSelected: number | null;
  setIdSelected: React.Dispatch<React.SetStateAction<number | null>>;
  activeModalDelivery: boolean;
  setActiveModalDelivery: React.Dispatch<React.SetStateAction<boolean>>;
  activeModalCompany: boolean;
  setActiveModalCompany: React.Dispatch<React.SetStateAction<boolean>>;
  activeModalEmployees: boolean;
  setActiveModalEmployees: React.Dispatch<React.SetStateAction<boolean>>;
  activeModalProducts: boolean;
  setActiveModalProducts: React.Dispatch<React.SetStateAction<boolean>>;
  companyId: number | null;
  setCompanyId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('pt');
  const [user, setUser] = useState<IEmployees[]>([]);
  const [allUsers, setAllUsers] = useState<IEmployees[]>([]);
  const [delivery, setDelivery] = useState<IDelivery[]>([]);
  const [allDeliveries, setAllDeliveries] = useState<IDelivery[]>([]);
  const [product, setProduct] = useState<string>('');
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [password, setPassword] = useState<string>('');
  const text = require('../data/language.json');
  const [companies, setCompanies] = useState<ICompanies[]>([]);
  const [allCompanies, setAllCompanies] = useState<ICompanies[]>([]);
  const [idSelected, setIdSelected] = useState<number | null>(null);
  const [activeModalCompany, setActiveModalCompany] = useState<boolean>(false);
  const [activeModalDelivery, setActiveModalDelivery] = useState<boolean>(false);
  const [activeModalEmployees, setActiveModalEmployees] = useState<boolean>(false);
  const [activeModalProducts, setActiveModalProducts] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<number | null>(null);


  return (
    <GlobalStateContext.Provider value={{
      language, setLanguage, text,
      password, setPassword,
      companies, setCompanies,
      allCompanies, setAllCompanies,
      delivery, setDelivery,
      allDeliveries, setAllDeliveries,
      user, setUser,
      allUsers, setAllUsers,
      product, setProduct,
      allProducts, setAllProducts,
      idSelected, setIdSelected,
      activeModalCompany, setActiveModalCompany,
      activeModalDelivery, setActiveModalDelivery,
      activeModalEmployees, setActiveModalEmployees,
      activeModalProducts, setActiveModalProducts,
      companyId, setCompanyId
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
