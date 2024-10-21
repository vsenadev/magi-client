'use client'

import styles from './Tab.module.sass';
import Tab from "@/components/Tab";
import { useEffect, useState } from "react";
import SearchIcon from '@/../public/img/search-icon.svg';
import { IOption } from "@/interface/SelectOption.interface";
import { http } from "@/environment/environment";
import { useGlobalState } from "@/context/globalState";
import Modal from "../../../components/ModalCompanies";

export default function TabCompanies() {
    const { setCompanies, allCompanies, activeModalCompany, setActiveModalCompany } = useGlobalState();
    const [search, setSearch] = useState<string>('');
    const [activeType, setActiveType] = useState<boolean>(false);
    const [activeStatus, setActiveStatus] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [statusOptions, setStatusOptions] = useState<IOption[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    async function getAllTypeAccount() {
        const res = await http.get('v1/typeaccount');
        setTypeOptions([{value: '', name: 'Sem filtro'}, ...res.data]);

    }

    async function getAllStatus() {
        const res = await http.get('v1/statusaccount');
        setStatusOptions([{value: '', name: 'Sem filtro'}, ...res.data]);
    }

    useEffect(() => {
        getAllTypeAccount();
        getAllStatus();
    }, []);

    useEffect(() => {
        filterCompanies();
    }, [search, selectedType, selectedStatus]);

    function filterCompanies() {
        if (!search && !selectedType && !selectedStatus) {
            setCompanies(allCompanies);
            return;
        }

        const filteredCompanies = allCompanies.filter(company => {
            const matchesSearch =
                company.name.toLowerCase().includes(search.toLowerCase()) ||
                company.cnpj.includes(search);
            const matchesType = selectedType ? company.type_account === selectedType : true;
            const matchesStatus = selectedStatus ? company.status_account === selectedStatus : true;

            return matchesSearch && matchesType && matchesStatus;
        });

        setCompanies(filteredCompanies);
    }

    return (
        <div className={styles.container}>
            <Tab
                searchPlaceholder="Pesquise por nome ou CNPJ"
                searchValue={search}
                searchState={setSearch}
                searchIcon={SearchIcon.src}
                searchType='text'
                searchWidth="35%"
                firstSelectOptionPlaceholder="Tipo de Funcionário"
                firstSelectOptionActive={activeType}
                firstSelectOptionOptions={typeOptions}
                firstSelectOptionSetActive={setActiveType}
                firstSelectOptionValue={selectedType}
                firstSelectOptionSetValue={setSelectedType}
                secondSelectOptionPlaceholder="Status"
                secondSelectOptionActive={activeStatus}
                secondSelectOptionOptions={statusOptions}
                secondSelectOptionSetActive={setActiveStatus}
                secondSelectOptionValue={selectedStatus}
                secondSelectOptionSetValue={setSelectedStatus}
                buttonText='ADICIONAR FUNCIONÁRIO'
                buttonAction={setActiveModalCompany}
            />
            {
                activeModalCompany && (
                    <section className={styles.container__modal}>
                        <Modal
                            title='Funcionário'
                        />
                    </section>
                )
            }
        </div>
    )
}
