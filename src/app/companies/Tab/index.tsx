'use client'

import styles from './Tab.module.sass';
import Tab from "@/components/Tab";
import {useEffect, useState} from "react";
import SearchIcon from '@/../public/img/search-icon.svg';
import {IOption} from "@/interface/SelectOption.interface";
import {http} from "@/environment/environment";

export default function TabCompanies(){
    const [search, setSearch] = useState<string>('');
    const [activeType, setActiveType] = useState<boolean>(false);
    const [activeStatus, setActiveStatus] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [statusOption, setStatusOptions] = useState<IOption[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    async function getAllTypeAccount() {
        await http.get('v1/typeaccount').then(res => {setTypeOptions(res.data)});
    }

    async function getAllStatus() {
        await http.get('v1/statusaccount').then(res => {setStatusOptions(res.data)});
    }

    useEffect(() => {
        getAllTypeAccount()
        getAllStatus()
    }, []);

    return(
        <div>
            <Tab
                searchPlaceholder="Pesquise por nome ou CNPJ"
                searchValue={search}
                searchState={setSearch}
                searchIcon={SearchIcon.src}
                searchType='text'
                searchWidth="35%"
                firstSelectOptionPlaceholder="Tipo de empresa"
                firstSelectOptionActive={activeType}
                firstSelectOptionOptions={typeOptions}
                firstSelectOptionSetActive={setActiveType}
                firstSelectOptionValue={selectedType}
                firstSelectOptionSetValue={setSelectedType}
                secondSelectOptionPlaceholder="Status da conta"
                secondSelectOptionActive={activeStatus}
                secondSelectOptionOptions={statusOption}
                secondSelectOptionSetActive={setActiveStatus}
                secondSelectOptionValue={selectedStatus}
                secondSelectOptionSetValue={setSelectedStatus}
                buttonText='ADICIONAR EMPRESA'
            />
        </div>
    )
}